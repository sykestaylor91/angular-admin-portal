import { DebounceDirective } from './debounce.directive';
import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {Component} from '@angular/core';
import {NgModel} from '@angular/forms';

@Component({
  template: `<input type="text" appDebounce="300">`
})
class TestDebounceComponent {
}

describe('DebounceDirective', () => {
  let component: TestDebounceComponent;
  let fixture: ComponentFixture<TestDebounceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TestDebounceComponent, DebounceDirective],
      providers: [NgModel]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TestDebounceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create an instance', () => {
    expect(component).toBeDefined();
  });
});
