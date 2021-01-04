import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, Resolve, RouterStateSnapshot} from '@angular/router';
import {Observable, zip} from 'rxjs';
import {map} from 'rxjs/internal/operators';
import {UserExamService} from '../../shared/services/user-exam.service';
import {Location} from '@angular/common';
import {NotificationsService} from 'angular2-notifications';
import {QuestionService} from '../../shared/services/question.service';
import {Question, ResolvedQuestionContent} from '../../shared/models/question';
import {ExamService} from '../../shared/services/exam.service';
import {Exam} from '../../shared/models/exam';
import {UserExam} from '../../shared/models/user-exam';

@Injectable()
export class QuestionViewResolverPreviewService implements Resolve<ResolvedQuestionContent> {
  constructor(private location: Location
    , private notificationsService: NotificationsService
    , private examService: ExamService
    , private userExamService: UserExamService
    , private questionsService: QuestionService
  ) {
  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot):
    Observable<ResolvedQuestionContent> | Promise<ResolvedQuestionContent> | ResolvedQuestionContent {
    const examId: string = route.params['examId'];
    const questionId: string = route.params['questionId'];
    if (!examId && !questionId) {
      this.notificationsService.alert('You must supply a valid activity or question id, navigating you back.');
      this.location.back();
      return null;
    }

    if (examId) {
      const examObs = this.examService.findById(examId);
      const questionsObs = this.questionsService.queryByExam(examId);
      const result: Observable<[Exam, Question[]]> = zip(examObs, questionsObs);
      return result.pipe(map(value => {
          const exam = value[0];
          const questions = value[1];

          if (!exam || !exam.id) {
            this.notificationsService.alert('This exam does not exist, navigating you back.');
            this.location.back();
            return null;
          }

          const userExam: UserExam = this.userExamService.map(exam);
          delete userExam.examId;

          return {
            userExam
            , questions
            , previewMode: true
            , responses: []
          };
        })
      );
    } else if (questionId) {
      // this.notificationsService.alert('You must supply a valid question. Navigating you back.');
      // this.location.back();
      // return null;


      // const examObs = this.examService.findById(examId);
      const questionsObs = this.questionsService.findById(questionId);
      const result: Observable<Question[]> = zip(questionsObs);
      return result.pipe(map(value => {
          const questions = value;

          if (!questions[0] || !questions[0].id) {
            this.notificationsService.alert('This question does not exist. Navigating you back.');
            this.location.back();
            return null;
          }
        const  userExam: UserExam = new UserExam();
        userExam.id = 'preview';
        userExam.examMode = false;
        userExam.studyMode = false;
        userExam.questions = [questions[0].id];

          // const userExam: UserExam = this.userExamService.map(exam);
         // delete userExam.examId;

          return {
            userExam
            , questions
            , previewMode: true
            , responses: []
          };
        })
      );

    }

  }
}
