import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {ExamType} from '../../../shared/models/exam-type';

@Component({
  selector: 'app-activity-manager-template-header',
  templateUrl: './activity-manager-template-header.component.html',
  styleUrls: ['./activity-manager-template-header.component.scss']
})
export class ActivityManagerTemplateHeaderComponent implements OnInit {
  NewCourseType = ExamType;

  constructor(private routes: Router) {
  }

  ngOnInit() {
  }

  // getUser() {
  //   this.sessionService.validateSession().subscribe(user => {
  //     this.user = user;
  //   });
  // }

  onNewCourseClick(type: ExamType) {
    this.routes.navigate(['/activity-manager/new/' + encodeURI(type)]);  // TODO: This should be a different route /activity-manager/new
  }

  newPostCourseClickHandler() {
    this.routes.navigate(['/activity-manager/evaluation/new']);
  }

}
