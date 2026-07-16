// Edvimia · invite-staff edge function
// Called by school admins to invite a teacher/staff member via email.
// Uses the service-role key to call auth.admin.inviteUserByEmail, then
// pre-provisions their profile (school_id) and user_role so the AuthProvider
// self-heal does not create a spurious second school for them.
// deno-lint-ignore-file no-explicit-any
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.4";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const service    = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

    // Authenticate the caller
    const authHeader = req.headers.get("Authorization") ?? "";
    const jwt = authHeader.replace(/^Bearer\s+/i, "");
    if (!jwt) return json({ error: "Missing token" }, 401);

    const admin = createClient(supabaseUrl, service, {
      auth: { persistSession: false, autoRefreshToken: false },
    });

    const { data: userData, error: uErr } = await admin.auth.getUser(jwt);
    if (uErr || !userData?.user) return json({ error: "Unauthorized" }, 401);
    const callerId = userData.user.id;

    const body = await req.json().catch(() => ({}));
    const { email, full_name, school_id, redirect_to } = body as {
      email?: string;
      full_name?: string;
      school_id?: string;
      redirect_to?: string;
    };

    if (!email)     return json({ error: "email is required" }, 400);
    if (!school_id) return json({ error: "school_id is required" }, 400);

    // Confirm caller is a school_admin or super_admin
    const { data: roleRow } = await admin
      .from("user_roles")
      .select("role")
      .eq("user_id", callerId)
      .in("role", ["school_admin", "super_admin"])
      .maybeSingle();

    if (!roleRow) return json({ error: "Forbidden: not a school admin" }, 403);

    // For school_admin, also confirm they belong to this specific school
    if (roleRow.role === "school_admin") {
      const { data: callerProfile } = await admin
        .from("profiles")
        .select("school_id")
        .eq("id", callerId)
        .maybeSingle();
      if (!callerProfile || callerProfile.school_id !== school_id) {
        return json({ error: "Forbidden: not an admin of this school" }, 403);
      }
    }

    // Send the invite — Supabase creates the auth user in 'invited' state
    const { data: inviteData, error: inviteErr } = await admin.auth.admin.inviteUserByEmail(
      email,
      {
        data: { full_name: full_name ?? null, school_id, initial_role: "teacher" },
        ...(redirect_to ? { redirectTo: redirect_to } : {}),
      },
    );

    if (inviteErr) {
      // 422 "User already registered" — they have an account; just ensure access
      const alreadyExists = inviteErr.message.toLowerCase().includes("already") ||
        (inviteErr as any).status === 422;

      if (!alreadyExists) return json({ error: inviteErr.message }, 500);

      // Find their existing auth user by email
      const { data: list } = await admin.auth.admin.listUsers({ perPage: 1000 });
      const existing = list?.users?.find((u: any) => u.email === email);
      if (!existing) return json({ error: inviteErr.message }, 500);

      await provisionAccess(admin, existing.id, full_name ?? null, email, school_id);
      return json({ ok: true, invited: false });
    }

    const newUserId = inviteData.user.id;
    await provisionAccess(admin, newUserId, full_name ?? null, email, school_id);
    return json({ ok: true, invited: true });

  } catch (e: any) {
    return json({ error: e?.message ?? "Unexpected error" }, 500);
  }
});

/** Set profile.school_id and ensure a 'teacher' role exists for this user. */
async function provisionAccess(
  admin: ReturnType<typeof createClient>,
  userId: string,
  full_name: string | null,
  email: string,
  school_id: string,
) {
  // Upsert profile — overrides the null school_id written by the auth trigger
  await admin.from("profiles").upsert(
    { id: userId, full_name, email, school_id },
    { onConflict: "id" },
  );

  // Insert teacher role (ignore if already present)
  await admin.from("user_roles")
    .insert({ user_id: userId, role: "teacher" })
    .throwOnError()
    .catch(() => {/* duplicate — fine */});
}

function json(payload: unknown, status = 200) {
  return new Response(JSON.stringify(payload), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}
