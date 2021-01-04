import {Injectable} from '@angular/core';
import {ExamService} from './exam.service';
import {UserExamService} from './user-exam.service';
import {QuestionService} from './question.service';
import {ResponseService} from './response.service';
import {SessionService} from './session.service';
import {Router} from '@angular/router';
import {EvaluationService} from './evaluation.service';
import {Location} from '@angular/common';
import {Exam} from '../models/exam';
import {Question} from '../models/question';
import {UserExam} from '../models/user-exam';
import {Evaluation} from '../models/evaluation';
import {Response} from '../models/response';
import {NotificationsService} from 'angular2-notifications';
import {UserEvaluation} from '../models/user-evaluation';

import {Subject} from 'rxjs';
import {LoggingService} from './logging.service';
import {UserExamStatus} from '../models/user-exam-status';
import {RoutesRp} from '../models/routes-rp';
import {AnswerOption} from '../models/answer-option';

@Injectable()
export class UserCourseService {
  // TODO: Another God service to eventually remove!

  public originExam: Exam;
  public originQuestion: Question;
  public previewQuestionMode: boolean = false;
  public selectedExam: Exam;
  public currentUserExam: UserExam;
  public currentQuestion: Question;
  public currentUserExamResponses: Response[] = [];
  public currentQuestionNumber: number = 1;
  public currentQuestionAnswers: any = [];
  public currentQuestionResponse: any = [];
  public courseAnswersCorrect: number = 0;
  public answerSubmitted: boolean = false;
  public time: number = 0;
  public courseComplete: boolean = false;
  public incorrectOrSkippedQuestions: any = [];
  public freeTextAnswer: string = '';
  public backtrackResponse: any;
  public wrongResponses: any = [];
  public unsureResponses: any = [];
  public confidentResponses: any = [];
  public learningMaterialActive: boolean = false;
  public postCourseEvaluation: Evaluation;
  public showRateCourse: boolean = false;
  public showCertificate: boolean = false;
  /* - - - - Configuration Options - - - - */

  public postCourseEvaluationMode: boolean = false;
  public postCourseCompletedUserEvaluation: UserEvaluation;
  public normalMode: boolean = true;
  public previewMode: boolean = false;
  public previewQuestion: boolean = false;
  public studyMode: boolean = false;
  public countdownMode: boolean = false;
  public countDownFrom: number = 0;
  public retakeMode: boolean = false;
  public resumeMode: boolean = false;
  public tryMissedOrIncorrectAnswersMode: boolean = false;
  public courseMapMode: boolean = false;
  public hideDiscussion: boolean = false;

  /* - - - End of Configuration Options - - - */

  invokeEvent: Subject<any> = new Subject(); // Question set event

  constructor(private examService: ExamService,
              private userExamService: UserExamService,
              private questionService: QuestionService,
              private sessionService: SessionService,
              private notificationsService: NotificationsService,
              private responseService: ResponseService,
              private router: Router,
              private evaluationService: EvaluationService,
              private location: Location) {
  }

  startCourse(exam) {
    this.setConfigurables();
    this.prepareTimer();
    this.configureLearningMaterial();
    if (!this.previewMode && !this.resumeMode && !this.tryMissedOrIncorrectAnswersMode) {
      this.startNew(exam);
    }
    if (this.resumeMode && !this.tryMissedOrIncorrectAnswersMode && !this.previewMode) {
      this.resumeCourse();
    }
    this.router.navigate([RoutesRp.ActivityIntro]);
  }

  prepareTimer() {
    if (this.currentUserExam.examMode) {
      // Count down
      this.countdownMode = true;
      if (!this.selectedExam.countDownFrom) {
        this.countDownFrom = 3599; // default duration 1 hour
      } else {
        this.countDownFrom = this.selectedExam.countDownFrom;
      }
      if (this.resumeMode) {
        // Count down resume
        this.time = this.countDownFrom - this.time;
      }
    } else {
      // Count up
      this.countdownMode = false;
      if (this.resumeMode) {
        // Count up resume
        this.time = this.currentUserExam.elapsedSeconds;
      }
    }
  }

  setConfigurables() {
    this.courseMapMode = this.selectedExam.courseMap;
    this.hideDiscussion = this.selectedExam.hideDiscussion;
  }

