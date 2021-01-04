import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {UserCourseService} from '../../shared/services/user-course.service';
import {ExamService} from '../../shared/services/exam.service';
import {RoutesRp} from '../../shared/models/routes-rp';

@Component({
  selector: 'app-rate-course',
  templateUrl: 'rate-course.component.html'
})
export class RateCourseComponent implements OnInit {
  disclosures: any = [];

  constructor(private router: Router,
              private userCourseService: UserCourseService,
              private examService: ExamService) {
  }

  ngOnInit() {
  }

  responseClickHandler(wouldRecommend) {
    if (wouldRecommend) {
      if (!this.userCourseService.selectedExam.recommend) {
        this.userCourseService.selectedExam.recommend = 1;
      } else {
        this.userCourseService.selectedExam.recommend++;
      }
    } else {
      if (!this.userCourseService.selectedExam.notRecommend) {
        this.userCourseService.selectedExam.notRecommend = 1;
      } else {
        this.userCourseService.selectedExam.notRecommend++;
      }
    }
    this.examService.save(this.userCourseService.selectedExam).subscribe();
    this.router.navigate([RoutesRp.Home]);
  }
}
