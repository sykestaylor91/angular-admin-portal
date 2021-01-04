import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
  name: 'timer'
})
export class TimerPipe implements PipeTransform {
  private seconds: any = 0;
  private minutes: any = 0;
  private hours: any = 0;

  transform(value: number) {
    if (isNaN(value)) {
      value = 0;
    }

    if (value < 60) {
      this.seconds = value;
    } else if (value >= 60 && value <= 3600) {
      this.minutes = Math.floor(value / 60);
      this.seconds = value % 60;
    } else {
      this.hours = Math.floor(value / 3600);
      this.minutes = Math.floor((value % 3600) / 60);
      this.seconds = Math.floor((value % 3600) % 60);
    }
    this.seconds = this.seconds < 10 ? '0' + this.seconds : this.seconds;
    if (this.minutes) {
      this.minutes = this.minutes < 10 ? '0' + this.minutes : this.minutes;
    }
    if (this.hours) {
      this.hours = this.hours < 10 ? '0' + this.hours : this.hours;
    }

    return this.hours + ':' + this.minutes + ':' + this.seconds;
  }


}