  configureLearningMaterial() {
    this.learningMaterialActive = (this.selectedExam.learningMaterial && !this.tryMissedOrIncorrectAnswersMode && !this.previewQuestion);
    if (this.resumeMode) {
      this.learningMaterialActive = false;
    }
  }

  startNew(exam) {
    this.currentUserExam = this.createNewUserExam(exam);
    this.userExamService.save(this.createNewUserExam(exam)).subscribe(newUserExam => {
      this.currentUserExam = newUserExam;
      this.setActiveQuestion(this.selectedExam.questions[0]);
    });
  }

  resumeCourse() {
    if (this.currentUserExam && this.selectedExam) {
      this.getResponses(this.currentUserExam, this.selectedExam);
    } else {
      LoggingService.warn('Error resuming activity. Failed to set the session.');
    }
  }

  startCourseStudyMode(exam) {
    this.studyMode = true;
    this.courseComplete = false;
    this.currentQuestionNumber = 1;
    this.setActiveQuestion(this.selectedExam.questions[0]);
    this.hideDiscussion = false;
    this.courseMapMode = false;
    this.router.navigate([RoutesRp.ActivityIntro, this.selectedExam.id]);
  }

  startExamMode() {
    this.courseMapMode = true;
    this.countdownMode = true;
    // TODO Add allowedTime property to exams then uncomment
    // this.countDownFrom = exam.allowedTime;
    this.countDownFrom = 5000;
    this.startCourse(this.selectedExam);
  }

  skipLearningMaterial() {
    this.learningMaterialActive = false;
    if (this.selectedExam && this.selectedExam.questions && this.selectedExam.questions.length > 0) {
      this.setActiveQuestion(this.selectedExam.questions[0]);
    } else {
      // TODO: we shouldn't even be here if there are no questions... We should not be able to publish activities without questions
      this.notificationsService.warn('No Questions available', 'Your activity has no questions. Please add some questions and try again.');
    }
  }

  createNewUserExam(exam) {
    const userExam = new UserExam();
    userExam.userId = this.sessionService.loggedInUser.id;
    userExam.examId = exam.id;
    userExam.title = exam.title;
    userExam.certificate = exam.certificate;
    userExam.questions = exam.questions;
    userExam.status = UserExamStatus.Open;
    return userExam;
  }

  displayPreCourse() {
    throw new Error('Not implemented');
  }

  setActiveQuestion(questionId) {
    this.questionService.findById(questionId).subscribe(question => {
      this.currentQuestion = question;
      if (this.courseMapMode) {
        this.handleCourseMapNavigation(question);
      }
      this.invokeEvent.next({});
    });
  }

  handleCourseMapNavigation(question) {
    // TODO Need to make this correctly handle multiple choice and free-text responses as well
    // TODO Also need to make course map mode be false by default and correctly set without unsetting when needed
    const that = this;
    let answered = false;
    this.currentUserExamResponses.forEach(function (response: Response) {
      if (response.questionId === question.id) {
        answered = true;
        that.backtrackResponse = response;
        that.answerSubmitted = true;
        that.currentQuestionAnswers = response.answerGiven;
        if (question.dataType === 'singleChoice') {
          that.setSingleChoiceResponse(response.answerGiven[0]);
        } else if (question.dataType === 'multipleChoice') {
          that.setMultipleChoiceResponse(response.answerGiven);
        } else if (question.dataType === 'freeText') {
          that.setFreeTextResponse(response.answerGiven[0]);
        }
      }
    });
    if (!answered) {
      this.answerSubmitted = false;
      this.currentQuestionAnswers = null;
      this.backtrackResponse = null;
      this.currentQuestionResponse = [];
      this.setSingleChoiceResponse(null);
    }
    this.updateQuestionNumber();
  }

  updateQuestionNumber() {
    const that = this;
    let i = 0;
    let questionNumber;
    this.selectedExam.questions.forEach(function (questionId) {
      if (that.currentQuestion && that.currentQuestion.id === questionId) {
        questionNumber = i;
      }
      i++;
    });
    this.currentQuestionNumber = questionNumber + 1;
  }

  navigate() {
    if (this.moreQuestions()) {
      this.nextQuestion();
    } else {
      this.courseComplete = true;
    }
  }

