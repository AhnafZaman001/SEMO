/* =========================================================
   school-config.js -- starting state for a brand-new school.

   This file used to be "the one file to edit" with hardcoded section
   names and subject streams for a specific school. That's gone now --
   sections and subject groups are admin-configurable data, stored in
   Supabase (subject_groups / sections tables), not code. A new
   institution sets these up through the app itself:

     Add Section panel -> "+ Create new subject group" -> name it
     (e.g. "Science", "Commerce", "Pre-Medical" -- whatever this
     school actually calls its streams) and list its subjects -> then
     add sections under that group.

   GROUP_LABELS and SUBJECT_SETS below start EMPTY and get filled in
   at runtime (see registerCloudSubjectGroup() in app.js, called from
   auth-guard.js right after the Supabase workspace load) from
   whatever groups this school has actually created. SECTION_DEFS_RAW
   starts empty for the same reason -- registerCloudSectionDef()
   fills in SECTION_DEFS/SECTION_BY_KEY from the cloud once signed in.

   None of this needs editing by hand anymore. If you're reading this
   file wondering where to add your school's sections: don't -- sign
   in as a principal/coordinator and use Add Section in the app.
   ========================================================= */

const GROUP_LABELS = {};   // populated at runtime from the subject_groups table
const SUBJECT_SETS = {};   // populated at runtime from the subject_groups table
const SECTION_DEFS_RAW = []; // this school hasn't created any sections yet

// --- Derived data below -- app.js consumes SECTION_DEFS/SECTION_BY_KEY.
// Kept as `let`, not `const`, since addSectionDef()/removeSectionDef()/
// registerCloudSectionDef() in app.js mutate these in place (push/splice)
// as sections get created through the app, not just at load time. ---
let SECTION_DEFS = SECTION_DEFS_RAW.map(d => ({
  ...d,
  label: `${d.sheetName} \u2014 ${GROUP_LABELS[d.group]}`,
  subjects: SUBJECT_SETS[d.group]
}));

let SECTION_BY_KEY = Object.fromEntries(SECTION_DEFS.map(d=>[d.key,d]));
