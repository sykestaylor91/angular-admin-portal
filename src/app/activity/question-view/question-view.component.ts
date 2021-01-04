import {Component, HostListener, OnChanges, OnDestroy, OnInit, SimpleChanges, ViewChild} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {UserExam} from '../../shared/models/user-exam';
import {Question, ResolvedQuestionContent} from '../../shared/models/question';
import {catchError, finalize, tap} from 'rxjs/operators';
import {Response} from '../../shared/models/response';
import {ResponseService} from '../../shared/services/response.service';
import {UserExamService} from '../../shared/services/user-exam.service';
import {CourseNavigationComponent} from './course-navigation/course-navigation.component';
import {throwError} from 'rxjs';
import {NotificationsService} from 'angular2-notifications';
import {EventTrackingService} from '../../shared/services/event-tracking.service';
import {EventTypes} from '../../shared/models/event-types.enum';
import {UserExamStatus} from '../../shared/models/user-exam-status';
import {ExamService} from '../../shared/services/exam.service';
import {Exam} from '../../shared/models/exam';
import {AnswerOption} from '../../shared/models/answer-option';
import {RevealAnswerType} from '../../shared/models/reveal-answer-type';
import {SessionService} from '../../shared/services/session.service';
import {QuestionService} from '../../shared/services/question.service';
import Utilities from '../../shared/utilities';
import {QuestionType} from '../../shared/models/question-type';
import {MatDialog} from '@angular/material/dialog';
import {MatMenuTrigger} from '@angular/material/menu';
import {cloneDeep} from 'lodash';
import {DialogEditorComponent} from '../../shared/dialog/dialog-editor/dialog-editor.component';
import {ActionType} from '../../shared/models/action-type';
import DialogConfig from '../../shared/models/dialog-config';
import {animate, style, transition, trigger} from '@angular/animations';
import FullScreenUtilities from '../../shared/helpers/fullscreen-utilities';
import {SecurityDialogComponent} from '../../shared/security-dialog/security-dialog.component';
import {DeviceDetectorService} from 'ngx-device-detector';
// for offline handling
import {ConnectionService} from 'ng-connection-service';
import {OfflineService} from '../../shared/services/offline.service';

// export enum Confidence {
//   Confident = 'confident',
//   Unsure = 'unsure',
//   Wrong = 'wrong'
// }

// TODO: component needs refactoring. It's far too big. Delegate some responsibility.
@Component({
  selector: 'app-question-view',
  templateUrl: 'question-view.component.html',
  styleUrls: ['./question-view.component.scss'],
  animations: [
    trigger(
      'enterAnimation', [
        transition(':enter', [
          style({opacity: 0}),
          animate('150ms', style({opacity: 1}))
        ]),
        transition(':leave', [
          style({opacity: 1}),
          animate('150ms', style({opacity: 0}))
        ])
      ]
    )
  ]
})
export class QuestionViewComponent implements OnInit, OnDestroy, OnChanges {

  question: Question;
  response: Response;
  @ViewChild(MatMenuTrigger) trigger: MatMenuTrigger;
  @ViewChild(CourseNavigationComponent) private courseNavigationComponent: CourseNavigationComponent;

  answerOptions: AnswerOption[] = [];
  serialQuestionAnswerOptions: any[] = [];
  // Confidence = Confidence;
  learningMaterialActive: boolean = false;
  postCourseEvaluationMode: boolean = false;
  previewMode: boolean = false;
  showLoading: boolean = false;
  serialQuestionsLoaded: boolean = true;
  questionLoaded: boolean = true;

  studyModeAllowed: boolean = false;
  answerSubmitted: boolean = false;
  allQuestionsAnswered: boolean = false;
  hideDiscussion: boolean = false;
  // has user completed the activity
  viewCourseComplete: boolean = false;
  // is it retake of already completed activity
  isRetakeAfterCompleted: boolean = false;
  currentQuestion: Question;
  serialQuestions: any[] = [];
  currentQuestionIndex: number;
  currentResponse: Response;
  currentSerialResponse: Response[] = [];
  questions: Question[] = [];
  responses: any[] = [];
  selectedExam: Exam = new Exam();
  userExam: UserExam;
  newIntroText: string = '';
  newQuestionText: string = '';
  totalQuestionCount: number = 0;
  freeTextAnswer: string;
  serialFreeTextAnswers: any[] = [];
  untouchedOriginalQuestionData: Question;
  highlightingAdded: boolean = false;
  showCalculator: boolean = false;
  revisitList: string[] = [];
  isOnline: boolean = true;
  isSerialQuestion: boolean = false;
  revealDiscussion: boolean = false;
  responseCorrect: boolean = false;
  allQuestionsAnsweredCorrectly: boolean = false;