  nextQuestion() {
    const nextQuestion = this.currentQuestionNumber;
    this.resetQuestion();
    if (this.tryMissedOrIncorrectAnswersMode) {
      const newQuestion = this.getNextIncorrectOrSkippedAnswer();
      this.setActiveQuestion(newQuestion);
      this.currentQuestionNumber = this.selectedExam.questions.indexOf(this.incorrectOrSkippedQuestions[0]) + 1;
    } else {
      this.resetQuestion();
      this.setActiveQuestion(this.selectedExam.questions[nextQuestion]);
      this.currentQuestionNumber++;
    }
  }

  moreQuestions() {
    if (this.tryMissedOrIncorrectAnswersMode) {
      if (this.incorrectOrSkippedQuestions && this.incorrectOrSkippedQuestions.length > 1) {
        return true;
      }
      return false;
    }
    return (this.currentQuestionNumber < this.selectedExam.questions.length);
  }

  pauseCourse() {
    const userExam = this.constructUserExam();
    userExam.status = UserExamStatus.Paused;
    this.userExamService.save(userExam).subscribe(newUserExam => {
      this.router.navigate([RoutesRp.Home]);
      this.resetUserCourse();
      this.notificationsService.info('Activity Paused', 'Your activity has been paused. It can be resumed at any time.');
    });
  }

  abandonCourse(userExam: UserExam) {
    userExam.status = UserExamStatus.Abandoned;
    this.userExamService.save(userExam).subscribe(newUserExam => {
      this.notificationsService.success('Activity Abandoned', 'Activity successfully abandoned');
    });
  }

  resetUserCourse() {
    this.selectedExam = null;
    this.currentUserExam = null;
    this.currentQuestionNumber = 1;
    this.currentQuestion = null;
    this.normalMode = true;
    this.studyMode = false;
    this.previewMode = false;
    this.retakeMode = false;
    this.answerSubmitted = false;
    this.courseAnswersCorrect = 0;
    this.currentQuestionResponse = [];
    this.currentQuestionAnswers = [];
    this.courseComplete = false;
    this.tryMissedOrIncorrectAnswersMode = false;
    this.time = 0;
    this.currentUserExamResponses = [];
    this.countDownFrom = 0;
    this.countdownMode = false;
    this.courseMapMode = false;
    this.backtrackResponse = null;
    this.postCourseEvaluationMode = false;
    this.wrongResponses = [];
    this.unsureResponses = [];
    this.confidentResponses = [];
    this.showRateCourse = false;
    this.hideDiscussion = false;
    this.previewQuestion = false;
    this.originExam = null;
    this.originQuestion = null;
    this.previewQuestionMode = false;
  }

  setSingleChoiceResponse(response) {
    this.currentQuestionResponse = [];
    this.currentQuestionResponse.push(response);
  }

  setMultipleChoiceResponse(response) {
    if (this.currentQuestionResponse[0] === null) {
      this.currentQuestionResponse = [];
    }
    let removed = false;
    for (let i = this.currentQuestionResponse.length - 1; i >= 0; i--) {
      if (this.currentQuestionResponse[i] === response) {
        this.currentQuestionResponse.splice(i, 1);
        removed = true;
      }
    }
    if (!removed) {
      this.currentQuestionResponse.push(response);
    }
  }

  setFreeTextResponse(response) {
    this.freeTextAnswer = response;
    this.currentQuestionResponse.push(response);
  }

  submit() {
    // this.answerSubmitted = true;
    //
    // const newResponse = this.constructResponse();
    //
    // this.responseService.save(newResponse).subscribe(savedResponse => {
    //   this.currentUserExamResponses.push(savedResponse);
    // });
  }

  setModesToFalse() {
    this.normalMode = false;
    this.studyMode = false;
    this.previewMode = false;
    this.retakeMode = false;
    this.resumeMode = false;
  }

  setMode(mode) {
    this.setModesToFalse();
    switch (mode) {
      case 'study':
        this.studyMode = true;
        break;
      case 'preview':
        this.previewMode = true;
        break;
      case 'retake':
        this.retakeMode = true;
        break;
      case 'resume':
        this.resumeMode = true;
        break;
      case 'normal':
        this.normalMode = true;
        break;
    }
  }

