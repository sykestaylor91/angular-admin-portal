import {Component, OnInit, Input} from '@angular/core';
import {Router, ActivatedRoute} from '@angular/router';
import {FormBuilder, FormControl, FormArray, Validators, FormGroup} from '@angular/forms';
import {User} from '../../shared/models/user';
import {UserService} from '../../shared/services/user.service';
import {PermissionService} from '../../shared/services/permission.service';
import {SessionService} from '../../shared/services/session.service';
import {NotificationsService} from 'angular2-notifications';

@Component({
  selector: 'app-reader-account',
  templateUrl: './reader-account.component.html'
})
export class ReaderAccountComponent implements OnInit {
  public pagetitle: string = 'User details';
  subComponent: boolean = false;
  user: User;
  form: FormGroup;
  @Input() data: any;
  // form
  id: any;
  firstName: FormControl;
  lastName: FormControl;
  email: FormControl;
  title: FormControl;
  status: FormControl;
  organization: FormControl;
  address1: FormControl;
  city: FormControl;
  postalCode: FormControl;
  address2: FormControl;
  state: FormControl;
  country: FormControl;
  phone: FormControl;


  constructor(private permissionSerUService: PermissionService,
              private sessionService: SessionService,
              private notificationsService: NotificationsService,
              private userService: UserService,
              private formBuilder: FormBuilder,
              private route: ActivatedRoute) {
  }

  ngOnInit() {
    if (this.data && this.data.subComponent) {
      // use as subcomponent, pass in data
      this.subComponent = true; // maybe not necessary
      this.createForm(this.data);
    } else if (this.route.snapshot.queryParamMap.get('id')) {
      // navigate here and populate using url params
          this.userService.findById(this.route.snapshot.queryParamMap.get('id')).subscribe(result => {
            if (result) {
              this.user = result;
              this.createForm(this.user);
            } else {
              this.notificationsService.alert('Not Found', 'The user you requested cannot be found.');
            }
          });
    } else {
      // use logged in user details
      this.userService.findById(this.sessionService.loggedInUser.id).subscribe(result => {
        if (result) {

          this.user = result;
          this.createForm(this.user);
        } else {
          this.notificationsService.alert('Not Found', 'The user you requested cannot be found.');
        }
      });
    }
  }

  createForm(user: User) {

    this.firstName = new FormControl(user.firstName, [Validators.required]);
    this.lastName = new FormControl(user.lastName, [Validators.required]);
    this.email = new FormControl(user.email, [Validators.email, Validators.required]);
    this.title = new FormControl(user.title, []);
    this.address1 = new FormControl(user.address1, []);
    this.city = new FormControl(user.city, []);
    this.postalCode = new FormControl(user.postalCode, []);
    this.address2 = new FormControl(user.address2, []);
    this.state = new FormControl(user.state, []);
    this.country = new FormControl(user.country, []);
    this.organization = new FormControl(user.organization, []);
    this.phone = new FormControl(user.phone, []);

    this.form = this.formBuilder.group({
      firstName: this.firstName,
      lastName: this.lastName,
      // email: this.email,
      title: this.title,
      organization: this.organization,
      address1: this.address1,
      city: this.city,
      postalCode: this.postalCode,
      address2: this.address2,
      state: this.state,
      country: this.country,
      phone: this.phone
    });

  }

  saveChanges() {
    if (this.form.valid) {
      const updatedUser = new User( {
        id: this.user.id,
        username: this.user.username,
        roles: this.user.roles,
        firstName: this.firstName.value,
        lastName: this.lastName.value,
        email: this.user.email,
        title: this.title.value,
        status: this.user.status,
        organization: this.organization.value,
        address1: this.address1.value,
        city: this.city.value,
        postalCode: this.postalCode.value,
        address2: this.address2.value,
        state: this.state.value,
        country: this.country.value,
        phone: this.phone.value
      });
      // roles empty???
      updatedUser.roles = this.user.roles;
      updatedUser.email = this.user.email;
      this.userService.update(updatedUser).subscribe(data => {
        this.notificationsService.success('Success', 'Details saved successfully');

        this.sessionService.loggedInUser = data;
      }, err => {
        this.notificationsService.error(err);
        console.error(err);
      });
    } else {
      this.errorMessage();
    }
  }

  errorMessage() {
    this.notificationsService.error('Form invalid');
  }
}
