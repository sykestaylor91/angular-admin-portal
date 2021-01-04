import {Component, Input} from '@angular/core';

@Component({
  selector: 'app-nav-menu-link',
  templateUrl: 'nav-menu-link.component.html'
})
export class NavMenuLinkComponent {
  @Input() route: any;
  @Input() sidenav: any;

  constructor() {}
}
