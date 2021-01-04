import {Component, HostBinding, OnInit, OnDestroy, Renderer2, Inject} from '@angular/core';
import { DOCUMENT } from '@angular/common';
import {ActivatedRoute, NavigationStart, Router} from '@angular/router';
import {SessionService} from './shared/services/session.service';
import {ConnectionService} from 'ng-connection-service';
import {OfflineService} from './shared/services/offline.service';
import {UserService} from './shared/services/user.service';
import {ProviderOrgService} from './shared/services/provider-org.service';
import {Role} from './shared/models/role';
import {User} from './shared/models/user';
import {environment} from '../environments/environment';
import {HelpService} from './shared/services/help.service';
import {filter, map} from 'rxjs/operators';
import {MatDialog} from '@angular/material/dialog';
import DialogConfig from './shared/models/dialog-config';
import {ActionType} from './shared/models/action-type';
import {DialogActionsComponent} from './shared/dialog/dialog-actions/dialog-actions.component';
import {Subscription} from 'rxjs';
import {ThemingService} from './theme/theming.service';
import {OverlayContainer} from '@angular/cdk/overlay';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {
  userStorageObj;
  sessionUser: any = null;
  user: User = null;
  loaded: boolean = false;
  environment = environment;
  currentHelp: any;

  connectionStatus: string;
  rolesObj = {};
  Role = Role;
  User = User;
  themingSubscription: Subscription;

  public options = {
    clickIconToClose: true,
    clickToClose: false,
    lastOnBottom: true,
    pauseOnHover: true,
    position: ['top', 'right'],
    showProgressBar: true,
    timeOut: 4000,
  };

  constructor(public sessionService: SessionService,
              public providerOrgService: ProviderOrgService,
              private router: Router,
              private route: ActivatedRoute,
              private userService: UserService,
              private dialog: MatDialog,
              private helpService: HelpService,
              private connectionService: ConnectionService,
              private offlineService: OfflineService,
              private themingService: ThemingService,
              private overlayContainer: OverlayContainer,
              @Inject(DOCUMENT) private document: Document,
              private renderer: Renderer2,
  ) {
    this.findUser();
  }

  ngOnInit() {
    this.sessionUser = this.sessionService.sessionUser;
    this.sessionUser.subscribe(user => {
      this.user = user;
      const roles: Role[] = user.roles;
      roles.forEach(role => this.rolesObj[role] = true);
    });
    this.router.events.pipe(
      filter(event => event instanceof NavigationStart)
    ).subscribe((event: NavigationStart) => {
      this.fetchHelp(event.url);
    });

    if (!window.navigator.onLine) {
      this.connectionStatus = 'OFFLINE. Data will be stored locally and re-synced where applicable.';
    }
    this.connectionService.monitor().subscribe(isConnected => {
      if (isConnected) {
        // TODO: synchronise our store
        this.connectionStatus = 'ONLINE! Syncing data...';
        this.offlineService.reSyncData();
        setTimeout(res => this.connectionStatus = 'SYNC COMPLETE!', 2000);
        setTimeout(res => this.connectionStatus = ' ', 3000);
      } else {
        this.connectionStatus = 'OFFLINE. Data will be stored locally and re-synced where applicable.';
      }
    });

    this.themingSubscription = this.themingService.theme.subscribe((theme: string) => {
      const themeClassesToRemove = Array.from(this.themingService.themes);
      themeClassesToRemove.forEach((cl) => {
         this.renderer.removeClass(this.document.firstElementChild, cl);
      });
      if (this.themingService.accessibility) {
          this.renderer.addClass(this.document.firstElementChild, 'accessibility');
      }
      this.renderer.addClass(this.document.firstElementChild, this.themingService.color);
//      this.applyThemeOnOverlays();
    });
  }

  /**
   * Apply the current theme on components with overlay (e.g. Dropdowns, Dialogs)
   */
  private applyThemeOnOverlays() {
    // remove old theme class and add new theme class
    // we're removing any css class that contains '-theme' string but your theme classes can follow any pattern
    const overlayContainerClasses = this.overlayContainer.getContainerElement().classList;
    const themeClassesToRemove = Array.from(this.themingService.themes);
    if (themeClassesToRemove.length) {
      overlayContainerClasses.remove(...themeClassesToRemove);
    }
//    overlayContainerClasses.add(this.cssClass);
  }

  onActivate(event) {
    const scrollToTop = window.setInterval(() => {
      const pos = window.pageYOffset;
      if (pos > 0) {
        window.scrollTo(0, pos - 20); // how far to scroll on each step
      } else {
        window.clearInterval(scrollToTop);
      }
    }, 16);
  }

  get roles(): string[] {
    return Object.values(Role);
  }

  changeUserRoles() {
    this.userService.findById(this.user.id).subscribe((user) => {
      user.roles = [];

      this.roles.forEach(role => {
        if (this.rolesObj[role]) {
          user.roles.push(role as Role);
        }
      });

      this.userService.save(user).subscribe((response) => {
        window.location.reload();
      });
    });
  }

  rolesDisplay() {
    const roles = this.user.roles;
    return this.sessionService.loggedInUser ? roles.join(',') : '';
  }

  findUser() {
    const userSession = sessionStorage.getItem('userSession');
    if (userSession) {
      this.userStorageObj = JSON.parse(userSession);
      this.userService.findById(this.userStorageObj.userId).subscribe(user => {
        if (user) {
          // create the user session
          this.sessionService.createSession(user);
          this.loaded = true;
          // TODO: what is this for?
        } else {
          // the user was not found in the system, they need to be added to the db
          // send them to the simple registration page
          this.loaded = true;
          this.router.navigate(['/simple-registration']);
        }
      });
    } else {
      this.loaded = true;
    }
  }

  logout(): void {
    this.sessionService.invalidateSession();
    location.href = '/logout';
  }

  fetchHelp(path) {
    this.helpService.getHelpDocuments().pipe(
      map(documents => documents.filter(d => ('' + path).indexOf(d.page) === 0))
    ).subscribe(documents => {
      if (documents.length > 0) {
        this.currentHelp = documents[0];
      } else {
        this.currentHelp = null;
      }
    });
  }

  showHelp(): void {
    if (this.currentHelp) {
      const ref = this.dialog.open(DialogActionsComponent, DialogConfig.mediumDialogBaseConfig(
        {
          title: this.currentHelp.title,
          content: this.currentHelp.value,
          actions: [ActionType.Close]
        }
      ));
      ref.componentInstance.dialogResult
        .subscribe(result => {
          ref.close();
        });
    }
  }

  ngOnDestroy() {
    this.themingSubscription.unsubscribe();
  }
}
