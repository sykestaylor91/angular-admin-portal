import {User} from '../../models/user';
import {Role} from '../../models/role';
import {Observable, of, ReplaySubject} from 'rxjs';

export class SessionServiceStub {
  resource = 'user';
  loggedInUser: User;
  sessionUser = new ReplaySubject();

  constructor() {
  }

  createSession(user: User): any {
    this.sessionUser.next(user);
    this.loggedInUser = user;
  }

  invalidateSession(): any {
    this.loggedInUser = null;
  }

  validateSession(): Observable<User> {
    return of(this.loggedInUser);
  }

  containsAnyRole(a: Array<any>, b: Array<any>) {
    return true;
  }

  userIsInPermission(permissions: Role[], excludeSuperUser: boolean = false): boolean {
    return true;
  }

  verifyLoggedInUserPermission(permission: Role, excludeSuperUser: boolean = false) {
    return true;
  }
}
