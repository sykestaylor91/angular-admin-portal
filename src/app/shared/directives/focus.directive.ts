import {AfterViewInit, Directive, ElementRef, Input, OnInit} from '@angular/core';

@Directive({
  selector: '[appFocus]'
})
export class FocusDirective implements OnInit, AfterViewInit {
  /* tslint:disable:no-input-rename */
  @Input('appFocus') isFocused: boolean;
  /* tslint:enable:no-input-rename */

  constructor(private hostElement: ElementRef) {
  }

  ngOnInit() {
  }

  ngAfterViewInit(): void {
    if (this.isFocused) {
      const nativeElement = this.hostElement.nativeElement;
      const input = nativeElement.querySelector('input');
      let item;
      if (input) {
        item = input;
      } else {
        item = nativeElement;
      }
      setTimeout(() => {
        item.focus();
      });
    }
  }
}
