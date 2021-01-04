import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {HelpService} from '../services/help.service';

@Component({
  selector: 'app-page-help',
  templateUrl: 'page-help.component.html'
})
export class PageHelpComponent implements OnInit {
  constructor(private router: Router, public helpService: HelpService) {
  }

  ngOnInit() {

  }

}
