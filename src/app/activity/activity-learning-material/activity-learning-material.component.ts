import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {LearningMaterial} from '../../shared/models/learning-material';

@Component({
  selector: 'app-activity-learning-material',
  templateUrl: 'activity-learning-material.component.html',
  styleUrls: ['activity-learning-material.component.scss'],
})
export class ActivityLearningMaterialComponent implements OnInit {
  @Input() learningMaterial: LearningMaterial[];
  @Output() close = new EventEmitter();

  disclosures: any = [];
  selectedIndex: number = 0;

  constructor() {
  }

  ngOnInit() {
  }

  navigateTab(tab) {
    this.selectedIndex = tab;
  }

  selectedIndexChange(val: number) {
    this.selectedIndex = val;
  }

  skipLearningMaterial() {
    this.close.emit();
  }

  isString(obj) {
    return typeof obj === 'string';
  }
}
