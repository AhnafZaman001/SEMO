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

1. Create a Supabase project.
2. Run the SQL files in `supabase/` **in order** (`schema.sql` first,
   then each numbered migration) via the Supabase SQL Editor.
3. Update the Supabase URL and anon key in `js/supabase-client.js`
   to point at your project. The anon key is meant to be public --
   safe to commit -- access control is enforced server-side via Row
   Level Security policies, not by hiding this key.
4. Deploy the repo on Cloudflare Pages (or any static host) -- no
   build command needed, the output directory is the repo root.

## Configuration

Section names, subject lists, and grading streams are defined in a
single config block near the top of `js/app.js`, kept intentionally
separate from the rest of the app logic so a new institution's
class/section structure can be set up by editing just that one place.

## Status

Early setup -- this README will be filled in further as the actual
institution's requirements, section structure, and subject streams
are configured.
