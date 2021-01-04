import {Injectable} from '@angular/core';
import {EvaluationService} from '../../shared/services/evaluation.service';
import {SessionService} from '../../shared/services/session.service';
import {EvaluationResponseService} from '../../shared/services/evaluation-response.service';
import {UserEvaluationService} from '../../shared/services/user-evaluation.service';
import {UserEvaluation} from '../../shared/models/user-evaluation';
import {EvaluationResponse} from '../../shared/models/evaluation-response';

@Injectable()
export class UserEvaluationExamService {
  responses: EvaluationResponse[] = [];

  constructor(private evaluationService: EvaluationService,
              private sessionService: SessionService,
              private evaluationResponseService: EvaluationResponseService,
              private userEvaluationService: UserEvaluationService) {
  }

  saveEvaluation(claimedCredit: number, selectedExam: any): Promise<UserEvaluation> {
    return new Promise<UserEvaluation>(resolve => {
      const that = this;

      // saves evaluation to backend
      const newUserEvaluation: UserEvaluation  = new UserEvaluation();
      newUserEvaluation.userId = this.sessionService.loggedInUser.id;
      newUserEvaluation.examId = selectedExam.id;
      newUserEvaluation.status = 'closed';
      newUserEvaluation.claimedCredit = claimedCredit;


        this.userEvaluationService.save(newUserEvaluation).subscribe((evaluationData: UserEvaluation) => {

          if (this.responses && this.responses.length > 0) {
            this.responses.forEach((response, indx) => {
              response.session = evaluationData.id;
              that.evaluationResponseService.save(response).subscribe(responseData => {
                if (indx === this.responses.length - 1) {
                  resolve(evaluationData);
                }
              });
            });
          } else {
            resolve(evaluationData);
          }
        });
    });
  }

  createSingleChoiceResponse(question, response) {
    let questionResponseExists = false;
    this.responses.forEach(function (data) {
      if (data.questionId === question.id) {
        questionResponseExists = true;
        data.answerGiven = [response];
      }
    });
    if (!questionResponseExists) {
      const newEvaluationResponse = new EvaluationResponse();
      newEvaluationResponse.answerGiven = [response];
      newEvaluationResponse.questionId = question.id;
      newEvaluationResponse.userId = this.sessionService.loggedInUser.id;
      this.responses.push(newEvaluationResponse);
    }
  }

  createEvaluationSelectResponse(question, response) {
    let questionResponseExists = false;
    this.responses.forEach(function (data) {
      if (data.questionId === question.id) {
        questionResponseExists = true;
        data.answerGiven = [response];
      }
    });
    if (!questionResponseExists) {
      const newEvaluationResponse = new EvaluationResponse();
      newEvaluationResponse.answerGiven = [response];
      newEvaluationResponse.questionId = question.id;
      newEvaluationResponse.userId = this.sessionService.loggedInUser.id;
      this.responses.push(newEvaluationResponse);
    }
  }

  createMultipleChoiceResponse(response, question) {
    let questionResponseExists = false;
    this.responses.forEach(function (data) {
      if (data.questionId === question.id) {
        questionResponseExists = true;
        if (data.answerGiven.indexOf(response) > -1) {
          data.answerGiven.splice(data.answerGiven.indexOf(response), 1);
        } else {
          data.answerGiven.push(response);
        }
      }
    });
    if (!questionResponseExists) {
      const newEvaluationResponse = new EvaluationResponse();
      newEvaluationResponse.answerGiven = [response];
      newEvaluationResponse.questionId = question.id;
      newEvaluationResponse.userId = this.sessionService.loggedInUser.id;
      this.responses.push(newEvaluationResponse);
    }
  }

  createFreeTextResponse(text, question) {
  }

}
