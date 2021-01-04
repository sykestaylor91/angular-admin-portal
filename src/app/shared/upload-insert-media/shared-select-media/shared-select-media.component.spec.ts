import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {RouterTestingModule} from '@angular/router/testing';
import {SharedSelectMediaComponent} from './shared-select-media.component';
import {MediaService} from '../../services/media.service';
import {instance, mock, when} from 'ts-mockito';
import {of} from 'rxjs';

describe('SharedSelectMediaComponent', () => {
  let component: SharedSelectMediaComponent;
  let fixture: ComponentFixture<SharedSelectMediaComponent>;
  const mediaMock = mock(MediaService);

  beforeEach(async(() => {
    when(mediaMock.query()).thenReturn(of([]));
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule
      ],
      declarations: [SharedSelectMediaComponent],
      providers: [
        {provide: MediaService, useValue: instance(mediaMock)}
      ],
      schemas: []
    });
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SharedSelectMediaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
