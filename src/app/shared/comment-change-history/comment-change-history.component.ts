import {Component, OnInit, Input, Output, EventEmitter} from '@angular/core';
import {Exam} from '../models/exam';
import {ActionType} from '../models/action-type';
import { MatDialog } from '@angular/material/dialog';
import {DialogCommentComponent} from './dialog-comment/dialog-comment.component';
import DialogConfig, {CommentOrReviewNoteDialog} from '../models/dialog-config';
import {DialogChangeHistoryComponent} from './dialog-change-history/dialog-change-history.component';
import {CommentPermissions, ContentPermissions} from '../models/action-permissions';
import {PermissionService} from '../services/permission.service';
import {ChangeHistoryService} from '../services/change-history.service';
import * as TextDiff from 'text-diff';
import {SessionService} from '../services/session.service';

@Component({
  selector: 'app-comment-change-history',
  templateUrl: './comment-change-history.component.html',
  styleUrls: ['./comment-change-history.component.scss']
})
export class CommentChangeHistoryComponent implements OnInit {
  @Input() selectedResource: any;
  @Input() resourceElement: string;
  @Input() disabled: boolean;
  @Input() showChanged: boolean;
  @Input() label: string;
  @Input() originalValue: string;
  @Input() currentValue: string;
  @Output() useThisVersionClicked = new EventEmitter<string>();

  hideChangeHistory: boolean = false;
  hideComments: boolean = false;
  fieldHasData: boolean = false;
  commentPerms: CommentPermissions;
  initialCommentCount: number = 0;
  changeHistoryCount: number = 0;
  lastSaved: Date;

  ActionType = ActionType;

  get hasCommentData(): boolean {
    this.updateCounts();
    return this.initialCommentCount > 0;
  }

  get hasChangeHistoryData(): boolean {
    return this.changeHistoryCount > 0;
  }

  get isNewComment(): boolean {
    this.updateCounts();
    const currentCount = this.selectedResource.comments && this.selectedResource.comments[this.resourceElement] && this.selectedResource.comments[this.resourceElement].length;
    return (currentCount || 0) !== (this.initialCommentCount || 0);
  }

  constructor(private dialog: MatDialog,
              private sessionService: SessionService,
              private permissionService: PermissionService,
              private changeHistoryService: ChangeHistoryService) {
  }

  ngOnInit() {

    this.fieldHasData = !!this.selectedResource[this.resourceElement];

    const changePerms = this.permissionService.getBestChangeHistoryPermissions(this.selectedResource);
    this.commentPerms = this.permissionService.getBestCommentPermissions(this.selectedResource);
//  !this.selectedResource.id ||
    this.hideChangeHistory = this.hideChangeHistory || !((changePerms.view === ContentPermissions.all || changePerms.view === ContentPermissions.own)
      || (changePerms.viewBlind === ContentPermissions.all || changePerms.viewBlind === ContentPermissions.own));
    this.hideComments = this.hideComments || !((this.commentPerms.view === ContentPermissions.all || this.commentPerms.view === ContentPermissions.own)
      || (this.commentPerms.viewBlind === ContentPermissions.all || this.commentPerms.viewBlind === ContentPermissions.own));

    this.updateCounts();
  }

  updateCounts() {
    if (this.selectedResource.lastUpdated && (!this.lastSaved || this.lastSaved < this.selectedResource.lastUpdated)) {
      this.lastSaved = this.selectedResource.lastUpdated;
      this.initialCommentCount = this.selectedResource.comments && this.selectedResource.comments[this.resourceElement] && this.selectedResource.comments[this.resourceElement].length;
      if (this.selectedResource.id) {
        this.changeHistoryService.findByKey(`${this.selectedResource.id}:${this.resourceElement}`)
          .subscribe(changeHistory => {
            this.permissionService.filterChangeHistoryForUser(changeHistory, this.selectedResource).then(changes => this.changeHistoryCount = changes.length);
          });
      }
    }
  }

  onShowCommentDialog() {
    const dialogData: CommentOrReviewNoteDialog = {
      title: `Comments for ${this.label || this.resourceElement}`,
      comments: this.selectedResource.comments ? this.selectedResource.comments[this.resourceElement] || [] : [],
      resource: this.selectedResource,
      permissions: this.commentPerms
    };

    const ref = this.dialog.open(DialogCommentComponent, DialogConfig.defaultCommentDialogConfig(dialogData));
    ref.componentInstance.dialogResult.subscribe((result: ActionType) => {
      if (result === ActionType.Save) {
        if (!this.selectedResource.comments) {
            this.selectedResource.comments = {};
        }
        this.selectedResource.comments[this.resourceElement] = dialogData.comments;
        this.fieldHasData = !!this.selectedResource[this.resourceElement];
      }
      ref.close();
    });
  }

  getUnsavedChange(): any {
    if (this.originalValue !== this.currentValue) {
      const textDiff = new TextDiff();
      const difference = textDiff.main(this.originalValue, this.currentValue);
      textDiff.cleanupSemantic(difference);
      const differenceSummary = textDiff.prettyHtml(difference);
      const changeHistory = {
        userId: this.sessionService.loggedInUser.id || '',
        name: this.sessionService.loggedInUser.firstName + ' ' + this.sessionService.loggedInUser.lastName,
        input: this.resourceElement,
        value: this.currentValue,
        withDiff: differenceSummary,
        timestamp: new Date().toISOString(),
        removed: '',
        added: ''
      };
      difference.forEach((diffVal) => {
        if (diffVal[0] === -1) {
          changeHistory.removed = diffVal[1];
        }
        if (diffVal[0] === 1) {
          changeHistory.added = diffVal[1];
        }
      });
      return changeHistory;
    }
  }

  onShowChangeHistoryDialog() {
    const ref = this.dialog.open(DialogChangeHistoryComponent, DialogConfig.defaultChangeHistoryDialogConfig({
      title: `Change history for ${this.label || this.resourceElement}`,
      resourceElement: this.resourceElement,
      resource: this.selectedResource,
      unsavedChange: this.getUnsavedChange()
    }));

    ref.componentInstance.useThisVersionClicked.subscribe(result => {
      this.useThisVersionClicked.emit(result);
      ref.close();
    });
  }
}
