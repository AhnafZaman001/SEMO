-- =========================================================
-- migration_006_custom_subject_groups.sql
--
-- Removes the hardcoded 4-stream limitation (Pre-Medical/Pre-
-- Engineering/ICS/I.Com) that was baked into this app as JS
-- constants (GROUP_LABELS/SUBJECT_SETS in js/school-config.js).
-- Every school has its own stream names and subject lists -- this
-- makes that admin-configurable data instead of code a developer
-- has to edit.
--
-- A "subject group" is a named stream (e.g. "Pre-Medical", "Science",
-- "Commerce" -- whatever this school actually calls it) with its own
-- list of subjects. Multiple class sections can share one group, the
-- same way multiple sections already share one subject_group key in
-- the sections table.
-- =========================================================

create table if not exists subject_groups (
  key      text primary key,      -- short internal id, e.g. "PM" or "SCI"
  label    text not null,         -- display name, e.g. "Pre-Medical"
  subjects text[] not null        -- e.g. '{"Physics","Chemistry","Biology","English"}'
);

alter table subject_groups enable row level security;

create policy "subject_groups: everyone logged in can read"
  on subject_groups for select using (auth.uid() is not null);

create policy "subject_groups: principal/coordinator can write"
  on subject_groups for all using (
    public.current_profile_role() in ('principal','coordinator')
  );

grant select, insert, update, delete on subject_groups to authenticated;
