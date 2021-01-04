import { MatDialogConfig } from '@angular/material/dialog';
import {Author, CommentOrReviewNote, Exam} from './exam';
import {ActionType} from './action-type';
import {MediaType} from './media-type';
import {CommentPermissions} from './action-permissions';
import {ChangeHistory} from './change-history';
import { Role } from './role';

export interface DialogBase {
  height?: string;
  width?: string;
  title?: string;
  content?: any;
  actions?: ActionType[];
  showLoading?: boolean;
  resourceElement?: string;
  showCitations?: boolean;
  showClose?: boolean;
  showVideo?: boolean;
  showImage?: boolean;
  disabled?: boolean;
  displayContent?: boolean;
  trustHtml?: boolean;
  htmlSrc?: string;
  pdfSrc?: string;
}

export interface CommentOrReviewNoteDialog extends DialogBase {
  comments: CommentOrReviewNote[];
  resource: any;
  permissions: CommentPermissions;
}

export interface ActivityChangeHistoryDialog extends DialogBase {
    resource: any;
  unsavedChange: ChangeHistory;
}

export interface ContributorDialog {
  authors: Author[];
}

export interface InviteContributorDialog {
  contributorsRole: Role[];
}

export interface TextEditorDialog {
  type: MediaType;
  citations?: string[];
}

export default class DialogConfig {
  static defaultDialogConfig(fields?: Partial<any>): MatDialogConfig<any> {
    const height = (fields.data.height === null || fields.data.height === undefined) ? '80%' : fields.data.height;
    const width = (fields.data.width === null || fields.data.width === undefined) ? '80%' : fields.data.width;

    delete fields.data.width;
    delete fields.data.height;

    return Object.assign({
      height,
      width,
      disableClose: fields.disableClose || false,
      panelClass: 'pos-relative',
      autoFocus: false
    }, fields);
  }

  static largeDialogBaseConfig(fields?: Partial<DialogBase>): MatDialogConfig<DialogBase> {
    return DialogConfig.defaultDialogConfig({data: fields});
  }

  static mediumDialogBaseConfig(fields?: Partial<DialogBase>): MatDialogConfig<DialogBase> {
    fields.height = '60%';
    fields.width = '60%';
    return DialogConfig.defaultDialogConfig({data: fields});
  }

  static smallDialogBaseConfig(fields?: Partial<DialogBase>): MatDialogConfig<DialogBase> {
    fields.height = '30%';
    fields.width = '30%';
    return DialogConfig.defaultDialogConfig({data: fields});
  }

  static defaultCommentDialogConfig(fields: CommentOrReviewNoteDialog): MatDialogConfig<CommentOrReviewNoteDialog> {
    return DialogConfig.defaultDialogConfig({data: fields});
  }

  static defaultChangeHistoryDialogConfig(fields: ActivityChangeHistoryDialog): MatDialogConfig<ActivityChangeHistoryDialog> {
    return DialogConfig.defaultDialogConfig({data: fields});
  }

  static textEditorDialogConfig(fields: TextEditorDialog): MatDialogConfig<TextEditorDialog> {
    return DialogConfig.defaultDialogConfig({data: fields});
  }

  static defaultContributorDialogConfig(fields?: Partial<ContributorDialog>): MatDialogConfig<ContributorDialog> {
    return DialogConfig.defaultDialogConfig({data: {authors: fields.authors}});
  }

  static defaultSecurityLockDialogConfig(fields?: Partial<DialogBase>): MatDialogConfig<DialogBase> {
    fields.height = '60%';
    fields.width = '60%';

    return DialogConfig.defaultDialogConfig({disableClose: true, data: fields});
  }
}

// export class DialogUtility {
//
//   // constructor(private dialog: MatDialog) {
//   // }
//
//   static openCommentDialog(dialog: MatDialog, dialogData: CommentOrReviewNoteDialog) {
//     const ref = dialog.open(DialogCommentComponent, DialogConfig.defaultCommentDialogConfig(dialogData));
//     ref.afterClosed().subscribe((saveNotes: boolean) => {
//       if (saveNotes) {
//         this.selectedExam.reviewerNotes = dialogData.comments;
//         this.editFormGroup.get('reviewerNotes').patchValue(dialogData.comments);
//         ref.close();
//       }
//     });
//   }
//
// }
