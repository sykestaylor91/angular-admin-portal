import {Directive, ElementRef, Input, OnInit} from '@angular/core';
import {NgModel} from '@angular/forms';
import {fromEvent} from 'rxjs';
import {debounceTime, map} from 'rxjs/operators';

@Directive({
  selector: '[appDebounce]'
})
export class DebounceDirective implements OnInit {
  /* tslint:disable:no-input-rename */
  @Input('appDebounce') debounceTime: number = 300;

  /* tslint:enable:no-input-rename */

  constructor(private elementRef: ElementRef, private model: NgModel) {
  }

  ngOnInit(): void {
    const eventStream = fromEvent(this.elementRef.nativeElement, 'keyup')
      .pipe(
        map(() => {
          return this.model.value;
        }),
        debounceTime(this.debounceTime)
      );

    this.model.viewToModelUpdate = () => {
    };

    eventStream.subscribe(input => {
      this.model.viewModel = input;
      this.model.update.emit(input);
    });
  }
}
