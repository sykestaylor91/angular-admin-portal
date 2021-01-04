import {EventEmitter, Injectable} from '@angular/core';
import {DialogActionsComponent} from '../dialog/dialog-actions/dialog-actions.component';
import {AbstractControl} from '@angular/forms';
import {ActionType} from '../models/action-type';
import DialogConfig from '../models/dialog-config';
import { MatDialog } from '@angular/material/dialog';

@Injectable()
export class DialogService {
  constructor(private dialog: MatDialog) {
  }

  showConfirmModel(propertyHolder: any, propertyName: string, defaultValue: any, resetOnCancel: boolean = true): EventEmitter<ActionType> {
    const resetValue = () => {
      if (propertyHolder.hasOwnProperty(propertyName)) {
        propertyHolder[propertyName] = defaultValue;
      } else {
        (propertyHolder as AbstractControl).get(propertyName).patchValue(defaultValue);
      }
    };

    const ref = this.dialog.open(DialogActionsComponent, DialogConfig.smallDialogBaseConfig(
      {
        title: 'Confirm',
        content: 'Please confirm your answer is "No"',
        actions: [ActionType.Confirmation, ActionType.Cancel]
      }
    ));
    ref.afterClosed().subscribe((value: any) => {
      if (value !== ActionType.Skip && resetOnCancel) {
        resetValue();
      }
    });
    ref.componentInstance.dialogResult
      .subscribe(result => {
        if (result === ActionType.Cancel) {
          resetValue();
        }
        ref.close(ActionType.Skip);
      });
    return ref.componentInstance.dialogResult;
  }
}
