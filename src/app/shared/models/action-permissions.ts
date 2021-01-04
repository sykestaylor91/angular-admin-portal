import {Role} from './role';

export enum ContentPermissions {
  all = 1,
  none,
  own
}

export interface ChangeHistoryPermissions {
  view: ContentPermissions;
  viewBlind: ContentPermissions;
  selectVersion: ContentPermissions;
}

export interface CommentPermissions {
  add: ContentPermissions;
  view: ContentPermissions;
  viewBlind: ContentPermissions;
  edit: ContentPermissions;
}

export interface Permissions {
  changeHistory: ChangeHistoryPermissions;
  comments: CommentPermissions;
  activityNotes: CommentPermissions;
  reviewNotes: CommentPermissions;
}

export interface RolePermissionsType {
  [key: string]: Permissions;
}

const RolePermissions: RolePermissionsType = {
  [Role.SuperAdmin]: {
    changeHistory: {
      view: ContentPermissions.all,
      viewBlind: ContentPermissions.all,
      selectVersion: ContentPermissions.all
    },
    comments: {
      add: ContentPermissions.all,
      view: ContentPermissions.all,
      viewBlind: ContentPermissions.all,
      edit: ContentPermissions.all
    },
    activityNotes: {
      add: ContentPermissions.all,
      view: ContentPermissions.all,
      viewBlind: ContentPermissions.all,
      edit: ContentPermissions.all
    },
    reviewNotes: {
      add: ContentPermissions.none,
      view: ContentPermissions.all,
      viewBlind: ContentPermissions.all,
      edit: ContentPermissions.none
    }
  },
  [Role.Admin]: {
    changeHistory: {
      view: ContentPermissions.none,
      viewBlind: ContentPermissions.none,
      selectVersion: ContentPermissions.none
    },
    comments: {
      add: ContentPermissions.none,
      view: ContentPermissions.none,
      viewBlind: ContentPermissions.none,
      edit: ContentPermissions.none
    },
    activityNotes: {
      add: ContentPermissions.all,
      view: ContentPermissions.all,
      viewBlind: ContentPermissions.all,
      edit: ContentPermissions.own
    },
    reviewNotes: {
      add: ContentPermissions.none,
      view: ContentPermissions.none,
      viewBlind: ContentPermissions.none,
      edit: ContentPermissions.none
    }
  },
  [Role.Provider]: {
    changeHistory: {
      view: ContentPermissions.all,
      viewBlind: ContentPermissions.all,
      selectVersion: ContentPermissions.all
    },
    comments: {
      add: ContentPermissions.all,
      view: ContentPermissions.all,
      viewBlind: ContentPermissions.all,
      edit: ContentPermissions.all
    },
    activityNotes: {
      add: ContentPermissions.all,
      view: ContentPermissions.all,
      viewBlind: ContentPermissions.all,
      edit: ContentPermissions.own
    },
    reviewNotes: {
      add: ContentPermissions.none,
      view: ContentPermissions.all,
      viewBlind: ContentPermissions.all,
      edit: ContentPermissions.none
    }
  },
  [Role.Publisher]: {
    changeHistory: {
      view: ContentPermissions.all,
      viewBlind: ContentPermissions.all,
      selectVersion: ContentPermissions.all
    },
    comments: {
      add: ContentPermissions.all,
      view: ContentPermissions.all,
      viewBlind: ContentPermissions.all,
      edit: ContentPermissions.all
    },
    activityNotes: {
      add: ContentPermissions.all,
      view: ContentPermissions.all,
      viewBlind: ContentPermissions.all,
      edit: ContentPermissions.own
    },
    reviewNotes: {
      add: ContentPermissions.none,
      view: ContentPermissions.all,
      viewBlind: ContentPermissions.all,
      edit: ContentPermissions.none
    }
  },
  [Role.Planner]: {
    changeHistory: {
      view: ContentPermissions.all,
      viewBlind: ContentPermissions.all,
      selectVersion: ContentPermissions.all
    },
    comments: {
      add: ContentPermissions.all,
      view: ContentPermissions.all,
      viewBlind: ContentPermissions.all,
      edit: ContentPermissions.all
    },
    activityNotes: {
      add: ContentPermissions.all,
      view: ContentPermissions.all,
      viewBlind: ContentPermissions.all,
      edit: ContentPermissions.own
    },
    reviewNotes: {
      add: ContentPermissions.none,
      view: ContentPermissions.all,
      viewBlind: ContentPermissions.all,
      edit: ContentPermissions.none
    }
  },
  [Role.Editor]: {
    changeHistory: {
      view: ContentPermissions.all,
      viewBlind: ContentPermissions.all,
      selectVersion: ContentPermissions.none
    },
    comments: {
      add: ContentPermissions.all,
      view: ContentPermissions.all,
      viewBlind: ContentPermissions.all,
      edit: ContentPermissions.all
    },
    activityNotes: {
      add: ContentPermissions.all,
      view: ContentPermissions.all,
      viewBlind: ContentPermissions.all,
      edit: ContentPermissions.own
    },
    reviewNotes: {
      add: ContentPermissions.none,
      view: ContentPermissions.all,
      viewBlind: ContentPermissions.all,
      edit: ContentPermissions.none
    }
  },
  [Role.EditorHelper]: {
    changeHistory: {
      view: ContentPermissions.all,
      viewBlind: ContentPermissions.none,
      selectVersion: ContentPermissions.none
    },
    comments: {
      add: ContentPermissions.all,
      view: ContentPermissions.all,
      viewBlind: ContentPermissions.none,
      edit: ContentPermissions.none
    },
    activityNotes: {
      add: ContentPermissions.all,
      view: ContentPermissions.all,
      viewBlind: ContentPermissions.all,
      edit: ContentPermissions.own
    },
    reviewNotes: {
      add: ContentPermissions.none,
      view: ContentPermissions.all,
      viewBlind: ContentPermissions.none,
      edit: ContentPermissions.none
    }
  },
  [Role.Author]: {
    changeHistory: {
      view: ContentPermissions.all,
      viewBlind: ContentPermissions.none,
      selectVersion: ContentPermissions.none
    },
    comments: {
      add: ContentPermissions.all,
      view: ContentPermissions.all,
      viewBlind: ContentPermissions.none,
      edit: ContentPermissions.none
    },
    activityNotes: {
      add: ContentPermissions.all,
      view: ContentPermissions.all,
      viewBlind: ContentPermissions.all,
      edit: ContentPermissions.own
    },
    reviewNotes: {
      add: ContentPermissions.none,
      view: ContentPermissions.all,
      viewBlind: ContentPermissions.none,
      edit: ContentPermissions.none
    }
  },
  [Role.Reviewer]: {
    changeHistory: {
      view: ContentPermissions.all,
      viewBlind: ContentPermissions.all,
      selectVersion: ContentPermissions.none
    },
    comments: {
      add: ContentPermissions.all,
      view: ContentPermissions.all,
      viewBlind: ContentPermissions.all,
      edit: ContentPermissions.all
    },
    activityNotes: {
      add: ContentPermissions.all,
      view: ContentPermissions.all,
      viewBlind: ContentPermissions.all,
      edit: ContentPermissions.own
    },
    reviewNotes: {
      add: ContentPermissions.own,
      view: ContentPermissions.all,
      viewBlind: ContentPermissions.all,
      edit: ContentPermissions.none
    }
  },
  [Role.Helper]: {
    changeHistory: {
      view: ContentPermissions.none,
      viewBlind: ContentPermissions.none,
      selectVersion: ContentPermissions.none
    },
    comments: {
      add: ContentPermissions.all,
      view: ContentPermissions.all,
      viewBlind: ContentPermissions.none,
      edit: ContentPermissions.all
    },
    activityNotes: {
      add: ContentPermissions.all,
      view: ContentPermissions.all,
      viewBlind: ContentPermissions.all,
      edit: ContentPermissions.own
    },
    reviewNotes: {
      add: ContentPermissions.none,
      view: ContentPermissions.none,
      viewBlind: ContentPermissions.none,
      edit: ContentPermissions.none
    }
  },
  [Role.MediaAdmin]: {
    changeHistory: {
      view: ContentPermissions.none,
      viewBlind: ContentPermissions.none,
      selectVersion: ContentPermissions.none
    },
    comments: {
      add: ContentPermissions.all,
      view: ContentPermissions.all,
      viewBlind: ContentPermissions.none,
      edit: ContentPermissions.all
    },
    activityNotes: {
      add: ContentPermissions.all,
      view: ContentPermissions.all,
      viewBlind: ContentPermissions.all,
      edit: ContentPermissions.own
    },
    reviewNotes: {
      add: ContentPermissions.none,
      view: ContentPermissions.none,
      viewBlind: ContentPermissions.none,
      edit: ContentPermissions.none
    }
  },
};

export {RolePermissions};