  private securityCheck: any;

  @HostListener('window:focus', ['$event'])
  onFocus(event: any): void {
    // this.notificationsService.bare('Enter focus event' , event);
  }

  @HostListener('window:blur', ['$event'])
  onBlur(event: any): void {
    // this.notificationsService.bare('Exit focus event' , event);
    if (this.userExam && this.userExam.examMode && this.selectedExam.useSecurity) { // && !this.userExam.securityLock
      this.lockExam();
      this.notificationsService.error('Security lock applied.', 'You have triggered the security features of this exam and have been locked out.');

    }
  }

  get hasMoreQuestionsToAnswer(): boolean {
    return this.responses.length < this.totalQuestionCount;
  }

  get isExamCompleted(): boolean {
    return this.userExam && this.userExam.status === UserExamStatus.Completed;
  }

  constructor(private route: ActivatedRoute,
              private dialog: MatDialog,
              private notificationsService: NotificationsService,
              private connectionService: ConnectionService,
              private responseService: ResponseService,
              private userExamService: UserExamService,
              private examService: ExamService,
              private sessionService: SessionService,
              private questionService: QuestionService,
              private deviceService: DeviceDetectorService,
              private eventTrackingService: EventTrackingService,
              private offlineService: OfflineService) {  }

  ngOnInit() {
    this.route.data.subscribe((data: { resolvedQuestionView: ResolvedQuestionContent }) => {
      this.userExam = (data && data.resolvedQuestionView) ? data.resolvedQuestionView.userExam : new UserExam();
      // if(data && data.resolvedQuestionView) {
      //   // lets mix stuff up
      //   data.resolvedQuestionView.questions = Utilities.shuffleArray(data.resolvedQuestionView.questions);
      // }
      this.questions = (data && data.resolvedQuestionView) ? data.resolvedQuestionView.questions : [];
      this.totalQuestionCount = this.getFullQuestionCount(this.questions);
      this.previewMode = (data && data.resolvedQuestionView) ? data.resolvedQuestionView.previewMode : true;
      this.responses = (data && data.resolvedQuestionView) ? data.resolvedQuestionView.responses : [];
      this.question = (data && data.resolvedQuestionView) ? data.resolvedQuestionView.questions[0] : new Question();
      this.currentQuestion = (data && data.resolvedQuestionView) ? data.resolvedQuestionView.questions[0] : this.question;
      this.untouchedOriginalQuestionData = cloneDeep(this.question);
      this.examService.findById(this.userExam.examId)
        .pipe(finalize(() => this.showLoading = false))
        .subscribe(exam => {
          this.selectedExam = exam;
          if (this.userExam && this.userExam.examMode && this.selectedExam && this.selectedExam.useSecurity) {
            FullScreenUtilities.openFullScreen();
          }
          this.setUpSecurity();
        });
      this.initializePage();
      window.document.getElementById('sidenav-container').lastElementChild.scrollTo(0, 0);
      this.isOnline = window.navigator.onLine;
    });
    this.connectionService.monitor().subscribe(isConnected => {
      this.isOnline = isConnected;
      this.eventTrackingService.trackEvent(EventTypes.online, { userId: this.sessionService.loggedInUser.id});

    });
  }

  setUpSecurity(): void {
    const that = this;
    this.securityCheck = setInterval(function () {

      if (that.userExam && that.userExam.examMode && !FullScreenUtilities.isFullScreen
        && that.selectedExam.useSecurity && !that.userExam.securityLock
        && (!that.deviceService.isMobile() && !that.deviceService.isTablet())) {

        that.notificationsService.error('Security lock applied', 'You have triggered the security features of this exam and have been locked out.');
        that.lockExam();

      }
    }, 2000);

    // TODO: replace with ElementRef
    window.document.getElementById('sidenav-container').lastElementChild.scrollTo(0, 0);
  }

  ngOnDestroy(): void {
    clearInterval(this.securityCheck);
    if (FullScreenUtilities.isFullScreen) {
      FullScreenUtilities.closeFullScreen();
    }
  }

  initializePage() {
    this.setQuestion(this.userExam.currentQuestion || this.question.id);
    // Don't show learningMaterial if we are taking exam;
    this.learningMaterialActive = (!this.responses || this.responses.length === 0) &&
      this.userExam.learningMaterial && this.userExam.learningMaterial.length > 0 &&
      !(this.userExam.learningMaterial[0].text === null || this.userExam.learningMaterial[0].text === undefined || this.userExam.learningMaterial[0].text === '');
  }

