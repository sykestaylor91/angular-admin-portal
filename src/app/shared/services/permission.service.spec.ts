import {PermissionService} from './permission.service';
import {UserService} from './user.service';
import {anyString, instance, mock, when} from 'ts-mockito';
import {of} from 'rxjs/index';
import {User} from '../models/user';
import {Role} from '../models/role';
import {SessionService} from './session.service';

describe('PermissionService', () => {

  it('should choose SuperAdmin role from user record (no exam)', () => {
    const permissionService = getPermissionService();
    const user = <User>{id: '123', roles: [Role.Editor, Role.Admin, Role.SuperAdmin, Role.Reviewer]};
    const role = permissionService.getHighestRole(user);
    expect(role).toBe(Role.SuperAdmin);
  });

  it('should choose Reviewer role from exam record', () => {
    const permissionService = getPermissionService();
    const user = <User>{id: '123', roles: [Role.SuperAdmin]};
    const role = permissionService.getHighestRole(user, {authors: [{id: '123', role: Role.Reviewer}]});
    expect(role).toBe(Role.Reviewer);
  });

  it('should choose Admin role from user record (user is not in exam record)', () => {
    const permissionService = getPermissionService();
    const user = <User>{id: '345', roles: [Role.Admin]};
    const role = permissionService.getHighestRole(user, {authors: [{id: '123', role: Role.Reviewer}]});
    expect(role).toBe(Role.Admin);
  });

  it('should choose Provider role from user (exam has no authors value)', () => {
    const permissionService = getPermissionService();
    const user = <User>{id: '123', roles: [Role.Provider]};
    const role = permissionService.getHighestRole(user, {});
    expect(role).toBe(Role.Provider);
  });

  it('should deny SuperAdmin role (no exam)', () => {
    const permissionService = getPermissionService();
    const user = <User>{id: '123', roles: [Role.Editor, Role.Admin, Role.Reviewer]};
    const hasRole = permissionService.hasRole(Role.SuperAdmin, user);
    expect(hasRole).toBeFalsy();
  });

  it('should allow SuperAdmin role (no exam)', () => {
    const permissionService = getPermissionService();
    const user = <User>{id: '123', roles: [Role.SuperAdmin]};
    const hasRole = permissionService.hasRole(Role.SuperAdmin, user);
    expect(hasRole).toBeTruthy();
  });

//  it('should not allow Provider role (with exam)', () => {
//    const permissionService = getPermissionService();
//    const user = <User>{id: '123', roles: [Role.Provider]};
//    const hasRole = permissionService.hasRole(Role.Provider, user, {authors: [{id: '123', role: Role.Reviewer}]});
//    expect(hasRole).toBeFalsy();
//  });

  it('should allow Reviewer role (from exam)', () => {
    const permissionService = getPermissionService();
    const user = <User>{id: '123', roles: [Role.Admin]};
    const hasRole = permissionService.hasRole(Role.Reviewer, user, {authors: [{id: '123', role: Role.Reviewer}]});
    expect(hasRole).toBeTruthy();
  });

//  it('should deny Reviewer role (from exam)', () => {
//    const permissionService = getPermissionService();
//    const user = <User>{id: '123', roles: [Role.Reviewer]};
//    const hasRole = permissionService.hasRole(Role.Reviewer, user, {authors: [{id: '123', role: Role.Admin}]});
//    expect(hasRole).toBeFalsy();
//  });

//  it('should deny Reviewer role (with exam, no authors)', () => {
//    const permissionService = getPermissionService();
//    const user = <User>{id: '123', roles: [Role.Reviewer]};
//    const hasRole = permissionService.hasRole(Role.Reviewer, user, {});
//    expect(hasRole).toBeFalsy();
//  });

  it('should allow Provider role (with exam, no authors)', () => {
    const permissionService = getPermissionService();
    const user = <User>{id: '123', roles: [Role.Provider]};
    const hasRole = permissionService.hasRole(Role.Provider, user, {});
    expect(hasRole).toBeTruthy();
  });

  function getPermissionService(user?: User): PermissionService {
    const mockUserService = mock(UserService);
    if (user) {
      when(mockUserService.findById(anyString())).thenCall((args) => of(user));
    }
    return new PermissionService(instance(mock(SessionService)), instance(mockUserService));
  }

});
