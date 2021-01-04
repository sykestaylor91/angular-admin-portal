import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-notfound404',
  templateUrl: './notfound404.component.html'
})
export class Notfound404Component implements OnInit {
  title = 'Sorry!';
  description = 'The page you we looking for could not be found!';

  constructor() { }

  ngOnInit() {
  }

}
