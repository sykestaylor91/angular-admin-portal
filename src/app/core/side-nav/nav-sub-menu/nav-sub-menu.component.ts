import {Component, EventEmitter, Input, Output} from '@angular/core';

@Component({
  selector: 'app-nav-sub-menu',
  templateUrl: 'nav-sub-menu.component.html'
})
export class NavSubMenuComponent {
  @Input() route: any;
  @Input() sidenav: any;
  @Output() toggleRoute: EventEmitter<any> = new EventEmitter();

  isShown: boolean;

  constructor() {
  }
}
