import {Component, Input, OnInit} from '@angular/core';
import {Disclosure, DisclosureType} from '../../../../shared/models/disclosure';
import {UserService} from '../../../../shared/services/user.service';
import {DialogService} from '../../../../shared/services/dialog.service';
import {ActionType} from '../../../../shared/models/action-type';
import {User} from '../../../../shared/models/user';
import {DisclosureEditService} from '../../disclosure-edit.service';
import {GridTableConfig} from '../../../../shared/grid-table/grid-table.config';
import {GridColumn} from '../../../../shared/grid-table/grid.column';
import {DisclosureService} from '../../../../shared/services/disclosure.service';
import {finalize} from 'rxjs/operators';
import {ContextMenuItems} from '../../../../shared/models/context-menu-items';

@Component({
  selector: 'app-disclosure-edit',
  templateUrl: './disclosure-edit.component.html',
  styleUrls: ['./disclosure-edit.component.scss']
})
export class DisclosureEditComponent implements OnInit {
  @Input() user: User;
  @Input() title: string;
  @Input() description: string;
  @Input() conflictPropertyName: string;
  @Input() disclosureType: DisclosureType;
  @Input() disclosures: Disclosure[];
  @Input() columnMetaData: GridColumn[];

  hasConflict: boolean = true;
  isDetailFormVisible: boolean = false;
  selectedDisclosure: Disclosure;
  config: GridTableConfig = new GridTableConfig({rowCount: 10, hasDetailsRow: true});
  showSpinner: boolean = false;

  DisclosureType = DisclosureType;
  contextMenuItems: string[] = [ContextMenuItems.Edit, ContextMenuItems.Delete];

  constructor(private userService: UserService,
              private dialog: DialogService,
              private disclosureService: DisclosureService,
              private disclosureEditService: DisclosureEditService) {
  }

  ngOnInit() {
    if (this.user) {
      this.hasConflict = this.user[this.conflictPropertyName] || this.hasDisclosures || true;
      if (this.user[this.conflictPropertyName] && this.disclosures && this.disclosures.length === 0) {
        this.addDisclosureHandler();
      }
    }
  }

  get hasDisclosures(): boolean {
    return this.disclosures && this.disclosures.length > 0;
  }

  onConflictChange(value) {
    if (value) {
      this.saveConflictState(true);
      if (!this.disclosures || this.disclosures.length === 0) {
        this.addDisclosureHandler();
      }
    } else {
      this.dialog.showConfirmModel(this, 'hasConflict', true)
        .subscribe(action => {
          if (action === ActionType.Confirmation) {
            this.saveConflictState(value);
          }
        });
    }
  }

  saveConflictState(val: boolean) {
    if (this.user) {
      this.user[this.conflictPropertyName] = val;
      this.userService.save(this.user).subscribe();
    }
  }

  addDisclosureHandler(): void {
    this.isDetailFormVisible = true;
    this.selectedDisclosure = new Disclosure();
    this.selectedDisclosure.type = this.disclosureType;
    this.selectedDisclosure.status = Disclosure.ACTIVE;
  }

  onEditSelect(disclosure: Disclosure): void {
    this.isDetailFormVisible = true;
    this.showSpinner = true;
    this.disclosureService.findById(disclosure.id)
      .pipe(finalize(() => this.showSpinner = false))
      .subscribe((d) => this.selectedDisclosure = d);
  }

  onDeleteSelect(disclosure: Disclosure) {
    this.disclosures = this.disclosureEditService.deleteDisclosure(disclosure, this.disclosures);
  }

  hideForm(val: any): void {
    this.isDetailFormVisible = false;
    if (val === 'cancel' && this.disclosures && this.disclosures.length === 0) {
      this.hasConflict = false;
    }
  }

  saveDisclosure(disclosure: Disclosure): void {
    this.disclosureEditService.saveForm(disclosure).subscribe(data => {
      this.hideForm(true);
      const index = this.disclosures.findIndex(d => d.id === data.id);
      index < 0 ? this.disclosures.push(data) : this.disclosures[index] = data;
    });
  }
}
