import { ApplicationRef, Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable()
export class ThemingService {
  themes = ['dark-theme', 'light-theme', 'lowcontrast-theme', 'accessibility'];
  theme = new BehaviorSubject('light-theme');
  accessibility: any;
  color: any;

  constructor(private ref: ApplicationRef) {
    if (localStorage.getItem('nowce_theme') === 'undefined') {
        localStorage.setItem('nowce_theme', 'light-theme');
    }
    const theme_in_string = localStorage.getItem('nowce_theme') || 'light-theme';
    this.accessibility = theme_in_string.indexOf('accessibility') !== -1 || false;
    this.color = theme_in_string.replace('accessibility-', '');
    this.theme.next(theme_in_string);
  }

  setTheme(accessibility, color) {
    this.accessibility = accessibility;
    this.color = color;

    let theme = '';
    if (this.accessibility) {
        theme = 'accessibility-';
    }
    theme += this.color;
    this.theme.next(theme);
    localStorage.setItem('nowce_theme', theme);

  }
}
