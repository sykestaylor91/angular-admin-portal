import {Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';

@Component({
  selector: 'app-course-timer',
  templateUrl: 'course-timer.component.html',
})
export class CourseTimerComponent implements OnInit, OnDestroy {
  @Input() startTime: number = 0;
  @Input() countDown?: boolean = false;
  @Input() allQuestionsAnswered: boolean = false;
  @Output() timeUp = new EventEmitter();

  elapsedSeconds: number = 0;

  private timerRef: any;

  constructor() {
  }

  ngOnInit() {
    this.elapsedSeconds = this.startTime; // get from saved userExam
    this.startTimer();
  }

  ngOnDestroy() {
    clearInterval(this.timerRef);
    this.timerRef = undefined;
  }

  startTimer() {
    if (!this.allQuestionsAnswered && !this.timerRef) {
      if (this.countDown) {
        this.timerRef = setInterval(() => {
          if (this.allQuestionsAnswered) {
            clearInterval(this.timerRef);
          }
          if (this.elapsedSeconds <= 0) {
            this.timeUp.emit();
          } else {
            this.elapsedSeconds -= 1;
          }
        }, 1000);
      } else {
        this.timerRef = setInterval(() => {
          if (this.allQuestionsAnswered) {
            clearInterval(this.timerRef);
          }
          this.elapsedSeconds += 1;
        }, 1000);
      }
    }
  }

  pauseTime(): number {
    clearInterval(this.timerRef);
    this.timerRef = undefined;
    return this.elapsedSeconds;
  }

  resumeTime() {
    this.startTimer();
  }
}
