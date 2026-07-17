// Edvimia · delete-staff edge function
// Fully removes a staff member:
//   1. Deletes their user_roles row for this school
//   2. Deletes their staff + staff_assignments rows
//   3. Deletes their auth.users record IF they have no remaining roles at any school
//      (guards against the case where one person is staff at multiple schools)
// deno-lint-ignore-file no-explicit-any
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.4";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return json(null, 204);

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const service = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

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
    const { staff_id, school_id } = body as {
      staff_id?: string;
      school_id?: string;
    };

    if (!staff_id) return json({ error: "staff_id is required" }, 400);
    if (!school_id) return json({ error: "school_id is required" }, 400);

    // Confirm caller is school_admin or super_admin
    const { data: roleRows } = await admin
      .from("user_roles")
      .select("role")
      .eq("user_id", callerId)
      .in("role", ["school_admin", "super_admin"])
      .limit(1);

    const roleRow = roleRows?.[0] ?? null;
    if (!roleRow) return json({ error: "Forbidden: not a school admin" }, 403);

    // For school_admin, confirm they belong to this school
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

    // Fetch the staff record to get their auth user_id
    const { data: staffRow, error: staffErr } = await admin
      .from("staff")
      .select("id, user_id")
      .eq("id", staff_id)
      .eq("school_id", school_id)
      .maybeSingle();

    if (staffErr) return json({ error: staffErr.message }, 500);
    if (!staffRow) return json({ error: "Staff member not found" }, 404);

    const linkedUserId: string | null = staffRow.user_id ?? null;

    // 1. Remove their role at this school
    if (linkedUserId) {
      await admin
        .from("user_roles")
        .delete()
        .eq("user_id", linkedUserId)
        .eq("school_id", school_id);
    }

    // 2. Delete staff_assignments then the staff row itself
    await admin.from("staff_assignments").delete().eq("staff_id", staff_id);
    await admin.from("staff").delete().eq("id", staff_id);

    // 3. If the user has no remaining roles at ANY school, delete their auth account
    //    so they can be re-invited cleanly later.
    if (linkedUserId) {
      const { data: remaining } = await admin
        .from("user_roles")
        .select("id")
        .eq("user_id", linkedUserId)
        .limit(1);

      if (!remaining || remaining.length === 0) {
        const { error: deleteAuthErr } = await admin.auth.admin.deleteUser(linkedUserId);
        if (deleteAuthErr) {
          // Non-fatal — the staff record is already gone; log and continue
          console.error("Could not delete auth user:", deleteAuthErr.message);
        }
      }
    }

    return json({ ok: true });
  } catch (e: any) {
    return json({ error: e?.message ?? "Unexpected error" }, 500);
  }
});

function json(payload: unknown, status = 200) {
  return new Response(JSON.stringify(payload), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}
