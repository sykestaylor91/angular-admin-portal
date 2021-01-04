export enum Role {
  SuperAdmin = 'super_admin', // system administrator
  Provider = 'provider',
  Planner = 'planner',
  Publisher = 'publisher',
  Author = 'author',
  Reader = 'reader',
  Editor = 'editor',
  Reviewer = 'reviewer',
  Helper = 'helper',
  EditorHelper = 'editor_helper',
  MediaAdmin = 'media_admin',
  MediaHelper = 'media_helper',
  Admin = 'admin', // Admin is like an office administrator, not a system admin.
  ClinicalLeadExaminer = 'clinical_lead_examiner',
  ClinicalExaminer = 'clinical_examiner',
  ClinicalCandidate = 'clinical_candidate'
}

// ordered from weakest to strongest roles
export let RoleHierarchy = [
  Role.ClinicalCandidate,
  Role.ClinicalExaminer,
  Role.ClinicalLeadExaminer,
  Role.Reader,
  Role.Admin,
  Role.MediaHelper,
  Role.MediaAdmin,
  Role.EditorHelper,
  Role.Helper,
  Role.Reviewer,
  Role.Author,
  Role.Editor,
  Role.Publisher,
  Role.Planner,
  Role.Provider,
  Role.SuperAdmin
];
