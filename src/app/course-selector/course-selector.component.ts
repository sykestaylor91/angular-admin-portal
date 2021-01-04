import {Component, OnInit, ViewChild, OnDestroy} from '@angular/core';
import {Router} from '@angular/router';
import {AccountService} from '../shared/services/account.service';
import {CheckoutBasketService} from '../shared/services/checkout-basket.service';
import {ExamService} from '../shared/services/exam.service';
import {SessionService} from '../shared/services/session.service';
import {UserExamService} from '../shared/services/user-exam.service';
import {PreActivityInformationComponent} from '../shared/pre-activity-information/pre-activity-information.component';
import {ActivityStatus} from '../shared/models/activity-status';
import {NotificationsService} from 'angular2-notifications';
import { MatDialog } from '@angular/material/dialog';
import {Exam} from '../shared/models/exam';
import {RoutesRp} from '../shared/models/routes-rp';

@Component({
  selector: 'app-course-selector',
  templateUrl: './course-selector.component.html'
})
export class CourseSelectorComponent implements OnInit, OnDestroy {
  filterByTypeSelect: any;
  showSpinner: boolean = true;
  courses: Exam[] = [];
  userExams: any = [];
  filter: string;
  showCart: boolean = false;
  courseTypes: any = [];
  filteredCourses: Exam[] = [];
  filterTerm: string;
  private filterType: string;
  private openCourses: any = [];
  private selectedCourse: any;
  private selectedCourseCitations: any;
  private selectedCourseDisclosures: any = [];
  private selectedCourseAccreditationStatement: any;

  // TODO: Consolidate these dialogComponents....
  @ViewChild(PreActivityInformationComponent) private childPreActivityInformationComponent: PreActivityInformationComponent;

  constructor(public checkoutBasketService: CheckoutBasketService,
              private router: Router,
              private dialog: MatDialog,
              private accountService: AccountService,
              private examService: ExamService,
              private userExamService: UserExamService,
              private notificationsService: NotificationsService,
              private sessionService: SessionService) {
  }

  ngOnInit() {
    this.constructCourses();
    if (this.sessionService.loggedInUser && this.sessionService.loggedInUser.basketContents) {
      this.checkoutBasketService.initiateBasket();
      this.checkoutBasketService.calculateTotalPrice();
    }
  }

  ngOnDestroy() {
    this.checkoutBasketService.save();
  }

  constructCourses() {
    // TODO: This needs to filter out withdrawn activities
    this.examService.getExams().subscribe(examData => {
      this.courses = this.getPublishedExams(examData);
      // this.courses = this.orderByDate(this.courses);
      this.filteredCourses = this.courses;
      this.setCourseTypes();
      this.userExamService.queryAll().subscribe(userExamData => {
        this.userExams = userExamData;
        const that = this;
        this.openCourses = [];
        this.userExams.forEach(function (userExam) {
          if ((userExam.status === 'open' || userExam.status === 'paused') && that.sessionService.loggedInUser && that.sessionService.loggedInUser.id === userExam.userId) {
            that.openCourses.push(userExam);
          }
        });
      });
      this.showSpinner = false;
    });
  }

  getButtonText(exam) {
    const currentUser = this.sessionService.loggedInUser;
    let buttonText: string;
    buttonText = 'Purchase';

    if (this.courseInBasket(exam)) {
      buttonText = 'Remove';
    }
    this.userExams.forEach(function (userExam) {
      if (exam && currentUser && userExam.examId === exam.id && userExam.userId === currentUser.id) {
        buttonText = 'Retake';
      }
      // TODO: Check account service to see if exam has been purchased
    });
    if (this.courseHasBeenPurchased(exam)) {
      buttonText = 'Take';
    }
    return buttonText;
  }

  updateFilteredItems(array) {
    this.filteredCourses = array;
  }

  setCourseTypes() {
    const that = this;
    this.courses.forEach(function (exam) {
      if (that.courseTypes.indexOf(exam.type) === -1) {
        that.courseTypes.push(exam.type);
      }
    });
  }

  filterByType(type) {
    this.filterType = type;
  }

  clearFilters() {
    this.filterTerm = '';
  }

  courseInBasket(course) {
    for (let i = this.checkoutBasketService.basketContents.length - 1; i >= 0; i--) {
      if (this.checkoutBasketService.basketContents[i].id === course.id) {
        return true;
      }
    }
    return false;
  }

  displayReadMoreClickHandler(course) {
    this.selectedCourse = course;
    this.selectedCourseCitations = [];
    this.selectedCourseDisclosures = [];
    this.selectedCourseAccreditationStatement = null;
    const dialogData = {
      content: course,
      title: 'About this activity',
      dimensions: [80, 80],
      actions: []
    };
    this.childPreActivityInformationComponent.openDialog(dialogData);
  }

  addToBasketClickHandler(course) {
    this.checkoutBasketService.addToBasket(course);
    this.checkoutBasketService.calculateTotalPrice();
  }

  courseHasBeenPurchased(course) {
    // TODO Replace temporary system for faking course purchases
    return (course && this.sessionService.loggedInUser && this.sessionService.loggedInUser.coursesOwned && this.sessionService.loggedInUser.coursesOwned.indexOf(course.id) > -1);
  }

  checkoutClickHandler() {
    this.router.navigate(['/activity-checkout']);
  }

  dismissCartClickHandler() {
    this.showCart = false;
  }

  showCartClickHandler() {
    this.showCart = true;
  }

  homeClickHandler() {
    this.router.navigate(['/']);
  }

  deleteClickHandler(id) {
    this.checkoutBasketService.removeFromBasket(id);
    this.checkoutBasketService.calculateTotalPrice();
  }

  takeCourseClickHandler(exam: Exam) {
    // TODO If course not yet taken then call transaction process L9.4.2
    if (this.openCourses.length > 0) {
      const msg = 'Please complete or abandon any active course before attempting to start a new one.';
      this.notificationsService.error('You already have an active course', msg);
    } else {
      // this.userCourseService.selectedExam = course;
      this.router.navigate([RoutesRp.ActivityIntro, exam.id]);
      // this.router.navigate(['/activity-manager/list/draft'], { queryParams: { accepted: true, acceptedActivityName: this.exam.title } });
    }
  }

  getPublishedExams(courses) {
    if (courses && courses.length > 0) {
      for (let i = courses.length - 1; i >= 0; i--) {
        if (courses[i].status !== ActivityStatus.Published) {
          courses.splice(i, 1);
        }
      }
    }
    return courses;
  }

  reOrder(event) {
  }
}
