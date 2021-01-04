import { Role } from '../../shared/models/role';
import {RoutesRp} from '../../shared/models/routes-rp';

export interface MenuModel {
  label: string;
  route?: string;
  permissions?: Role[];
  subMenu?: MenuModel[];
}

export const MenuItems: MenuModel[] = [
  {
    label: 'Dashboard',
    route: RoutesRp.Home,
    permissions: [Role.Provider, Role.Reviewer, Role.SuperAdmin, Role.Admin, Role.Editor, Role.EditorHelper, Role.MediaAdmin, Role.Author, Role.Helper, Role.MediaHelper, Role.Planner, Role.Publisher, Role.Reader],
    subMenu: []
  },
  {
    label: 'Getting started',
    route: '/getting-started',
    permissions: [ Role.SuperAdmin ],
    subMenu: []
  },
  {
    label: 'Activities',
    permissions: [Role.Provider, Role.Reviewer, Role.SuperAdmin, Role.Admin, Role.Editor, Role.EditorHelper, Role.MediaAdmin, Role.Author, Role.Helper, Role.MediaHelper, Role.Planner, Role.Publisher],
    subMenu: [
      {
        label: 'Activities',
        route: `/activity-manager/list`,
        permissions: [Role.Provider, Role.Reviewer, Role.SuperAdmin, Role.Admin, Role.Editor, Role.EditorHelper, Role.MediaAdmin, Role.Author, Role.Helper, Role.MediaHelper, Role.Planner, Role.Publisher]
      },
      {
        label: 'Post-activity evaluations',
        route: '/activity-manager/evaluation/list',
        permissions: [Role.Provider, Role.Reviewer, Role.SuperAdmin, Role.Admin, Role.Editor, Role.EditorHelper, Role.MediaAdmin, Role.Author, Role.Helper, Role.MediaHelper, Role.Planner, Role.Publisher]
      }
    ]
  },
  {
    label: 'Questions',
    permissions: [Role.Provider, Role.Reviewer, Role.SuperAdmin, Role.Admin, Role.Editor, Role.EditorHelper, Role.MediaAdmin, Role.Author, Role.Helper, Role.MediaHelper, Role.Planner, Role.Publisher],
    subMenu: [
      {
        label: 'Create New question',
        route: '/question-manager/new',
        permissions: [Role.Provider, Role.Reviewer, Role.SuperAdmin, Role.Admin, Role.Editor, Role.EditorHelper, Role.MediaAdmin, Role.Author, Role.Helper, Role.MediaHelper, Role.Planner, Role.Publisher]
      },
      {
        label: 'Activity questions',
        route: '/question-manager/list/activity',
        permissions: [Role.Provider, Role.Reviewer, Role.SuperAdmin, Role.Admin, Role.Editor, Role.EditorHelper, Role.MediaAdmin, Role.Author, Role.Helper, Role.MediaHelper, Role.Planner, Role.Publisher]
      },
      {
        label: 'SAQ questions',
        route: '/question-manager/list/serial-questions',
        permissions: [Role.Provider, Role.Reviewer, Role.SuperAdmin, Role.Admin, Role.Editor, Role.EditorHelper, Role.MediaAdmin, Role.Author, Role.Helper, Role.MediaHelper, Role.Planner, Role.Publisher]
      },
      // {
      //   label: 'Pre-activity questions',
      //   route: '/question-manager/list/pre-activity',
      //   permissions: [Role.Provider, Role.Reviewer, Role.SuperAdmin, Role.Admin, Role.Editor, Role.EditorHelper, Role.MediaAdmin, Role.Author, Role.Helper, Role.MediaHelper, Role.Planner, Role.Publisher]
      // },
      {
        label: 'Post-activity questions',
        route: '/question-manager/list/post-activity',
        permissions: [Role.Provider, Role.Reviewer, Role.SuperAdmin, Role.Admin, Role.Editor, Role.EditorHelper, Role.MediaAdmin, Role.Author, Role.Helper, Role.MediaHelper, Role.Planner, Role.Publisher]
      }
    ]
  },
// {
//     label: 'Clinical demo',
//         route: '/clinical-exam/ed04909106354fedb80f4f7fadf5afb9',
//   permissions: [ Role.SuperAdmin ],
//   subMenu: []
// },
{ label: 'Clinical',
    permissions: [Role.Provider, Role.Reviewer, Role.SuperAdmin, Role.Admin, Role.Editor, Role.EditorHelper, Role.MediaAdmin, Role.Author, Role.Helper, Role.MediaHelper, Role.Planner, Role.Publisher],
    subMenu: [
    {
        label: 'Clinical examinations',
        route: '/clinical/list',
        permissions: [Role.SuperAdmin]
    },
    {
        label: 'Circuits',
        route: '/clinical/circuit-list',
        permissions: [Role.SuperAdmin]
    },
    {
        label: 'Stations',
        route: '/clinical/station-list',
        permissions: [Role.SuperAdmin]
    },
    {
        label: 'Questions/items',
        route: '/clinical/item-list',
        permissions: [Role.SuperAdmin]
    } // ,
//    {
//        label: 'Analysis',
//        route: '/clinical/clinical-analysis',
//        permissions: [Role.Provider, Role.Reviewer, Role.SuperAdmin, Role.Admin, Role.Editor, Role.EditorHelper, Role.MediaAdmin, Role.Author, Role.Helper, Role.MediaHelper, Role.Planner, Role.Publisher, Role.Reader]
//    }
]
},
  {
    label: 'Media',
    permissions: [Role.Provider, Role.Reviewer, Role.SuperAdmin, Role.Admin, Role.Editor, Role.EditorHelper, Role.MediaAdmin, Role.Author, Role.Helper, Role.MediaHelper, Role.Planner, Role.Publisher],
    subMenu: [
      {
        label: 'Upload new',
        route: '/media/add-new',
        permissions: [Role.Provider, Role.Reviewer, Role.SuperAdmin, Role.Admin, Role.Editor, Role.EditorHelper, Role.MediaAdmin, Role.Author, Role.Helper, Role.MediaHelper, Role.Planner, Role.Publisher]
      },
      {
        label: 'All media',
        route: '/media/library/all',
        permissions: [Role.Provider, Role.Reviewer, Role.SuperAdmin, Role.Admin, Role.Editor, Role.EditorHelper, Role.MediaAdmin, Role.Author, Role.Helper, Role.MediaHelper, Role.Planner, Role.Publisher]
      },
      {
        label: 'PDF library',
        route: '/media/library/pdf',
        permissions: [Role.Provider, Role.Reviewer, Role.SuperAdmin, Role.Admin, Role.Editor, Role.EditorHelper, Role.MediaAdmin, Role.Author, Role.Helper, Role.MediaHelper, Role.Planner, Role.Publisher]
      },
      {
        label: 'Image library',
        route: '/media/library/image',
        permissions: [Role.Provider, Role.Reviewer, Role.SuperAdmin, Role.Admin, Role.Editor, Role.EditorHelper, Role.MediaAdmin, Role.Author, Role.Helper, Role.MediaHelper, Role.Planner, Role.Publisher]
      },
      {
        label: 'Audio library',
        route: '/media/library/audio',
        permissions: [Role.Provider, Role.Reviewer, Role.SuperAdmin, Role.Admin, Role.Editor, Role.EditorHelper, Role.MediaAdmin, Role.Author, Role.Helper, Role.MediaHelper, Role.Planner, Role.Publisher]
      },
      {
        label: 'Video library',
        route: '/media/library/video',
        permissions: [Role.Provider, Role.Reviewer, Role.SuperAdmin, Role.Admin, Role.Editor, Role.EditorHelper, Role.MediaAdmin, Role.Author, Role.Helper, Role.MediaHelper, Role.Planner, Role.Publisher]
      }
    ]
  },
  {
    label: 'Citations',
    permissions: [Role.Provider, Role.Reviewer, Role.SuperAdmin, Role.Admin, Role.Editor, Role.EditorHelper, Role.MediaAdmin, Role.Author, Role.Helper, Role.MediaHelper, Role.Planner, Role.Publisher],
    subMenu: [
      {
        label: 'Citation library',
        route: '/citation-library',
        permissions: [Role.Provider, Role.Reviewer, Role.SuperAdmin, Role.Admin, Role.Editor, Role.EditorHelper, Role.MediaAdmin, Role.Author, Role.Helper, Role.MediaHelper, Role.Planner, Role.Publisher]
      }
    ]
  },
  {
    label: 'Contributors',
    permissions: [Role.SuperAdmin, Role.Editor, Role.Planner, Role.Author],
    subMenu: [
      {
        label: 'Invitations',
        route: '/contributor/invitation',
        permissions: [Role.SuperAdmin, Role.Editor, Role.Planner, Role.Publisher]
      },
      {
        label: 'Manage contributors',
        route: '/view-contributors',
        permissions: [Role.SuperAdmin, Role.Editor, Role.Planner, Role.Publisher]
      },
/*      {
        label: 'Overdue declarations',
        route: '/contributor/declarations-overdue-404',
        permissions: [Role.SuperAdmin, Role.Editor, Role.Planner, Role.Author]
      }*/
    ]
  },
  {
    label: 'Readers',
    permissions: [Role.SuperAdmin],
    subMenu: [
      {
        label: 'Registration',
        route: '/simple-registration',
        permissions: [Role.SuperAdmin]
      },
      {
        label: 'My account',
        route: '/reader/account',
        permissions: [Role.SuperAdmin]
      },
      {
        label: 'Reader communications',
        route: '/communications-404',
        permissions: [Role.SuperAdmin]
      }
    ]
  },
  // {
  //   label: 'Admin and account',
  //   permissions: [Role.SuperAdmin, Role.Publisher, Role.Provider, Role.Planner, Role.Admin],
  //   subMenu: [
  //     // {
  //     //   label: 'Registration record',
  //     //   route: '/provider/registration',
  //     //   permissions: [Role.SuperAdmin, Role.Publisher, Role.Provider, Role.Planner]
  //     // },
  //     {
  //       label: 'Provider account',
  //       route: '/account-404-3',
  //       permissions: [Role.SuperAdmin, Role.Publisher, Role.Provider, Role.Planner, Role.Admin]
  //     },
  //     {
  //       label: 'Provider communications',
  //       route: '/communications-404-2',
  //       permissions: [Role.SuperAdmin, Role.Publisher, Role.Provider, Role.Planner]
  //     }
  //   ]
  // },
  // {
  //   label: 'My declarations',
  //   permissions: [Role.Provider, Role.Reviewer, Role.SuperAdmin, Role.Admin, Role.Editor, Role.EditorHelper, Role.MediaAdmin, Role.Author, Role.Helper, Role.MediaHelper, Role.Planner, Role.Publisher],
  //   subMenu: [
  //     {
  //       label: 'My disclosures',
  //       route: '/contributor/disclosure/edit',
  //       permissions: [Role.Provider, Role.Reviewer, Role.SuperAdmin, Role.Admin, Role.Editor, Role.EditorHelper, Role.MediaAdmin, Role.Author, Role.Helper, Role.MediaHelper, Role.Planner, Role.Publisher]
  //     },
  //     {
  //       label: 'My publications',
  //       route: '/publications',
  //       permissions: [Role.Provider, Role.Reviewer, Role.SuperAdmin, Role.Admin, Role.Editor, Role.EditorHelper, Role.MediaAdmin, Role.Author, Role.Helper, Role.MediaHelper, Role.Planner, Role.Publisher]
  //     },
  //     {
  //       label: 'My credentials',
  //       route: '/contributor/credentials',
  //       permissions: [Role.Provider, Role.Reviewer, Role.SuperAdmin, Role.Admin, Role.Editor, Role.EditorHelper, Role.MediaAdmin, Role.Author, Role.Helper, Role.MediaHelper, Role.Planner, Role.Publisher]
  //     }
  //   ]
  // },
  {
    label: 'Metrics',
    permissions: [Role.Provider, Role.Reviewer, Role.SuperAdmin, Role.Admin, Role.Editor, Role.EditorHelper, Role.MediaAdmin, Role.Author, Role.Helper, Role.MediaHelper, Role.Planner, Role.Publisher],
    subMenu: [
      {
        label: 'Reader metrics',
        route: '/reports/reader-performance',
        permissions: [Role.SuperAdmin, Role.Provider, Role.Planner, Role.Publisher]
      },
      {
        label: 'Performance metrics',
        route: '/reports/activity-performance',
        permissions: [Role.Provider, Role.Reviewer, Role.SuperAdmin, Role.Admin, Role.Editor, Role.EditorHelper, Role.MediaAdmin, Role.Author, Role.Helper, Role.MediaHelper, Role.Planner, Role.Publisher]
      }
    ]
  }
];
