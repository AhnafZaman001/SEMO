/* =========================================================
   school-config.js -- THE ONE FILE TO EDIT for a new institution.

   Everything in this file is specific to how THIS school names its
   class sections and which subjects each grading stream studies.
   Nothing else in the codebase should need to change to onboard a
   different school -- the Excel-import parser in app.js
   (parseSheetForSection) already detects header rows, subject
   columns, and data start dynamically by scanning for keywords, so
   it works against any sheet layout as long as the section/subject
   info below matches this school's actual setup.

   To configure for a new school:
   1. Edit GROUP_LABELS -- name each grading stream/group this school
      actually uses (e.g. Pre-Medical, Pre-Engineering, Science,
      Arts... whatever streams this school has).
   2. Edit SUBJECT_SETS -- for each group above, list the subjects
      students in that stream are graded on. These need to
      (loosely) match the subject names/keywords that appear in this
      school's actual result sheets so the parser can find them --
      see SUBJECT_KEYWORDS further down in app.js if a subject isn't
      being detected.
   3. Edit SECTION_DEFS -- one entry per actual class section this
      school has. `sheetName` must match (or closely match -- the
      parser tolerates spacing/punctuation differences and small
      typos) the tab name in this school's Excel result sheets.
      `group` must be one of the keys defined in GROUP_LABELS/
      SUBJECT_SETS above.
   ========================================================= */

const GROUP_LABELS = {
  PM:   'Pre-Medical',
  PE:   'Pre-Engineering',
  ICS:  'ICS',
  ICOM: 'I.Com'
};

const SUBJECT_SETS = {
  PM:   ['Physics','Chemistry','Biology','English','Urdu','Islamiat','TQ'],
  PE:   ['Physics','Chemistry','Math','English','Urdu','Islamiat','TQ'],
  ICS:  ['Physics','Computer','Math','English','Urdu','Islamiat','TQ'],
  ICOM: ['Economics','B.Math','Accounting','Commerce','English','Urdu','Islamiat','TQ']
};

// key: internal id used throughout the app's data model (do not
// reuse a key once real student data has been imported under it --
// changing a key after the fact orphans existing records).
// sheetName: expected tab name in this school's Excel workbooks.
// group: must match a key in GROUP_LABELS/SUBJECT_SETS above.
const SECTION_DEFS_RAW = [
  {key:'F1A', sheetName:'F1A', group:'PM'},
  {key:'F1B', sheetName:'F1B', group:'PM'},
  {key:'F2', sheetName:'F2', group:'PM'},
  {key:'F3', sheetName:'F3', group:'PM'},
  {key:'F4', sheetName:'F4', group:'PM'},
  {key:'F10PM', sheetName:'F10 PM', group:'PM'},
  {key:'F11', sheetName:'F11', group:'PM'},
  {key:'F12', sheetName:'F12', group:'PM'},
  {key:'F16PM', sheetName:'F16 (PM)', group:'PM'},
  {key:'F6PE', sheetName:'F6 PE', group:'PE'},
  {key:'F9PE', sheetName:'F9 PE', group:'PE'},
  {key:'F10PE', sheetName:'F10 PE', group:'PE'},
  {key:'F13PE', sheetName:'F13 (PE)', group:'PE'},
  {key:'F16PE', sheetName:'F16 (PE)', group:'PE'},
  {key:'F7ICS', sheetName:'F7 ICS', group:'ICS'},
  {key:'F8ICS', sheetName:'F8 ICS', group:'ICS'},
  {key:'F9ICS', sheetName:'F9 ICS', group:'ICS'},
  {key:'F10ICS', sheetName:'F10 ICS', group:'ICS'},
  {key:'F13ICS', sheetName:'F13 (ICS)', group:'ICS'},
  {key:'F14ICS', sheetName:'F14 (ICS)', group:'ICS'},
  {key:'F15ICS', sheetName:'F15 (ICS)', group:'ICS'},
  {key:'F16ICS', sheetName:'F16 (ICS)', group:'ICS'},
  {key:'F16ICOM', sheetName:'F16 (i.com)', group:'ICOM'},
];

// --- Derived data below -- app.js consumes SECTION_DEFS/SECTION_BY_KEY.
// No need to touch this section when configuring a new school. ---
const SECTION_DEFS = SECTION_DEFS_RAW.map(d => ({
  ...d,
  label: `${d.sheetName} \u2014 ${GROUP_LABELS[d.group]}`,
  subjects: SUBJECT_SETS[d.group]
}));

const SECTION_BY_KEY = Object.fromEntries(SECTION_DEFS.map(d=>[d.key,d]));
