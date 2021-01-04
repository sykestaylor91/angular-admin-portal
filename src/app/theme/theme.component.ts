import {Component, OnInit} from '@angular/core';
import { ThemingService } from './theming.service';

@Component({
  selector: 'app-theme',
  templateUrl: 'theme.component.html'
})
export class ThemeComponent implements OnInit {
  title: string = 'Themes';
  _subscription;
  themes: string[];
  theme: string;

  constructor(
    private theming: ThemingService
  ) { }

  ngOnInit() {
    this.themes = this.theming.themes;
    this._subscription = this.theming.theme.subscribe((theme: string) => {
        this.theme = theme;
    });
  }

  changeTheme(theme: string) {
    this.theming.theme.next(theme);
  }
}


