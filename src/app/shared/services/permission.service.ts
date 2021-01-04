import {Injectable} from '@angular/core';
import {SessionService} from './session.service';
import {UserService} from './user.service';
import {Author, CommentOrReviewNote, Exam, ReviewType} from '../models/exam';
import {
  ChangeHistoryPermissions,
  CommentPermissions,
  ContentPermissions,
  RolePermissions
} from '../models/action-permissions';
import {User} from '../models/user';
import {Role, RoleHierarchy} from '../models/role';
import {ChangeHistory} from '../models/change-history';
import {of} from 'rxjs';

@Injectable()
export class PermissionService {

  constructor(private sessionService: SessionService, private userService: UserService) {
  }

  getBestChangeHistoryPermissions(exam: Exam): ChangeHistoryPermissions {
    return {
      view: this.reducePermissions('changeHistory', 'view', exam),
      viewBlind: this.reducePermissions('changeHistory', 'viewBlind', exam),
      selectVersion: this.reducePermissions('changeHistory', 'selectVersion', exam)
    };
  }

  getBestCommentPermissions(exam: Exam): CommentPermissions {
    return {
      add: this.reducePermissions('comments', 'add', exam),
      view: this.reducePermissions('comments', 'view', exam),
      viewBlind: this.reducePermissions('comments', 'viewBlind', exam),
      edit: this.reducePermissions('comments', 'edit', exam)
    };
  }

  getBestReviewNotesPermissions(exam: Exam): CommentPermissions {
    return {
      add: this.reducePermissions('reviewNotes', 'add', exam),
      view: this.reducePermissions('reviewNotes', 'view', exam),
      viewBlind: this.reducePermissions('reviewNotes', 'viewBlind', exam),
      edit: this.reducePermissions('reviewNotes', 'edit', exam)
    };
  }

  getBestActivityNotesPermissions(exam: Exam): CommentPermissions {
    return {
      add: this.reducePermissions('activityNotes', 'add', exam),
      view: this.reducePermissions('activityNotes', 'view', exam),
      viewBlind: this.reducePermissions('activityNotes', 'viewBlind', exam),
      edit: this.reducePermissions('activityNotes', 'edit', exam)
    };
  }

  markCommentsForUserPermissions(comments: CommentOrReviewNote[], permissions: CommentPermissions, exam: Exam): Promise<CommentOrReviewNote[]> {
    return new Promise<CommentOrReviewNote[]>(resolve => {

      const reviewType = exam.reviewType;
      const userIds = comments.map(i => i.userId).filter((v, i, a) => v && a.indexOf(v) === i);
      const userObservable = userIds.length > 0 ? this.userService.findByIdArray(userIds) : of([]);

      userObservable.subscribe((users: User[]) => {
        const userMap = users.reduce((map, user) => {
          map[user.id] = user;
          return map;
        }, {});
        comments.forEach(item => {
          const user = userMap[item.userId];
          item.user = user;
          if (!user || this.isBlindReviewer(reviewType, user, exam)) {
            item.hidden = !(permissions.viewBlind === ContentPermissions.all
              || (this.sessionService.loggedInUser.id === item.userId && permissions.viewBlind === ContentPermissions.own));
          } else {
            item.hidden = !(permissions.view === ContentPermissions.all
              || (this.sessionService.loggedInUser.id === item.userId && permissions.view === ContentPermissions.own));
          }
        });
        resolve(comments);
      });
    });
  }

  filterChangeHistoryForUser(changes: ChangeHistory[], exam: Exam): Promise<ChangeHistory[]> {
    return new Promise<ChangeHistory[]>(resolve => {

      const reviewType = exam.reviewType;
      const permissions = this.getBestChangeHistoryPermissions(exam);
      const userIds = changes.map(i => i.userId).filter((v, i, a) => v && a.indexOf(v) === i);
      const userObservable = userIds.length > 0 ? this.userService.findByIdArray(userIds) : of([]);

      userObservable.subscribe((users: User[]) => {
        const userMap = users.reduce((map, user) => {
          map[user.id] = user;
          return map;
        }, {});
        changes = changes.filter(item => {
          const user = userMap[item.userId];
          if (!user || this.isBlindReviewer(reviewType, user, exam)) {
            return permissions.viewBlind === ContentPermissions.all
              || (this.sessionService.loggedInUser.id === item.userId && permissions.viewBlind === ContentPermissions.own);
          } else {
            return permissions.view === ContentPermissions.all
              || (this.sessionService.loggedInUser.id === item.userId && permissions.view === ContentPermissions.own);
          }
        });
        resolve(changes);
      });
    });
  }

  // TODO: why have this logic split? One method can and should do this, all we are doing here is grabbing an array from an input param
  getHighestRole(user: User, exam?: Exam): Role {
    return this.getHighestRoleForAuthors(user, exam && exam.authors);
  }

  getHighestRoleForAuthors(user: User, authors?: Author[]): Role {
    const author = authors && authors.filter(a => a.id === user.id);
    let role: Role = author && author.length > 0 ? author[0].role : null;
    if (!role) {
      role = user.roles.reduce((previous, current) => {
        return previous ? (RoleHierarchy.indexOf(current) > RoleHierarchy.indexOf(previous) ? current : previous) : current;
      }, null);
    }
    return role;
  }

  hasRole(role: Role, user?: User, exam?: Exam): boolean {
    const usr = user || this.sessionService.loggedInUser;
    if (!usr) {
        return false;
    }
    const examAuthor = exam && exam.authors && exam.authors.filter(a => a.id === usr.id);
    const examRole = examAuthor && examAuthor.length > 0 && examAuthor[0].role;


    return examRole === role || (usr.roles.indexOf(role) > -1);

  }

  get usersRoleCanBypassReadOnly(): boolean {
    return this.sessionService.loggedInUser.roles.some(r => {
      switch (r) {
        case Role.Admin:
        case Role.SuperAdmin:
        case Role.Reviewer:
          return true;
        default:
          return false;
      }
    });
  }

  private isBlindReviewer(reviewType: ReviewType, user: User, exam: Exam): boolean {
    return reviewType === ReviewType.Blind && this.hasRole(Role.Reviewer, user, exam);
  }

  private reducePermissions(typeKey: string, permKey: string, exam: Exam): ContentPermissions {
    return RoleHierarchy.filter(r => this.hasRole(r, this.sessionService.loggedInUser, exam)).reduce((newPerm, role) => {
      if (RolePermissions[role] && RolePermissions[role][typeKey]) {
        if (RolePermissions[role][typeKey][permKey] === ContentPermissions.own ) { // && newPerm !== ContentPermissions.all // TODO: <- what's this part for? Iit caused an error when migrating to ng-v8
          return ContentPermissions.own;
        } else if (RolePermissions[role][typeKey][permKey] === ContentPermissions.all) {
          return ContentPermissions.all;
        }
      }
      return newPerm;
    }, ContentPermissions.none);
  }

}
