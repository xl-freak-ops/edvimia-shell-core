-- RPC: get_school_members(_school_id)
-- Returns the profile + primary role for every user who has a row in user_roles
-- for the given school.  Runs as SECURITY DEFINER so it can read across all
-- profiles without hitting the "Users view own profile" RLS restriction.
-- The caller must themselves be a member of the school (enforced via is_school_member).

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
  SELECT
    p.id,
    p.full_name,
    p.email,
    p.avatar_url,
    -- Pick one role per user (highest-privilege first via arbitrary ordering)
    (
      SELECT ur2.role::text
      FROM public.user_roles ur2
      WHERE ur2.user_id = p.id
        AND ur2.school_id = _school_id
      ORDER BY ur2.role::text
      LIMIT 1
    ) AS role
  FROM (
    -- All distinct user IDs that belong to this school
    SELECT DISTINCT user_id
    FROM public.user_roles
    WHERE school_id = _school_id
  ) members
  JOIN public.profiles p ON p.id = members.user_id
  -- Security gate: the caller must also be a member of this school
  WHERE public.is_school_member(_school_id)
  ORDER BY p.full_name;
$$;

REVOKE EXECUTE ON FUNCTION public.get_school_members(uuid) FROM PUBLIC, anon;
GRANT  EXECUTE ON FUNCTION public.get_school_members(uuid) TO authenticated;
