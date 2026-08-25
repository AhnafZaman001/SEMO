-- =========================================================
-- migration_005_fix_profiles_rls_recursion.sql
--
-- Fixes: 500 error on every profiles query, immediately after a
-- successful login -- symptom was the app briefly loading then
-- bouncing straight back to login.html for every user, regardless
-- of role.
--
-- Root cause: the "profiles: privileged roles can read all" policy
-- (in schema.sql) queries the profiles table FROM WITHIN a Row
-- Level Security policy defined ON the profiles table itself:
--
--   using (exists (select 1 from profiles p where p.id = auth.uid()
--                  and p.role in ('principal','coordinator','hod')))
--
-- Every time Postgres evaluates that policy, it has to run a query
-- against profiles -- which triggers RLS evaluation on profiles
-- again -- which runs the same policy again -- infinitely. Postgres
-- detects this and refuses with error 42P17 ("infinite recursion
-- detected in policy for relation \"profiles\""), which PostgREST
-- (Supabase's API layer) surfaces as a plain 500. This happens even
-- for a simple "give me my own row" query, since Postgres plans all
-- applicable SELECT policies on a table together -- it doesn't skip
-- evaluating a problematic policy just because a different, simpler
-- policy would have been sufficient on its own.
--
-- Fix: move the role lookup into a SECURITY DEFINER function. A
-- function like this runs with the privileges of whoever created it
-- (not the calling user's RLS-restricted context), so its internal
-- query to profiles does NOT re-trigger the RLS policy chain --
-- breaking the recursion entirely.
-- =========================================================

create or replace function public.current_profile_role()
returns user_role
language sql
security definer
set search_path = public
stable
as $$
  select role from profiles where id = auth.uid();
$$;

grant execute on function public.current_profile_role() to authenticated;

drop policy if exists "profiles: privileged roles can read all" on profiles;

create policy "profiles: privileged roles can read all"
  on profiles for select
  using (public.current_profile_role() in ('principal','coordinator','hod'));

-- "profiles: user can read own row" (auth.uid() = id) is untouched --
-- that one was never the problem, it doesn't self-reference profiles.

-- The 6 other policies below all had the same inline
-- `exists (select 1 from profiles p where ...)` pattern -- not
-- self-referential (these are policies ON sections/students/tests/
-- teacher_assignments, not on profiles), so they weren't the CAUSE
-- of the recursion error, but each one triggered a query against
-- profiles, which -- until the fix above -- would have hit the
-- broken recursive policy too. Updated for consistency and so this
-- pattern can't get copy-pasted into a new policy again later.

drop policy if exists "sections: principal/coordinator can write" on sections;
create policy "sections: principal/coordinator can write"
  on sections for all using (
    public.current_profile_role() in ('principal','coordinator')
  );

drop policy if exists "students: privileged roles read all" on students;
create policy "students: privileged roles read all"
  on students for select using (
    public.current_profile_role() in ('principal','coordinator','hod')
  );

drop policy if exists "students: principal/coordinator write" on students;
create policy "students: principal/coordinator write"
  on students for all using (
    public.current_profile_role() in ('principal','coordinator')
  );

drop policy if exists "assignments: principal/coordinator write" on teacher_assignments;
create policy "assignments: principal/coordinator write"
  on teacher_assignments for all using (
    public.current_profile_role() in ('principal','coordinator')
  );

drop policy if exists "tests: privileged roles read all" on tests;
create policy "tests: privileged roles read all"
  on tests for select using (
    public.current_profile_role() in ('principal','coordinator','hod')
  );

drop policy if exists "tests: principal/coordinator full write" on tests;
create policy "tests: principal/coordinator full write"
  on tests for all using (
    public.current_profile_role() in ('principal','coordinator')
  );
