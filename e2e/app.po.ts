import {browser, by, element} from 'protractor';

export class AppPage {
  navigateTo(destination: string) {
    return browser.get(destination);
  }

  getElementsByCss(selector)  {
    return element.all(by.css(selector));
  }
}
