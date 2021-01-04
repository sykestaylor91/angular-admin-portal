import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
  name: 'role'
})
export class RolePipe implements PipeTransform {
  static getDisplayValue(role: string): string {
    let output = '';
    switch (role) {
      case 'admin':
        output = 'Admin';
        break;
      case 'reader':
        output = 'Reader';
        break;
      case 'provider':
        output = 'Provider';
        break;
      case 'publisher':
        output = 'Publisher';
        break;
      case 'editor':
        output = 'Editor';
        break;
      case 'author':
        output = 'Author';
        break;
      case 'reviewer':
        output = 'Reviewer';
        break;
      case 'media_admin':
        output = 'Media Admin';
        break;
      case 'helper':
        output = 'Helper';
        break;
      case 'media_helper':
        output = 'Media Helper';
        break;
      case 'editor_helper':
        output = 'Editor Helper';
        break;
      case 'planner':
        output = 'Planner';
        break;
      case 'super_admin':
        output = 'Super Admin';
        break;
    }
    return output;
  }

  transform(value: string): any {
    return RolePipe.getDisplayValue(value);
  }
}
