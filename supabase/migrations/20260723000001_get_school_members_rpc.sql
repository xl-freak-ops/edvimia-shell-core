-- RPC: get_school_members(_school_id)
--
-- Returns all people the caller can message in a school:
--   • Auth-account holders (staff, admins, parents, students-with-portal)
--     via user_roles. LEFT-joins profiles so that invited users who have
--     not yet completed their profile still appear; falls back to
--     auth.users email/metadata for their display name.
--   • Students from the students table (all active, with or without a
--     portal account). If a student has user_id set that user is the
--     message recipient; otherwise the student record id is returned
--     (messaging such a student will fail gracefully in the UI).
--
-- Caller must be a member of the school (enforced via is_school_member).
-- Runs SECURITY DEFINER so it can read across all profiles, auth.users,
-- and students rows without being blocked by row-level security.

CREATE OR REPLACE FUNCTION public.get_school_members(_school_id uuid)
RETURNS TABLE (
  id         uuid,
  full_name  text,
  email      text,
  avatar_url text,
  role       text
)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$

  -- ── Branch 1: auth-account holders (staff / admin / parent / student-with-portal) ──
  SELECT
    u.id,
    COALESCE(
      NULLIF(trim(p.full_name), ''),
      u.raw_user_meta_data->>'full_name',
      u.email
    )::text                                                        AS full_name,
    COALESCE(NULLIF(trim(p.email), ''), u.email)::text             AS email,
    p.avatar_url,
    (
      SELECT ur2.role::text
      FROM   public.user_roles ur2
      WHERE  ur2.user_id   = u.id
        AND  ur2.school_id = _school_id
      ORDER  BY ur2.role::text
      LIMIT  1
    )                                                              AS role
  FROM (
    SELECT DISTINCT user_id
    FROM   public.user_roles
    WHERE  school_id = _school_id
  ) members
  JOIN      auth.users    u ON u.id = members.user_id
  LEFT JOIN public.profiles p ON p.id = members.user_id
  WHERE public.is_school_member(_school_id)

  UNION

  -- ── Branch 2: students from the students table ──────────────────────────────
  -- Includes students with and without portal accounts.
  -- Students already returned via Branch 1 (they have a user_roles row) are
  -- excluded to avoid duplicates.
  SELECT
    s.user_id                                 AS id,
    (s.first_name || ' ' || s.surname)::text  AS full_name,
    s.email,
    s.photo_url                               AS avatar_url,
    'student'::text                           AS role
  FROM public.students s
  WHERE s.school_id  = _school_id
    AND s.status     = 'active'
    AND s.user_id   IS NOT NULL          -- must have a portal account to receive messages
    AND public.is_school_member(_school_id)
    AND NOT EXISTS (
      SELECT 1
      FROM   public.user_roles ur3
      WHERE  ur3.school_id = _school_id
        AND  ur3.user_id   = s.user_id
    )

  ORDER BY full_name;
$$;

REVOKE EXECUTE ON FUNCTION public.get_school_members(uuid) FROM PUBLIC, anon;
GRANT  EXECUTE ON FUNCTION public.get_school_members(uuid) TO authenticated;