  constructResponse() {
    const response = new Response();
    if (this.currentQuestion && this.currentQuestion.id) {
      response.questionId = this.currentQuestion.id;
    }
    if (this.currentQuestion.dataType === 'freeText') {
      const freeTextChoice = new AnswerOption();
      freeTextChoice.text = this.freeTextAnswer;
      freeTextChoice.correct = true;
      freeTextChoice.selected = true;
      response.answerGiven.push(freeTextChoice);
    } else {
      response.answerGiven = this.currentQuestionResponse;
    }
    response.userId = this.sessionService.loggedInUser.id;
    response.claimed = false;
    response.session = this.currentUserExam.id || null;
    response.firstResponse = true;
    if (this.responseCorrect()) {
      response.correct = true;
      this.courseAnswersCorrect++;
    } else {
      response.correct = false;
    }
    return response;
  }

  responseCorrect() {
    switch (this.currentQuestion.dataType) {
      case 'freeText':
        return true;
      case 'singleChoice':
        // TODO:discover how this fails to be set and crashes app
        if (this.currentQuestionResponse[0]) {
          return this.currentQuestionResponse[0].correct;
        } else {
          return false;
        }
      case 'multipleChoice':
        return this.allResponsesCorrect() && this.allCorrectSelected();
    }
    return false;
  }

  allCorrectSelected() {
    let correctAnswerCount = 0;
    let correctSelectedCount = 0;
    // used to determine that no correct answers were left unselected when submit was pressed
    this.currentQuestionAnswers.forEach(function (answer) {
      if (answer.correct) {
        correctAnswerCount++;
      }
    });
    this.currentQuestionResponse.forEach(function (response) {
      if (response.correct) {
        correctSelectedCount++;
      }
    });
    return correctAnswerCount === correctSelectedCount;
  }

  allResponsesCorrect() {
    let correct = true;
    this.currentQuestionResponse.forEach(function (response) {
      if (!response.correct) {
        correct = false;
      }
    });
    // used to ensure all responses submitted are correct
    return correct;
  }

  resetQuestion() {
    this.currentQuestionResponse = [];
      // this.freeTextAnswer = '';
      this.answerSubmitted = false;

  }

  selectedAnswer(response, selectedAnswers) {
    let match = false;
    selectedAnswers.forEach(function (answer) {
      if (answer && response && answer.id === response.id) {
        match = true;
      }
    });
    return match;
  }

  constructUserExam() {
    const newUserExam = this.currentUserExam || new UserExam;
    if (this.countdownMode) {
      newUserExam.elapsedSeconds = this.countDownFrom - this.time;
    } else {
      newUserExam.elapsedSeconds = this.time;
    }
    newUserExam.score = this.courseAnswersCorrect;
    return newUserExam;
  }

  submitUserExam(followOn?) {
    const date = new Date();
    // TODO: why is this constructed when we submit? It should be an integral part of the user-course.service
    const userExam = this.constructUserExam();
    userExam.status = UserExamStatus.Completed;
    userExam.dateCompleted = date;

    this.userExamService.save(userExam).subscribe(newUserExam => {
      if (followOn) {
        this.startFollowOnActivity();
      } else {
        this.notificationsService.success('Activity Complete', 'Your activity has been submitted');
        this.endCourse();
      }
    });
  }

  // TODO Implement reverse timer mode
  // TODO Fix timer - make sure it works on dev.nowce
  getResponses(userExam, course) {
    const that = this;
    const userExamResponses = [];
    this.examService.findById(userExam.examId).subscribe(exam => {
      let i = 0;
      exam.questions.forEach(function (question) {
        that.responseService.findByQuestionId(question).subscribe(responses => {
          i++;
          let int = 0;
          responses.forEach(function (response) {
            int++;
            if (userExam && response.session === userExam.id) {
              userExamResponses.push(response);
            }
            if (i === exam.questions.length && int === responses.length) {
              that.continuePausedCourse(userExamResponses, userExam, course);
            }
          });
        });
      });
    });
  }