  getCurrentQuestionIndex() {
    return this.questions.findIndex(q => q.id === this.currentQuestion.id);
  }

  getNextIndex(qidOrD?: string): number {
    let idx: number = 0;
    if (qidOrD === 'next') {
      // direction = 'next'
      idx = this.getCurrentQuestionIndex() + 1;
    } else if (qidOrD === 'back') {
      idx = this.getCurrentQuestionIndex() - 1;
    } else if (qidOrD) {
      idx = this.questions.findIndex(q => q.id === qidOrD);
    }
    if (idx < 0 || idx >= this.questions.length) {
      idx = 0;
    }
    return idx;
  }

  findNextQuestion(qid?: string): Question {

    let idx: number = this.getNextIndex(qid);
    if (this.isRetakeAfterCompleted) {
      return this.getNextIncorrectOrSkippedAnswer(idx);
    } else {
      const nextQuestion: Question = this.questions[idx];
      if (nextQuestion) {
        return nextQuestion;
      } else if (this.responses.length > 0 && this.responses.length <= this.questions.length) {
        idx = this.questions.findIndex(q => this.responses.some(r => q.id !== r.questionId));
        return this.questions[idx];
      }
    }
    return null;
  }

  getNextIncorrectOrSkippedAnswer(index) {
    const correctArray = [];
    let currentIndex = index;
    let nextQuestion: Question = null;
    while (currentIndex < this.questions.length) {
      this.responses.forEach(res => {
        if (res.correct && res.questionId === this.questions[currentIndex].id) {
          correctArray.push(res.questionId);
        }
      });
      currentIndex++;
    }
    currentIndex = index;
    while (currentIndex < this.questions.length) {
      if (correctArray.indexOf(this.questions[currentIndex].id) < 0 && this.questions[currentIndex].id !== this.currentQuestion.id) {
        nextQuestion = this.questions[currentIndex];
        break;
      }
      currentIndex++;
    }
    console.log('******* correctArray', correctArray);
    console.log('******* nextQuestion', nextQuestion);
    return nextQuestion;
  }

  // TODO: simplify
  setQuestion(questionId?: string) {
    let nextQuestion: Question = null;
    this.questionLoaded = false;
    this.revealDiscussion = false;
    this.responseCorrect = false;
    this.allQuestionsAnsweredCorrectly = this.allQuestionsAnsweredCorrectlyCheck();
    if (!this.allQuestionsAnsweredCorrectly) {

      nextQuestion = this.findNextQuestion(questionId);
      console.log('******* next question', nextQuestion);
    }
    if (nextQuestion && nextQuestion.id) {
      this.currentQuestion = this.questions.find(q => q.id === nextQuestion.id) || new Question();
      // console.log('**** current Quesiton: ', this.currentQuestion);
      this.isSerialQuestion = this.isSerialQuestionCheck();
      // TODO: check highlighting for serial questions
      this.highlightingAdded = (this.currentQuestion.question.includes('&#8203;&#8203;<span class="highlight"') ||
        (this.currentQuestion.intro && this.currentQuestion.intro.includes('&#8203;&#8203;<span class="highlight"')));

      if (this.isSerialQuestion) {
        this.getSerialQuestions(nextQuestion.serialQuestions);
      }
      this.answerSubmitted = false;
      this.allQuestionsAnswered = false;
      this.freeTextAnswer = '';
      this.userExam.currentQuestion = nextQuestion.id;
      // console.log('****** this.userExam.id: ', this.userExam.id);
      if (this.userExam.id && this.userExam.id !== 'preview') {
        this.userExamService.save(this.userExam)
          .pipe(
            finalize(() => {
            }),
            tap(userExam => {
              if (!userExam || !userExam.id) {
                this.notificationsService.error('Error navigating to next question');
              }
            }))
          .subscribe(userExam => {
            this.setCurrentResponse();
          });
      } else {
        this.setCurrentResponse();
      }
    } else {
      this.viewCompleteCourse();
    }

    // TODO: replace with ElementRef
    window.document.getElementById('sidenav-container').lastElementChild.scrollTo(0, 0);
    this.questionLoaded = true;
  }

