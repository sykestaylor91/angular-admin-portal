import {Component, EventEmitter, Inject, Input, OnInit, Output, ViewChild} from '@angular/core';
import {CommentOrReviewNote, ReviewType} from '../../models/exam';
import {SessionService} from '../../services/session.service';
import Utilities from '../../utilities';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import {CommentOrReviewNoteDialog} from '../../models/dialog-config';
import {TextEditorComponent} from '../../text-editor/text-editor.component';
import {User} from '../../models/user';
import {ContentPermissions} from '../../models/action-permissions';
import {PermissionService} from '../../services/permission.service';
import {Role} from '../../models/role';
import {startCase} from 'lodash';
import {ActionType} from '../../models/action-type';

@Component({
  selector: 'app-dialog-comment',
  templateUrl: './dialog-comment.component.html',
  styleUrls: ['./dialog-comment.component.scss']
})
export class DialogCommentComponent implements OnInit {
  @Input() showLoading: boolean = false;
  @Output() dialogResult = new EventEmitter<ActionType>();
  localItems: CommentOrReviewNote[] = [];
  newItemMode: boolean = false;
  forceSave: boolean = false;
  addHidden: boolean = false;

  @ViewChild(TextEditorComponent) editorComponent: TextEditorComponent;

  constructor(private sessionService: SessionService,
              private permissionService: PermissionService,
              private dialogRef: MatDialogRef<DialogCommentComponent>,
              @Inject(MAT_DIALOG_DATA) public data: CommentOrReviewNoteDialog) {
  }

  ngOnInit() {
    const permissions = this.data.permissions;
    this.addHidden = permissions.add !== ContentPermissions.none;

    const items: CommentOrReviewNote[] = this.data.comments ? Utilities.deepClone(this.data.comments) : [];
    this.permissionService.markCommentsForUserPermissions(items, permissions, this.data.resource).then(comments => this.localItems = comments);
  }

  get hasData(): boolean {
    return this.localItems.length > 0;
  }

  canDelete(userId: string): boolean {
    if (userId) {
      return this.sessionService.loggedInUser.id === userId;
    }
    return false;
  }

  private get newItemObject(): CommentOrReviewNote {
    return {
      userId: this.sessionService.loggedInUser.id,
      person: User.fullName(this.sessionService.loggedInUser.firstName, this.sessionService.loggedInUser.lastName) || 'Unknown user',
      text: this.editorComponent.getValue(),
      email: this.sessionService.loggedInUser.email,
      time: new Date()
    };
  }

  switchItemMode() {
    this.newItemMode = !this.newItemMode;
  }

  onCloseAndSave() {
    this.localItems.unshift(this.newItemObject);
    this.onCloseDialog(true);
  }

  onDeleteComment(idx) {
    if (window.confirm('Are you sure you wish to delete?')) {
      this.forceSave = true;
      this.localItems.splice(idx, 1);
    }
  }

  onCloseDialog(saveComments: boolean = false) {
    this.localItems.forEach(i => {
      delete i['user'];
      delete i['hidden'];
    });
    this.data.comments = this.localItems;
    this.dialogResult.emit(saveComments || this.forceSave ? ActionType.Save : ActionType.Cancel);
  }

  showReviewerName(comment: CommentOrReviewNote): boolean {
    const roles = this.sessionService.loggedInUser.roles;
    if (this.data.resource.reviewType === ReviewType.Blind && comment.user && comment.user.roles.indexOf(Role.Reviewer) > -1) {
      return roles.indexOf(Role.Publisher) > -1 || roles.indexOf(Role.Planner) > -1 || roles.indexOf(Role.Editor) > -1
        || comment.userId === this.sessionService.loggedInUser.id;
    } else {
      return true;
    }
  }

  getRoleLabel(comment: CommentOrReviewNote): string {
    if (comment.user && comment.user.roles.length > 0 ) {
      return comment.user.roles.map(r => startCase(r)).join(', ');
    } else {
      return '';
    }
  }
}
