import {Component, OnInit} from '@angular/core';
import {Exam, ResolvedExam} from '../../../../shared/models/exam';
import {ActivatedRoute, Router} from '@angular/router';

@Component({
  selector: 'app-course-contributor-accept',
  templateUrl: 'course-contributor-accept.component.html',
  styleUrls: ['course-contributor-accept.component.scss'],
  providers: []
})
export class CourseContributorAcceptComponent implements OnInit {
  showSpinner: boolean = true;
  exam: Exam;

  constructor(private route: ActivatedRoute, private router: Router) {
  }

  ngOnInit(): void {
    this.route.data.subscribe((data: { resolvedExam?: ResolvedExam }) => {
      this.exam = data.resolvedExam.exam;
      this.showSpinner = false;

      this.router.navigate(['/activity-manager/list'], { queryParams: { accepted: true, acceptedActivityName: this.exam.title } });
    });
  }

}
