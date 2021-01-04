import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {Router} from '@angular/router';
import {FormControl} from '@angular/forms';
import {RoutesRp} from '../shared/models/routes-rp';
import {StationService} from '../shared/services/station.service';
import {AnswerFormatService} from '../shared/services/answer-format.service';
import {NotificationsService} from 'angular2-notifications';
import {Station} from '../shared/models/station';
import {Item} from '../shared/models/item';

@Component({
  selector: 'app-clinical-exam',
  templateUrl: './clinical-exam.component.html',
  styleUrls: ['./clinical-exam.component.scss']
})
export class ClinicalExamComponent implements OnInit {

  showLoading: boolean = false;
  selectedTab: number = 0;
  id: string;
  myControl: FormControl;
  station: Station;
  items: Item[];
  answerFormatArray: any = {};
  private sub: any;

  constructor(private stationService: StationService,
              private answerFormatService: AnswerFormatService,
              private notificationsService: NotificationsService,
              private route: ActivatedRoute, private router: Router) {


  }

  ngOnInit() {
      this.answerFormatService.query().subscribe(answerFormats => {
          if (answerFormats && answerFormats.length > 0) {
              answerFormats.forEach((format) => {
                  this.answerFormatArray[format.id] = format;
              });
          }
      });
      this.sub = this.route.params.subscribe(params => {
          this.id = params['id'];
          this.stationService.findById(this.id).subscribe(station => {
              if (station) {
                  this.station = station;
              }
          });
      });
      this.loadForm();
  }

  loadForm() {
    this.myControl = new FormControl('', []);
  }

  submitForm() {
      if (!this.myControl.value) {
          this.notificationsService.error('Feedback is required.');
      } else {
          this.notificationsService.success('Demo Complete!');
          this.router.navigate([RoutesRp.Home]);
      }
  }

  onNavigateTab(tab: number) {
    this.selectedTab = tab;
  }
}