  continuePausedCourse(responses, userExam, course) {

    this.currentUserExamResponses = responses;
    responses.forEach( response => {
      if (response.correct) {
        this.courseAnswersCorrect++;
      }
    });
    this.currentUserExam = userExam;
    this.selectedExam = course;
    this.setMode('resume');
    this.tryMissedOrIncorrectAnswers();
    this.populateIncorrectOrSkipped();
    this.setActiveQuestion(this.incorrectOrSkippedQuestions[0]);
    this.currentQuestionNumber = this.selectedExam.questions.indexOf(this.incorrectOrSkippedQuestions[0]) + 1;
    this.router.navigate([RoutesRp.ActivityIntro, this.selectedExam.id]);
  }

  tryMissedOrIncorrectAnswers() {
    this.tryMissedOrIncorrectAnswersMode = true;
      this.courseComplete = false;
      this.answerSubmitted = false;
      this.populateIncorrectOrSkipped();
    this.setActiveQuestion(this.incorrectOrSkippedQuestions[0]);
    this.currentQuestionNumber = this.selectedExam.questions.indexOf(this.incorrectOrSkippedQuestions[0]) + 1;
    // this.startCourse(this.selectedExam);
  }

  populateIncorrectOrSkipped() {
    const that = this;
    this.incorrectOrSkippedQuestions = [];
    let responseNumber = 0;
    let questionNumber = 0;
    this.selectedExam.questions.forEach(function (question) {
      if (that.currentUserExamResponses[responseNumber] && that.currentUserExamResponses[responseNumber].questionId === question) {
        if (that.currentUserExamResponses[responseNumber].correct) {
          that.incorrectOrSkippedQuestions.push(question);
        }
        responseNumber++;
      } else {
        that.incorrectOrSkippedQuestions.push(question);
      }
      questionNumber++;
    });
  }

  getNextIncorrectOrSkippedAnswer() {
    this.incorrectOrSkippedQuestions.splice(0, 1);
    return this.incorrectOrSkippedQuestions[0];
  }

  clone(obj) {
    if (null == obj || 'object' !== typeof obj) {
      return obj;
    }
    const copy = obj.constructor();
    for (const attr in obj) {
      if (obj.hasOwnProperty(attr)) {
        copy[attr] = obj[attr];
      }
    }
    return copy;
  }

  markAnswer(confidence) {
    // TODO Figure out how to assign this confidence level to each question
    if (this.confidentResponses.indexOf(this.currentQuestion.id) > -1) {
      this.confidentResponses.splice(this.confidentResponses.indexOf(this.currentQuestion.id), 1);
    }
    if (this.unsureResponses.indexOf(this.currentQuestion.id) > -1) {
      this.unsureResponses.splice(this.unsureResponses.indexOf(this.currentQuestion.id), 1);
    }
    if (this.wrongResponses.indexOf(this.currentQuestion.id) > -1) {
      this.wrongResponses.splice(this.wrongResponses.indexOf(this.currentQuestion.id), 1);
    }
    switch (confidence) {
      case 'confident':
        this.confidentResponses.push(this.currentQuestion.id);
        break;
      case 'unsure':
        this.unsureResponses.push(this.currentQuestion.id);
        break;
      case 'wrong':
        this.wrongResponses.push(this.currentQuestion.id);
        break;
    }
  }

  endCourse() {
    if (this.selectedExam.postActivityEvaluation) {
      this.beginPostCourse(this.selectedExam.postActivityEvaluation);
    } else {
      this.resetUserCourse();
      this.router.navigate([RoutesRp.Home]);
    }
  }

  beginPostCourse(postCourse) {
    this.evaluationService.findById(postCourse).subscribe(evaluationData => {
      this.courseComplete = false;
      this.postCourseEvaluationMode = true;
      this.postCourseEvaluation = evaluationData;
    });
  }

  endPreview() {
    if (this.originExam) {
      this.selectedExam = this.originExam;
    } else if (this.originQuestion) {
      this.questionService.selectedQuestion = this.originQuestion;
    }
    this.location.back();
  }

  saveThenStartFollowOn() {
    this.submitUserExam(true);
  }

  startFollowOnActivity() {
    const mode = this.previewMode;
    if (this.selectedExam.followOnActivity) {
      this.examService.findById(this.selectedExam.followOnActivity).subscribe(data => {
        this.resetUserCourse();
        this.selectedExam = data;
        this.previewMode = mode;
        this.startCourse(data);
      });
    }
  }

}