  setCurrentResponse() {
    // console.log('****** setCurrentResponse');
    if (this.isSerialQuestion) {

      this.currentQuestion.serialQuestions.forEach((q, index) => {
        if (this.isRetakeAfterCompleted) {
          this.currentSerialResponse[index] = new Response();
        } else if (q.id && this.responses && this.responses.length > 0) {
          this.currentSerialResponse[index] = this.responses.find(r => r.answerGiven[0].questionId === q) || new Response();
        }
      });
    } else {
      if (this.isRetakeAfterCompleted) {
        this.currentResponse = new Response();
      } else if (this.currentQuestion.id && this.responses && this.responses.length > 0) {

        this.currentResponse = this.responses.find(r => r.questionId === this.currentQuestion.id) || new Response();
      }
    }
    this.parseAnswerOptions();
    this.currentQuestionIndex = this.getCurrentQuestionIndex();

    window.document.getElementById('sidenav-container').lastElementChild.scrollTo(0, 0);
  }

  getSerialQuestions(questions) {
    // TODO: adjust when we fetch complete list instead of one by one
    // TODO: there are much better ways to do this
    const interval = 200; // how much time should the delay between two iterations be (in milliseconds)?
    const serialQuestions = [];
    this.serialQuestionsLoaded = false;
    questions.forEach((question, index) => {
      this.questionService.findById(question)
        .subscribe(questionData => {
          const that = this;
          setTimeout(function () {
            // console.log('**** question data: ', questionData);
            that.serialQuestions.push(questionData);
            that.parseAnswerOptions();
            if (that.serialQuestions.length === questions.length) {
              that.serialQuestionsLoaded = true;
            }
          }, index * interval);
        });
    });
  }

  learningMaterialClose() {
    this.learningMaterialActive = false;
  }

  enablePostCourse() {
    if (this.userExam.examId) {
      if (!this.selectedExam) {
        this.showLoading = true;
        this.examService.findById(this.userExam.examId)
          .pipe(finalize(() => this.showLoading = false))
          .subscribe(exam => {
            this.selectedExam = exam;
            this.postCourseEvaluationMode = true;
          });
      } else {
        this.postCourseEvaluationMode = true;
      }
    }
  }

  viewCompleteCourse() {
    if (!this.selectedExam) {
      this.showLoading = true;
      this.examService.findById(this.userExam.examId)
        .pipe(finalize(() => this.showLoading = false))
        .subscribe(exam => {
          this.viewCourseComplete = true;
          this.selectedExam = exam;
        });
    } else {
      this.viewCourseComplete = true;

    }
    this.userExam.status = UserExamStatus.Completed;
  }

  retakeCompletedCourse() {
    this.isRetakeAfterCompleted = true;
    if (this.questions) {
      this.setQuestion(this.questions[0].id);
    }
    this.userExam.retakeAttempts++;
    this.viewCourseComplete = false;
  }

  saveResponse(responses: Response[]) {
    this.answerSubmitted = true;
    if (!this.previewMode) {
      // this.showQuestionPane = false;
      this.userExam.elapsedSeconds = this.courseNavigationComponent.elapsedSeconds;

      if (this.responses.length === this.totalQuestionCount) {
        this.userExam.status = UserExamStatus.Completed;
      }
      this.constructResponses(responses);
      this.setScore();

      if (this.isOnline) {
        // this.notificationsService.alert('online');

        const userExamObs = this.userExamService.save(this.userExam);
        const responseObs = (this.isSerialQuestion) ? this.responseService.saveSerial(responses) : this.responseService.save(responses[0]);
        responseObs
          .pipe(
            finalize(() => this.showLoading = false),
            catchError(err => {
              this.notificationsService.error('Error occurred', err);
              return throwError(err);
            })
          )
          .subscribe(r => userExamObs.subscribe(userExam => {

            if (!this.hasMoreQuestionsToAnswer) {
              // this.courseNavigationComponent.resumeTimer();
              this.userExam.elapsedSeconds = this.courseNavigationComponent.pauseTimer();
            }
            if (this.userExam.examMode) {
              this.setQuestion('next');
            }
          }));
      } else {
        // this.notificationsService.alert('offline');
        this.offlineService.saveToIndexedDb({type: 'userExam', data: this.userExam});
        const responseToSave = (this.isSerialQuestion) ? responses : responses[0];
        this.offlineService.saveToIndexedDb({type: 'response', data: responseToSave});

        if (!this.hasMoreQuestionsToAnswer) {
          // this.courseNavigationComponent.resumeTimer();
          this.userExam.elapsedSeconds = this.courseNavigationComponent.pauseTimer();
        }
        if (this.userExam.examMode) {
          this.setQuestion('next');
        }
      }
    }
  }

  constructResponses(responses) {
    if (this.isSerialQuestion) {
      responses.forEach(response => {
        response.userExamId = this.userExam.id;
        response.firstResponse = !responses || responses.length === 0;
        this.responses.push(response);
      });
    } else {
      responses[0].userExamId = this.userExam.id;
      responses[0].firstResponse = !this.responses || this.responses.length === 0;
      this.responses.push(responses[0]);
    }
  }

