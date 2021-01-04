import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {HelpService} from '../../shared/services/help.service';
import {NotificationsService} from 'angular2-notifications';

@Component({
  selector: 'app-help-admin-list',
  templateUrl: './help-admin-list.component.html',
  styleUrls: ['./help-admin-list.component.scss']
})
export class HelpAdminListComponent implements OnInit {
  public options = {
    position: ['bottom', 'right'],
    timeOut: 5000,
    lastOnBottom: true
  };

  constructor(public helpService: HelpService,
              private notificationsService: NotificationsService,
              private router: Router) {
  }

  ngOnInit() {
    this.fillTable();
  }

  fillTable() {
    this.helpService.query().subscribe(data => {
      this.helpService.helpDocuments = data;
    });
  }

  editDocumentClickHandler(document) {
    this.helpService.selectedDocument = document;
    this.router.navigate(['/help-admin/edit']);
  }

  newDocumentClickHandler() {
    this.helpService.selectedDocument = null;
    this.router.navigate(['/help-admin/edit']);
  }


  deleteClickHandler(document) {
    this.helpService.remove(document).subscribe(data => {
      this.fillTable();
      this.notificationsService.success('Success', 'Document deleted successfully');
    });
  }
}
