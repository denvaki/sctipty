import { Component, OnInit } from '@angular/core';
import {Subject} from 'rxjs';
import {liveSearch} from '../operators/live-search.operator';
import {ScriptyApiService} from '../services/scripty-api.service';


@Component({
  selector: 'app-form-result',
  templateUrl: './form-result.component.html',
  styleUrls: ['./form-result.component.css']
})
export class FormResultComponent {

  packageName: any;
  result: string;
  basics = new BasicsVals();
  selectedForCheckBox = false;
  expandForExtRepo = false;

  supportedDistros: SupportedDistros[] = [
    {name: 'ubuntu', viewName: 'Ubuntu'},
    {name: 'debian', viewName: 'Debian'},
    {name: 'arch', viewName: 'Arch'},
    {name: 'fedora', viewName: 'Fedora'}];


  private userIdSubject = new Subject<string>();
  readonly blogPosts$ = this.userIdSubject.pipe(liveSearch(pckNme => this.debApi.packageSearch(pckNme.toString())));
  panelOpenState: boolean;
  distro: any;



  constructor(private debApi: ScriptyApiService) {
  }

  searchPosts(userId: string) {
    this.userIdSubject.next(userId);
  }

  exactMatchNeeded(selectedValue: string) {
    console.log('select');
    this.selectedForCheckBox = ['by package name', 'both'].includes(selectedValue);
  }

  printVal() {
    console.log(this.selectedForCheckBox);
  }
}

interface SupportedDistros {
  name: string;
  viewName: string;
  suiteVersionName: string[];
  viewSuiteVersionName: string[];
  cpuArch: string[];
  viewCpuArch: string[];
}
class BasicsVals {
  distro = '';
  external = false;
  externalUrl = '';
}
