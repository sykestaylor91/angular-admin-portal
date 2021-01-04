import * as CryptoJS from 'crypto-js';

import * as util from 'util';
import { MenuItems, MenuModel } from '../core/side-nav/menu-items';
import { AbstractControl } from '@angular/forms';
import { AnswerOption } from './models/answer-option';

export default class Utilities {
  private static cryptoPhraseArray = ['w', 't', 'f', 'n', 'k', 's'];

  static cryptoKey = [
    Utilities.cryptoPhraseArray[5],
    Utilities.cryptoPhraseArray[1],
    Utilities.cryptoPhraseArray[3],
    Utilities.cryptoPhraseArray[2],
    Utilities.cryptoPhraseArray[0],
    Utilities.cryptoPhraseArray[4]
  ].join('');

  static deepClone(obj = {}) {
    return JSON.parse(JSON.stringify(obj));
  }

  static isEmpty(obj) {
    let empty = true;
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        empty = false;
        break;
      }
    }
    return empty;
  }

  static getMinDate(...dates) {
    if (!dates[0] || !util.types.isDate(dates[0])) {
      dates[0] = new Date();
    }
    let min_dt = dates[0];
    let min_dtObj = new Date(dates[0]);

    dates.forEach(dt => {
      if (new Date(dt) < min_dtObj) {
        min_dt = dt;
        min_dtObj = new Date(dt);
      }
    });
    return min_dt;
  }

  static dateSorter(propertyName: string, direction: 'asc' | 'desc' = 'asc') {
    return (a: any, b: any) => {
      return (direction === 'desc' ? -1 : 1) * (new Date(a[propertyName]).getTime() - new Date(b[propertyName]).getTime());
    };
  }

  static stringSorter(propertyName: string, direction: 'asc' | 'desc' = 'asc') {
    return (a: any, b: any) => {
      return (direction === 'desc' ? -1 : 1) * ((b[propertyName] > a[propertyName]) ? -1 : 1);
    };
  }

  static getFlatMenu(): MenuModel[] {
    const flatItems = [];
    MenuItems.forEach(menuItem => {
      flatItems.push(menuItem);
      menuItem.subMenu.forEach(item => {
        flatItems.push(item);
      });
    });
    return flatItems;
  }

  static getTextFromHtml(html) {
    const temp = document.createElement('div');
    temp.innerHTML = html;
    return temp.textContent || temp.innerText || '';
  }

  // static stripHtml(html) {
  //   const doc = new DOMParser().parseFromString(html, 'text/html');
  //   return doc.body.textContent || '';
  // }

  static getBooleanValue(value) {
    if (typeof value === 'boolean') {
      return value;
    }
    return value === 'true';
  }

  static isNullOrUndefined(value) {
    return value === null || value === undefined;
  }

  static numberOfCreditsValidator(control: AbstractControl): { [key: string]: boolean } | null {
    if (control && (control.value !== null && control.value !== undefined)) {
      const val = parseFloat(control.value);

      if (isNaN(val)) {
        return { 'NaN': true };
      } else if (val % .25 !== 0) {
        return { 'invalidStep': true };
      }
    }

    return null;
  }

  static parseAnswerOption(answer): AnswerOption {
    let dc = CryptoJS.AES.decrypt(answer, Utilities.cryptoKey);
    dc = dc.toString(CryptoJS.enc.Utf8);
    if (dc) {
      dc = JSON.parse(dc.toString());
    } else {
      dc = answer;
    }
    return dc as AnswerOption;
  }

  // https://stackoverflow.com/questions/54297376/getting-the-enum-key-with-the-value-string-reverse-mapping-in-typescript
  static getEnumKeyByEnumValue(myEnum, enumValue) {
    const keys = Object.keys(myEnum).filter(x => myEnum[x] === enumValue);
    return keys.length > 0 ? keys[0] : null;
  }

  /**
 * Shuffles array in place. ES6 version
 * @param {Array} a items An array containing the items.
 */
  static shuffleArray(a) {
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }
}
