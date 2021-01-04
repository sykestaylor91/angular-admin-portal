import {Component, OnInit} from '@angular/core';
import {InvitationService} from '../../shared/services/invitation.service';
import {UserService} from '../../shared/services/user.service';
import {Role} from '../../shared/models/role';
import {User} from '../../shared/models/user';
import {Router} from '@angular/router';
import {ActivatedRoute} from '@angular/router';

import {
  FormGroup,
  FormBuilder,
  FormControl,
  Validators,
} from '@angular/forms';
import {Invitation} from '../../shared/models/invitation';
import {NotificationsService} from 'angular2-notifications';
import {PermissionService} from '../../shared/services/permission.service';
import {FormsManagementDirective} from '../../shared/helpers/forms.management.directive';
import {CustomValidator} from '../../shared/custom-validators';

@Component({
  selector: 'app-registration',
  templateUrl: 'registration.component.html'
})
export class RegistrationComponent extends FormsManagementDirective implements OnInit {

  errorMsg: string;
  isInvitationExpired: boolean = false;

  role: string;
  providerName: string;
  providerPrimaryContact: string;
  invitation: Invitation;

  accessRights: Role[];

  // form
  form: FormGroup;
  private title: FormControl;
  private firstName: FormControl;
  private email: FormControl;
  private password: FormControl;
  private confirmPassword: FormControl;
  private otherTitle: FormControl;
  private familyName: FormControl;
  private address1: FormControl;
  private city: FormControl;
  private postalCode: FormControl;
  private address2: FormControl;
  private state: FormControl;
  private country: FormControl;
  private organisation: FormControl;

  constructor(
    private permissionService: PermissionService,
    private invitationService: InvitationService,
    private userService: UserService,
    private notificationsService: NotificationsService,
    private router: Router,
    private activatedRoute: ActivatedRoute) {

    super(permissionService);
  }

  ngOnInit() {
    this.createForm();

    this.activatedRoute.params.subscribe(params => {

        this.providerPrimaryContact = 'NowCE Administrator';
        // this.accessRights = '(As entered by the provider when designating access rights to invitees)';

        this.invitationService.findById( params.id ).subscribe(data => {
          this.invitation = data;
          if (this.invitation) {

            // TODO check if invitation already 'responded'
            this.firstName.setValue(this.invitation.firstName);
            this.familyName.setValue(this.invitation.lastName);
            this.email.setValue(this.invitation.email);

            for (const item in Role) {
              if ( Role[item] === this.invitation.permissionLevel ) {
                this.accessRights = [ Role[item] as Role ];
              }
            }

            if (!this.accessRights) {

              this.notificationsService.error('Error', 'No invitation was found. Please check and try again or contact your administrator.');
              // this.router.navigate(['']);
            }
          }
        });
    });
  }

  invitationExpired() {
    return this.invitation && this.invitation.status !== 'active';
  }

  createForm() {
    this.title = new FormControl('', [Validators.required]);
    this.firstName = new FormControl('', [Validators.required]);
    this.email = new FormControl('', [Validators.required]);
    this.password = new FormControl('', [Validators.required, CustomValidator.passwordPolicy]);
    this.confirmPassword = new FormControl('', [Validators.required]);
    this.otherTitle = new FormControl('', []);
    this.familyName = new FormControl('', [Validators.required]);
    this.address1 = new FormControl('', [Validators.required]);
    this.city = new FormControl('', [Validators.required]);
    this.postalCode = new FormControl('', [Validators.required]);
    this.address2 = new FormControl('', []);
    this.state = new FormControl('', []);
    this.country = new FormControl('', [Validators.required]);
    this.organisation = new FormControl('', [Validators.required]);

    this.form = new FormBuilder().group({
      title: this.title,
      firstName: this.firstName,
      email: this.email,
      password: this.password,
      confirmPassword: this.confirmPassword,
      otherTitle: this.otherTitle,
      familyName: this.familyName,
      address1: this.address1,
      city: this.city,
      postalCode: this.postalCode,
      address2: this.address2,
      state: this.state,
      country: this.country,
      organisation: this.organisation
    },
    { validator: CustomValidator.matchPassword });
  }

  getMessageFromResponse(s) {
    let res = '';

    try {
      res = JSON.parse( s.substring( s.indexOf('-') + 1 ).trim() ).message;
    } catch ( ex ) {
      res = 'Something went wrong';
    }

    return res;
  }

  onSave() {

    const newUser = new User();
    newUser.firstName = this.form.value.firstName;
    newUser.lastName = this.form.value.familyName;
    newUser.email = this.form.value.email;
    newUser.password = this.form.value.password;
    newUser.roles = this.accessRights;
    newUser.postalCode = this.form.value.postalCode;
    newUser.city = this.form.value.city;
    newUser.organization = this.form.value.organisation;
    newUser.address1 = this.form.value.address1;
    newUser.address2 = this.form.value.address2;
    newUser.state = this.form.value.state;
    newUser.country = this.form.value.country;

    newUser.username = newUser.email;

    newUser.invitationId = this.invitation.id;

    this.userService.save( newUser ).subscribe(data => {

      // Save that the invitation has been responded to
      // save user information to the user (will be the currently logged in user)
      this.invitation.status = 'responded';
      this.invitationService.save(this.invitation).subscribe();

      this.notificationsService.success('Success', 'Thank you for registering.  You will be redirected to login in a few seconds', {timeOut: 0, clickIconToClose: true, clickToClose: true});
      const that = this;
      setTimeout(function() { that.router.navigate(['/logout']); }, 5000);
      },
    error => {
      console.log('Something went wrong');

      this.notificationsService.error('Error', this.getMessageFromResponse(error));

      this.showSpinner = false;

      this.errorMsg = this.getMessageFromResponse(error);
    });
  }

}
