# SEMO

A student performance tracking and reporting tool, built on the same
architecture as [AXIOM](https://github.com/AhnafZaman001/AXIOM) --
a separate, standalone deployment for a different institution.

No shared code, database, or infrastructure with AXIOM's production
(KIPS) setup. This is its own repo, its own Supabase project, and its
own hosting deployment.

## Stack

- Vanilla HTML / CSS / JavaScript -- no build step, no `npm install`
  required to run it
- [Supabase](https://supabase.com) -- database, auth, storage
- Deployed on [Cloudflare Pages](https://pages.cloudflare.com)

## Local development

Just open `index.html` in a browser, or serve the folder with any
static file server. There's nothing to compile.

## Setup (new deployment)

See `SETUP.md` for the full walkthrough. Short version:

1. Create a Supabase project.
2. Run `supabase/schema.sql`, then each numbered migration file in
   order, via the Supabase SQL Editor.
3. `js/supabase-client.js` already points at this deployment's own
   Supabase project (not AXIOM's). The anon key embedded there is
   meant to be public -- safe to commit -- access control is
   enforced server-side via Row Level Security, not by hiding this key.
4. Deploy on Cloudflare Pages (or any static host) -- no build
   command needed, output directory is the repo root.

## Configuration

Section names, subject lists, and grading streams live in one
clearly-labeled config block near the top of `js/app.js`
(`SECTION_DEFS` / `SUBJECT_SETS`), kept deliberately separate from
the rest of the app logic so this institution's class/section
structure can be set up by editing just that one place.
