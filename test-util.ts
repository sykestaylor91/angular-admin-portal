import {By} from '@angular/platform-browser';
import {ComponentFixture} from '@angular/core/testing';

export function assertVisible<T>(fixture: ComponentFixture<T>, visible: String[], cssSelectors: { [s: string]: string; }) {
  fixture.detectChanges();
  Object.keys(cssSelectors).forEach(e => {
    if (visible.indexOf(e) > -1) {
      expect(fixture.debugElement.query(By.css(cssSelectors[e]))).toBeTruthy(e + ' should be visible');
    } else {
      const element = fixture.debugElement.query(By.css(cssSelectors[e]));
      if (element == null) {
        return;
      } else {
        const hiddenElement = fixture.debugElement.query(By.css('[ng-reflect-is-hidden="true"] ' + cssSelectors[e])) ||
          fixture.debugElement.query(By.css(cssSelectors[e] + '[ng-reflect-is-hidden="true"]'));
        expect(hiddenElement).toBeTruthy(e + ' should not exist');
      }
    }
  });
}

export function assertRequired<T>(fixture: ComponentFixture<T>, required: String[], cssSelectors: { [s: string]: string; }) {
  fixture.detectChanges();
  Object.keys(cssSelectors).forEach(e => {
    if (required.indexOf(e) > -1) {
      expect(fixture.debugElement.query(By.css('.required ' + cssSelectors[e]))).toBeTruthy(e + ' should be required');
    } else {
      expect(fixture.debugElement.query(By.css('.required ' + cssSelectors[e]))).toBeNull(e + ' should not be required');
    }
  });
}
