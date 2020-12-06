import {Component, OnInit, ViewChild, AfterViewInit} from '@angular/core';

@Component({
  selector: 'app-generate-main-view',
  templateUrl: './generate-main-view.component.html',
  styleUrls: ['./generate-main-view.component.css']
})
export class GenerateMainViewComponent implements OnInit{
  savedDistroPackage = [];
  ngOnInit(){
    const saved = JSON.parse(localStorage.getItem('savedPackages'));
    if (saved && Object.keys(saved)?.length){
      Object.keys(saved).forEach(distro => {
        const packages = saved[distro];
        if (packages?.length) this.savedDistroPackage.push({distro, packages})
      })
    }
  }
}
