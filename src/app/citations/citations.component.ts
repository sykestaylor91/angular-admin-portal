import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { Citation } from '../shared/models/citation';
import { CitationService } from '../shared/services/citation.service';
import { ActionType } from '../shared/models/action-type';
import { MatDialog } from '@angular/material/dialog';
import DialogConfig from '../shared/models/dialog-config';
import { DialogEditorComponent } from '../shared/dialog/dialog-editor/dialog-editor.component';
import { FormsManagementDirective } from '../shared/helpers/forms.management.directive';
import { Exam } from '../shared/models/exam';
import { NotificationsService } from 'angular2-notifications';
import Utilities from '../shared/utilities';
import { CitationsColumnMetaData } from './citations.column.meta-data';
import { GridTableConfig } from '../shared/grid-table/grid-table.config';
import { ActivityStatus } from '../shared/models/activity-status';
import { GridColumn } from '../shared/grid-table/grid.column';
import { PermissionService } from '../shared/services/permission.service';
import { Column, ColumnType } from '../shared/models/column';
import { ContextMenuItems } from '../shared/models/context-menu-items';
import { Router } from '@angular/router';

@Component({
  selector: 'app-citations',
  templateUrl: 'citations.component.html'
})
export class CitationsComponent extends FormsManagementDirective implements OnInit {
  @Input() selectedExam: Exam;
  @Output() citationDeleted = new EventEmitter<Citation>();

  title: string = 'Activity citations';
  pristineCitations: Citation[] = [];
  filteredCitations: Citation[] = [];
  filterTerm: string;
  showOrderBy: boolean = false;
  showAddCitationsButton: boolean = false;
  config: GridTableConfig = new GridTableConfig({ rowCount: 10, hasDetailsRow: true });
  citationsColumnMetaData: GridColumn[] = [];
  customButtonLabel = 'Invite';

  StatusCode = ActivityStatus;
  contextMenu: string[] = [ContextMenuItems.Edit, ContextMenuItems.Delete];
  columns: Column[];
  constructor(private citationService: CitationService,
    private permissionService: PermissionService,
    private notificationsService: NotificationsService,
    private dialog: MatDialog, private router: Router) {
    super(permissionService);
  }

  ngOnInit() {
    this.filteredCitations = [];

    if (this.selectedExam) {
      this.citationsColumnMetaData = CitationsColumnMetaData.getExamColumnMetaData();
      this.getExamCitations();
      this.handleReadOnlyStatus();

    } else {
      this.citationsColumnMetaData = CitationsColumnMetaData.getCourseCitationColumnMetaData();
      this.getCourseCitations();
    }

    this.columns = [
      {
        title: 'Citation',
        field: 'text',
        type: ColumnType.StripTags,
        width: '60%'
      },
      {
        title: 'activities',
        field: 'id',
        type: ColumnType.ArrayLinks,
        routePath: '/activity-manager/edit/'
      },
      {
        title: 'Date updated',
        field: 'disclosureDeclarationUpdate',
        type: ColumnType.Date
      }
    ];
  }

  get hasCitations(): boolean {
    return this.pristineCitations && this.pristineCitations.length > 0;
  }

  getExamCitations() {
    this.citationService.findMultiple(this.selectedExam.citations)
      .subscribe((citations: Citation[]) => {
        this.filteredCitations = citations;
        this.pristineCitations = this.filteredCitations;
      });
  }

  getCourseCitations() {
    this.citationService.query(false, true).subscribe(data => {
      this.filteredCitations = data;
      this.pristineCitations = data;
      this.showSpinner = false;
    });

    this.title = 'Citation library';
    this.showAddCitationsButton = true;
    this.showOrderBy = true;
  }

  filterCitations() {
    if (!this.filterTerm || this.filterTerm.trim() === '') {
      this.filteredCitations = this.pristineCitations;
      return;
    }
    this.filteredCitations = [];
    for (let i = 0; i < this.pristineCitations.length; i++) {
      if (this.contains(this.pristineCitations[i].text, this.filterTerm)) {
        this.filteredCitations.push(this.pristineCitations[i]);
      }
    }
  }

  contains(value, filter): boolean {
    if (value === undefined || value === null) {
      return false;
    }
    return value.toString().toLowerCase().indexOf(filter.toLowerCase()) !== -1;
  }

  onOrderChange(event) {
    this.filteredCitations = this.filteredCitations.sort(Utilities.dateSorter('dateCreated', event === 'newToOld' ? 'desc' : 'asc'));
  }

  onShowDialog(mode: 'edit' | 'delete', citation: Citation) {
    if (citation) {
      const dialogData = DialogConfig.largeDialogBaseConfig(
        {
          title: mode === 'edit' ? 'Edit' : 'Delete' + ' citation',
          content: citation.text,
          actions: [mode === 'edit' ? ActionType.Save : ActionType.Confirmation, ActionType.Cancel],
          showCitations: false,
          showVideo: false,
          disabled: mode === 'delete'
        }
      );
      const ref = this.dialog.open(DialogEditorComponent, dialogData);
      ref.componentInstance.dialogResult
        .subscribe(result => {
          if (result === ActionType.Confirmation || result === ActionType.Save) {
            if (mode === 'edit') {
              citation.text = dialogData.data.content;
              this.saveEditCitationResponse(citation);
            } else {
              this.removeCitation(citation);
            }
          }
          ref.close();
        });
    }
  }

  removeCitation(citation: Citation) {
    if (this.selectedExam) {
      this.selectedExam.citations.splice(this.selectedExam.citations.indexOf(citation.id), 1);
      this.filteredCitations.splice(this.filteredCitations.findIndex(f => f.id === citation.id), 1);
      this.citationDeleted.emit(citation);
      // TODO: notify exam that citation has been removed and exam needs to remove that if found
    } else {
      this.citationService.remove(citation).subscribe(data => {
        this.filteredCitations.splice(this.filteredCitations.findIndex(f => f.id === citation.id), 1);
      });
    }
  }

  saveEditCitationResponse(citation: Citation) {
    this.citationService.save(citation).subscribe(data => {
      this.ngOnInit();
    });
  }

  onAddNewCitationClicked() {
    const dialogData = DialogConfig.largeDialogBaseConfig(
      {
        title: 'Create new citation',
        content: '',
        actions: [ActionType.Save, ActionType.Cancel]
      });
    const ref = this.dialog.open(DialogEditorComponent, dialogData);
    ref.componentInstance.dialogResult
      .subscribe(result => {
        if (result === ActionType.Save) {
          this.saveCitation(dialogData.data.content);
          ref.close();
        } else {
          ref.close();
        }
      });
  }

  saveCitation(text) {
    this.citationService.save(new Citation({ text, status: 'active' })).subscribe(citation => {
      this.ngOnInit();
      this.notificationsService.success('Success', 'Citation saved');
    });
  }

  isDeleteDisabled(item: Citation): boolean {
    return (item && item.activities) && (item.activities.length > 1
      || (item.activities.length === 1 &&
        !(item.activities[0].status === ActivityStatus.UnderConstruction || item.activities[0].status === ActivityStatus.Returned)
      ));
  }
}
