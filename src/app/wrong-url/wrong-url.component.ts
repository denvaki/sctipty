import { Component } from '@angular/core';

@Component({
  selector: 'app-wrong-url',
  templateUrl: './wrong-url.component.html',
  styleUrls: ['./wrong-url.component.css']
})
export class WrongUrlComponent  {

  path = window.location.pathname;

}
