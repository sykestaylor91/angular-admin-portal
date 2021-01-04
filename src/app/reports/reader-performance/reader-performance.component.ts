import {Component, ViewChild, OnDestroy} from '@angular/core';
import {ReaderPerformanceService} from './reader-performance.service';
import {ReaderPerformanceResponseDetailsComponent} from './response-details/response-details.component';
import { ChosenActivityService } from './../../shared/services/chosen-activity.service';

@Component({
  selector: 'app-reader-performance',
  templateUrl: 'reader-performance.component.html'
})
export class ReaderPerformanceComponent implements OnDestroy {
  title: string = 'Reader Metrics';

  /* TODO: consider restructuring the component/child component to better leverage the shared service
   * to simplify testing
   */
   // TODO: use the same tables and filters as everywhere else

  @ViewChild(ReaderPerformanceResponseDetailsComponent) childDetailsComponent: ReaderPerformanceResponseDetailsComponent;

  constructor(private readerPerformanceService: ReaderPerformanceService,  private chosenActivityService: ChosenActivityService) {
  }

  ngOnDestroy() {
    this.readerPerformanceService.selectedUser = null;
    this.chosenActivityService.changeMessage('');
  }

  onSearchDestroy(query) {
    this.childDetailsComponent.destroySelectedExam();
  }

  setResponses(event) {
    this.childDetailsComponent.getSelectedExam();
  }
}