  responseChanged(answerOptions: AnswerOption[]) {
    this.answerOptions = answerOptions;
  }

  serialQuestionResponseChanged(answerOptions: AnswerOption[], serialIndex) {
    this.serialQuestionAnswerOptions[serialIndex] = answerOptions;
  }

  resetResponse() {
    // this.answerOptions = [];
    this.answerSubmitted = false;
    this.allQuestionsAnswered = false;
  }

  submitResponse() {
console.log('submitResponse');
    if (this.currentResponse) {
      this.currentResponse.answerGiven = this.answerOptions.filter(c => c.selected);
      this.currentResponse.correct = this.responseCorrect  = this.isResponseCorrect();
      this.currentResponse.questionId = this.currentQuestion.id;
    } else {
      this.currentResponse = new Response();
      this.currentResponse.answerGiven = this.answerOptions.filter(c => c.selected);
      this.currentResponse.correct = this.responseCorrect  = this.isResponseCorrect();
      this.currentResponse.questionId = this.currentQuestion.id;
      this.currentResponse.claimed = false;

      this.currentResponse.userId = this.sessionService.loggedInUser.id;
      this.currentResponse.session = this.userExam && this.userExam.id;
    }
    this.revealDiscussion = this.revealDiscussionCheck();
    this.saveResponse([this.currentResponse]);
  }

  submitSerialResponse() {
    const responses: Response[] = [];
    this.serialQuestionAnswerOptions.forEach(serialQuestionAnswerOptionList => {

      const response = new Response();
      response.answerGiven = serialQuestionAnswerOptionList.filter(c => c.selected);

      if (response.answerGiven.length > 0) {
        console.log('********* serialQuestionAnswerOptions', serialQuestionAnswerOptionList);
        console.log('********* this.response', this.response);
        console.log('********* this.responses', this.responses);
        console.log('********* this.currentResponse:', this.currentResponse);
        console.log('********* this.currentSerialResponse:', this.currentSerialResponse);
        response.correct = this.responseCorrect = this.isSerialResponseCorrect(serialQuestionAnswerOptionList);
        response.questionId = this.currentQuestion.id;
        response.claimed = false;

        response.userId = this.sessionService.loggedInUser.id;
        response.session = this.userExam && this.userExam.id;

        responses.push(response);
      }
    });
    this.currentSerialResponse = responses;
    this.revealDiscussion = this.revealDiscussionCheck();
    this.saveResponse(responses);
  }

  isResponseCorrect() {
    // if I'm a VSA
    console.log('************ isResponseCorrect');
    if (this.currentResponse && this.currentQuestion
      && this.currentQuestion.dataType === QuestionType.VeryShortAnswer) {
      return this.isVSAResponseCorrect(this.currentQuestion.answers, this.currentResponse.answerGiven[0].text);

      // if I'm a single sentence
    }if (this.currentResponse && this.currentQuestion
      && this.currentQuestion.dataType === QuestionType.SingleSentence) {
      // TODO: add single sentence check instead of borrowing VSA method
      return this.isVSAResponseCorrect(this.currentQuestion.answers, this.currentResponse.answerGiven[0].text);

      // if I'm a serial q
    } else if (this.isSerialQuestion) {
      let correctCount: number = 0;
      this.serialQuestionAnswerOptions.forEach(serialQuestionAnswerOptionList => {
        const response = new Response();
        response.answerGiven = serialQuestionAnswerOptionList.filter(c => c.selected);
        if (response.answerGiven.length > 0) {
          if (this.isSerialResponseCorrect(serialQuestionAnswerOptionList)) {
            correctCount++;
          }
        }
      });
      return correctCount === this.serialQuestionAnswerOptions.length;

      // If I'm evaluation rating
    } else if (this.currentQuestion.dataType === QuestionType.EvaluationRating) {
      return true;

      // if I'm single or multiple choice
    } else if (this.answerOptions) {
      return !this.answerOptions.some(c => (c.selected && !c.correct) || (!c.selected && c.correct));

      // if I'm correct
    } else if (this.response) {
      return true;
    }
  }

  isVSAResponseCorrect(answers, response) {
    let correct = false;
    answers.forEach((answer: String) => {
      const answerOption: AnswerOption = Utilities.parseAnswerOption(answer);
      if (response === answerOption.text) {
        // TODO: add close string matching, removal of typos, etc
        // TODO: facilitate single sentence check
        correct = true;
      }
    });
    return correct;
  }

