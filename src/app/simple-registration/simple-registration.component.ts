import {Component, OnInit} from '@angular/core';
// import {InvitationService} from '../../shared/services/invitation.service';
import {UserService} from '../shared/services/user.service';
import {SessionService} from '../shared/services/session.service';
import {Role} from '../shared/models/role';
import {User} from '../shared/models/user';
import {Router} from '@angular/router';
import {ActivatedRoute, ActivatedRouteSnapshot, Resolve, RouterStateSnapshot} from '@angular/router';

import {NotificationsService} from 'angular2-notifications';

import {
  FormGroup,
  FormControl,
  Validators,
} from '@angular/forms';
import {FormsManagementDirective} from '../shared/helpers/forms.management.directive';
import {CustomValidator} from '../shared/custom-validators';
import {PermissionService} from '../shared/services/permission.service';
import {RoutesRp} from '../shared/models/routes-rp';


@Component({
  selector: 'app-simple-registration',
  templateUrl: 'simple-registration.component.html',
})
export class SimpleRegistrationComponent extends FormsManagementDirective implements OnInit {

  errorMsg: string;

  constructor(private permissionService: PermissionService,
              private userService: UserService,
              private notificationsService: NotificationsService,
              private router: Router,
              private activatedRoute: ActivatedRoute) {

    super(permissionService);
  }

  showSpinner = false;

  ngOnInit() {

    this.createForm();
  }

  createForm(): void {
    this.form = new FormGroup({
      organization: new FormControl('', []),
      activity: new FormControl('', []),
      firstName: new FormControl('', Validators.required),
      familyName: new FormControl('', Validators.required),
      email: new FormControl('', [Validators.required, CustomValidator.emailFormat]),
      phone: new FormControl('', [Validators.required, CustomValidator.noWhitespace]),
      password: new FormControl('', [Validators.required, CustomValidator.passwordPolicy]),
      confirmPassword: new FormControl('', [Validators.required, CustomValidator.noWhitespace]),
    }, (formGroup: FormGroup) => {
      return CustomValidator.matchPassword(formGroup);
    });
  }

  getMessageFromResponse(s) {
    let res = '';

    try {
      res = JSON.parse( s.substring( s.indexOf('-') + 1 ).trim() ).message;
    } catch (ex) {
      res = 'Something went wrong';
    }

    return res;
  }

  submitHandler(): void {
    this.showSpinner = true;

    const newUser = new User();
    newUser.organization = this.form.value.organization;
    newUser.activity = this.form.value.activity;
    newUser.firstName = this.form.value.firstName;
    newUser.lastName = this.form.value.familyName;
    newUser.email = this.form.value.email;
    newUser.phone = this.form.value.phone;
    newUser.password = this.form.value.password;

    newUser.username = newUser.email;

    newUser.roles = [ Role.Reader ];

    // newUser.invitationId = this.invitation.id;

    this.userService.save( newUser ).subscribe(data => {

      this.notificationsService.success('Success', 'Thank you for registering.  You will be redirected to login in a few seconds', {timeOut: 0, clickIconToClose: true, clickToClose: true});
      this.router.navigate([[RoutesRp.Home]]);
      this.showSpinner = false;
      setTimeout(function() { location.reload(); }, 5000 );
    },
    error => {
      console.log('Something went wrong');

      this.notificationsService.error('Error', this.getMessageFromResponse(error));

      this.showSpinner = false;

      this.errorMsg = this.getMessageFromResponse(error);
    });
  }

}
