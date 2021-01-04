import {Injectable} from '@angular/core';
import {User} from '../models/user';
import {Role} from '../models/role';
import {AbstractService} from './abstract.service';
import {HttpClient} from '@angular/common/http';

import {Observable, ReplaySubject} from 'rxjs';
import {catchError, tap} from 'rxjs/operators';
import {LoggingService} from './logging.service';

export interface ActiveSession {
  username: string;
  session: string;
  lastUpdated?: Date;
  isValid?: boolean;
}

// TODO move this to a static constant keys class
const ACTIVE_SESSION_KEY = 'active-session';

@Injectable()
export class SessionService {
  loggedInUser: User;
  sessionUser = new ReplaySubject<User>();

  private resource = 'user';

  private static loadSessionFromStorage(): ActiveSession {
    // if the user is logged in, then there is an active session in session storage...
    const json = sessionStorage.getItem(ACTIVE_SESSION_KEY);

    if (!json) {
      return null;
    } else {
      const activeSession = JSON.parse(json);

      return SessionService.saveSessionStorage(activeSession);
    }
  }

  private static saveSessionStorage(session: ActiveSession): ActiveSession {
    // TODO check the current age of this session...
    session.lastUpdated = new Date();
    session.isValid = true;

    // TODO : should check session age and ignore values if it's timed out...
    sessionStorage.setItem(ACTIVE_SESSION_KEY, JSON.stringify(session));

    return session;
  }

  constructor(private http: HttpClient) {
  }

  createSession(user: User): any {
    this.setLoggedInUser(user);
    const session = {
      username: user.email,
      session: 'SessionTokenHere'
    };
    SessionService.saveSessionStorage(session);
  }

  invalidateSession(): any {
    this.loggedInUser = null;
    sessionStorage.removeItem(ACTIVE_SESSION_KEY);
  }

  validateSession(): Observable<User> {
    const activeSession = SessionService.loadSessionFromStorage();
    if (!activeSession || activeSession.isValid === false) {
      this.invalidateSession();
    }

    const url = `${this.resource}/findByUsername/${activeSession.username}`;
    return this.http.get(`${AbstractService.hostRoute}/${url}`, {headers: AbstractService.createHeaders(activeSession.session)})
      .pipe(
        tap((data: any) => LoggingService.log('GET response for url: ', url, ' | data: ', data)),
        tap(user => this.setLoggedInUser(user)),
        catchError(AbstractService.errorHandler)
      );
  }

  // TODO: remove all permission based logic and move to permissions service
  containsAnyRole(a: Array<any>, b: Array<any>) {
    return a.some((element) => {
      return b.indexOf(element) > -1;
    });
  }

  // TODO: discover why this ind of logic isn't in the permission service
  // TODO: is this actually any different from permission.service.hasRole
  // TODO: why have this logic split? One method can and should do this, all we are doing here is grabbing an array from an input param

    userIsInPermission(permissions: Role[], excludeSuperUser: boolean = false): boolean {
    return permissions.some(permission => this.verifyLoggedInUserPermission(permission, excludeSuperUser));
  }

  verifyLoggedInUserPermission(permission: Role, excludeSuperUser: boolean = false) {
    if (this.loggedInUser && this.loggedInUser.roles) {
      if (excludeSuperUser) {
        return (this.loggedInUser.roles.indexOf(permission) > -1);
      }
      return (this.loggedInUser.roles.indexOf(Role.SuperAdmin) > -1 || this.loggedInUser.roles.indexOf(permission) > -1);
    }
    return false;
  }

  private setLoggedInUser(user) {
    this.loggedInUser = user;
    this.sessionUser.next(user);
  }

}