  isSerialResponseCorrect(serialQuestionAnswerOptions): boolean {
    if (serialQuestionAnswerOptions) {

      // serialQuestionAnswerOptions.forEach( );
      // TODO: find out if I'm a VSA
      // TODO: facilitate single sentence check
      return !serialQuestionAnswerOptions.some(c => (c.selected && !c.correct) || (!c.selected && c.correct));
    } else {
      return false;
    }
  }

  // markAnswer(confidence: Confidence) {
    // if (this.confidentResponses.indexOf(this.currentQuestion.id) > -1) {
    //   this.confidentResponses.splice(this.confidentResponses.indexOf(this.currentQuestion.id), 1);
    // }
    // if (this.unsureResponses.indexOf(this.currentQuestion.id) > -1) {
    //   this.unsureResponses.splice(this.unsureResponses.indexOf(this.currentQuestion.id), 1);
    // }
    // if (this.wrongResponses.indexOf(this.currentQuestion.id) > -1) {
    //   this.wrongResponses.splice(this.wrongResponses.indexOf(this.currentQuestion.id), 1);
    // }
    // switch (confidence) {
    //   case 'confident':
    //     this.confidentResponses.push(this.currentQuestion.id);
    //     break;
    //   case 'unsure':
    //     this.unsureResponses.push(this.currentQuestion.id);
    //     break;
    //   case 'wrong':
    //     this.wrongResponses.push(this.currentQuestion.id);
    //     break;
    // }
  // }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes && changes.question && !changes.question.firstChange) {
      this.answerOptions = undefined;
      this.currentResponse = undefined;
    }
    if (changes && changes.question && changes.question.currentValue !== changes.question.previousValue) { // !changes.question.firstChange
      this.highlightingAdded = (changes.question.currentValue.question.includes('&#8203;&#8203;<span class="highlight"') ||
        (changes.question.currentValue.intro && changes.question.currentValue.intro.includes('&#8203;&#8203;<span class="highlight"')));

      this.parseAnswerOptions();
    }
  }

  // TODO: break up and simplify. Seriously...
  parseAnswerOptions() {
    // if (this.currentQuestion) {
    if (this.isSerialQuestion) {
      this.serialQuestionAnswerOptions = [];
      this.serialQuestions.forEach((serialQuestion, i) => {
        this.serialQuestionAnswerOptions[i] = [];

        if ((serialQuestion.dataType === QuestionType.FreeText || serialQuestion.dataType === QuestionType.VeryShortAnswer) &&
          this.currentSerialResponse[i] && this.currentSerialResponse[i].answerGiven && this.currentSerialResponse[i].answerGiven.length === 1) {
          this.serialFreeTextAnswers[i] = this.currentSerialResponse[i].answerGiven[0].text;

        } else if (serialQuestion.dataType === QuestionType.EvaluationRating) {
          // answer options one to five
          for (let x = 0; x < 5; x++) {
            const answerOption = new AnswerOption();
            answerOption.questionId = serialQuestion.id;
            answerOption.index = x;
            answerOption.id = x;

            this.currentSerialResponse.forEach(serialResponse => {
              if (serialResponse.answerGiven[0] && serialResponse.answerGiven[0].questionId === serialQuestion.id) {
                answerOption.selected = serialResponse.answerGiven.some(a => a.id === answerOption.id && a.selected);
              }
            });
            this.serialQuestionAnswerOptions[i].push(answerOption);
          }

          this.answerSubmitted = this.currentSerialResponse[i] && this.currentSerialResponse[i].answerGiven &&
            this.currentSerialResponse[0].answerGiven.length > 0;

        } else if (serialQuestion.answers) {
          serialQuestion.answers.forEach((answer: String) => {
            const answerOption: any = Utilities.parseAnswerOption(answer);
            answerOption.questionId = serialQuestion.id;
            this.currentSerialResponse.forEach(serialResponse => {
              if (serialResponse.answerGiven[0] && serialResponse.answerGiven[0].questionId === serialQuestion.id) {
                answerOption.selected = serialResponse.answerGiven.some(a => a.id === answerOption.id && a.selected);
              }
            });
            this.serialQuestionAnswerOptions[i].push(answerOption);

            this.answerSubmitted = this.currentSerialResponse[i] && this.currentSerialResponse[i].answerGiven &&
              this.currentSerialResponse[0].answerGiven.length > 0;
            if (!this.answerSubmitted) {
              this.serialFreeTextAnswers[i] = '';
            }
          });
        }
      });
    } else {
      if ((this.currentQuestion.dataType === QuestionType.FreeText || this.currentQuestion.dataType === QuestionType.VeryShortAnswer) &&
        this.currentResponse && this.currentResponse.answerGiven && this.currentResponse.answerGiven.length === 1) {
        this.freeTextAnswer = this.currentResponse.answerGiven[0].text;
      } else if (this.currentQuestion.dataType === QuestionType.EvaluationRating) {
        // answer options one to five
        this.answerOptions = [];
        for (let i = 0; i < 5; i++) {
          const answerOption = new AnswerOption();
          answerOption.selected = !(this.currentResponse === null || this.currentResponse === undefined) &&
            this.currentResponse.answerGiven &&
            this.currentResponse.answerGiven.some(a => a.id === answerOption.id && a.selected);

          this.answerOptions.push(answerOption);
        }

      } else if (this.currentQuestion.answers) {
        this.answerOptions = [];
        this.currentQuestion.answers.forEach((answer: String) => {
          const answerOption: AnswerOption = Utilities.parseAnswerOption(answer);

          answerOption.selected = !(this.currentResponse === null || this.currentResponse === undefined) &&
            this.currentResponse.answerGiven &&
            this.currentResponse.answerGiven.some(a => a.id === answerOption.id && a.selected);

          this.answerOptions.push(answerOption);
        });
      }

      this.answerSubmitted = this.currentResponse && this.currentResponse.answerGiven &&
        this.currentResponse.answerGiven.length > 0;
      if (!this.answerSubmitted) {
        this.freeTextAnswer = '';
      }
    }
  }

  addNote() {
    const dialogData = DialogConfig.largeDialogBaseConfig(
      {
        title: 'Notes',
        content: (this.userExam.notes) ? this.userExam.notes[this.currentQuestion.id] : '',
        actions: [ActionType.Save, ActionType.Cancel]
      });
    const dialogRef = this.dialog.open(DialogEditorComponent, dialogData);

    dialogRef.componentInstance.dialogResult
      .subscribe(result => {

        if (result === ActionType.Confirmation || result === ActionType.Save) {
          if (this.userExam.notes) {
            this.userExam.notes[this.currentQuestion.id] = dialogData.data.content;
          } else {
            this.userExam.notes = {};
            this.userExam.notes[this.currentQuestion.id] = dialogData.data.content;

          }
          this.userExamService.save(this.userExam).subscribe();

        }
        dialogRef.close();
      });
  }

  lockExam() {
    // TODO: stop clock
    // TODO: proctor code handling
    this.eventTrackingService.trackEvent(EventTypes.securityLockTriggered, {
      text: 'Exam lock trigger',
      userId: this.sessionService.loggedInUser.id,
      userExam: this.userExam.id
    });
    this.userExam.securityLock = true;
    const dialogData = DialogConfig.defaultSecurityLockDialogConfig({});
    const dialogRef = this.dialog.open(SecurityDialogComponent, dialogData);
    dialogRef.componentInstance.dialogResult
      .subscribe(result => {
        // TODO: if we get the correct code...
        dialogRef.close();
        this.removeLock();
      });
  }

  removeLock() {
    // if (this.userExam) {
    this.eventTrackingService.trackEvent(EventTypes.securityUnlocked, {
      text: 'Unlocked',
      userId: this.sessionService.loggedInUser.id,
      userExam: this.userExam.id
    });

    this.userExam.securityLock = false;
    this.notificationsService.success('Security lock removed', 'You are now free to continue your exam.');
    FullScreenUtilities.openFullScreen();
    // }
  }

  showHighlightMenu() {
    // Only if there is teext selected
    if (window.getSelection) {
      const text = window.getSelection().toString().trim();
      // console.log('****** ', this.currentQuestion.intro.includes(text));

      if (text && text.length > 3 && this.currentQuestion && this.currentQuestion.intro && this.currentQuestion.intro.includes(text)) {
        this.newIntroText = this.currentQuestion.intro.replace(text, '&#8203;&#8203;<span class="highlight" >' + text + '</span>&#8203;&#8203;');
        this.trigger.openMenu();
      }
      if (text && text.length > 3 && this.currentQuestion && this.currentQuestion.question.includes(text)) {
        this.newQuestionText = this.currentQuestion.question.replace(text, '&#8203;&#8203;<span class="highlight" >' + text + '</span>&#8203;&#8203;');
        this.trigger.openMenu();
      }
    }
  }

  highlightText() {
    // TODO: highlight serial text
    if (this.newIntroText) {
      this.currentQuestion.intro = this.newIntroText;
      this.newIntroText = '';
    }
    if (this.newQuestionText) {
      this.currentQuestion.question = this.newQuestionText;
      this.newQuestionText = '';
    }
    this.highlightingAdded = true;
  }

  showSelectedText() {
    // this is for the menu trigger. Don't remove
    console.log('*** show selected text ***');
  }

  removeHighlighting() {
    this.currentQuestion.intro = (this.currentQuestion.intro) ? this.currentQuestion.intro.replace(/&#8203;&#8203;<span class="highlight" >/g, '') : '';
    this.currentQuestion.intro = (this.currentQuestion.intro) ? this.currentQuestion.intro.replace(/<\/span>&#8203;&#8203;/g, '') : '';
    this.currentQuestion.question = (this.currentQuestion.question) ? this.currentQuestion.question.replace(/&#8203;&#8203;<span class="highlight" >/g, '') : '';
    this.currentQuestion.question = (this.currentQuestion.question) ? this.currentQuestion.question.replace(/<\/span>&#8203;&#8203;/g, '') : '';
    this.highlightingAdded = false;
  }

  responsesGivenForThisQuestion() {
    let count = 0;
    this.responses.forEach(r => {
      if (r.questionId === this.currentQuestion.id) {
        count++;
      }
    });
    return count;
  }

  getFullQuestionCount(questions) {
    let count = 0;
    questions.forEach(question => {
      if (question.serialQuestions && question.serialQuestions.length > 0) {
        count += question.serialQuestions.length;
      } else {
        count++;
      }
    });
    return count;
  }

  getLatestResponse(qId) {
    let res;
    this.responses.forEach(response => {
      if (response.questionId === qId || response.answerGiven[0] && response.answerGiven[0].questionId === qId) {

        if (res && res.dateCreated < response.dateCreated) {
          res = response;
        } else {
          res = response;
        }
      }
    });
    return (res) ? res : new Response();
  }

  setScore() {
    let correctResponses = 0;
    this.responses.forEach(response => {
      if (response.correct) {
        correctResponses++;
      }
    });
    this.userExam.score = ((correctResponses / this.totalQuestionCount) * 100);
  }

  markToRevisit() {
    this.revisitList.push(this.currentQuestion.id);
    this.eventTrackingService.trackEvent(EventTypes.markedForRevisit, {question: this.currentQuestion.id, userId: this.sessionService.loggedInUser.id, userExam: this.userExam.id});
    this.setQuestion('next');
  }

  trackCalcEvent() {
    this.eventTrackingService.trackEvent((this.showCalculator) ? EventTypes.calculatorClosed : EventTypes.calculatorOpened, {userId: this.sessionService.loggedInUser.id, userExam: this.userExam.id});
  }


  revealDiscussionCheck() {
    if (this.previewMode) {
      return true;
    } else if (!this.userExam || this.userExam.examMode || this.hideDiscussion) {
      return false;
    } else if (this.userExam.studyMode && RevealAnswerType.InStudyMode === this.userExam.revealAnswers) {
      return true;
    } else if ((this.answerSubmitted) && RevealAnswerType.AfterAny === this.userExam.revealAnswers) {
      return true;
    } else if ((this.answerSubmitted || this.response) && this.responseCorrect && RevealAnswerType.AfterRightAnswer === this.userExam.revealAnswers) {
      return true;
    } else if ((this.answerSubmitted || this.response) && !this.responseCorrect && RevealAnswerType.AfterWrongAnswer === this.userExam.revealAnswers) {
      return true;
    } else if (this.isRetakeAfterCompleted && RevealAnswerType.WhenActivityComplete === this.userExam.revealAnswers) {
      return true;
    }
    return false;
  }

  get isAnswerSelected(): boolean {
    let optionSelected = false;
    this.answerOptions.forEach(answerOption => {
      if (answerOption.selected === true) {
        optionSelected = true;
      }
    });
    return optionSelected;
  }

  isSerialQuestionCheck() {
    console.log('********** isSerialQuestion');
    if (!this.currentQuestion) {
      return false;
    } else {
      return (this.currentQuestion.serialQuestions && this.currentQuestion.serialQuestions.length > 0 || this.currentQuestion.type === 'serial');
    }
  }

  allQuestionsAnsweredCorrectlyCheck() {
    console.log('********** allQuestionsAnsweredCorrectly', );
    let idx = 0;
    const correctArray = [];
    while (idx < this.questions.length) {
      this.responses.forEach(res => {
        if (res.correct && correctArray.indexOf(res.questionId) < 0) {
          correctArray.push(res.questionId);
        }
      });
      idx++;
    }
    return (this.questions.length <= correctArray.length);
  }
}

