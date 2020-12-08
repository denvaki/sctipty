import {Component,  OnInit} from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  routes = [
    {link: '/search', label: 'Search', matBadgeHidden: true},
    {link: '/generate', label: 'Generate', badgeValue: 0, matBadgeHidden: false}
  ];


  ngOnInit(): void {
    setInterval(()=>{
      let packageCount = [];
      let saved = JSON.parse(localStorage.getItem('savedPackages'));
      if (saved && Object.keys(saved)?.length){
        Object.keys(saved).forEach(key => {
          if (saved[key]?.length){
            packageCount.push(...saved[key])
          }
        });

        this.routes.find(route => route.link === '/generate').badgeValue = packageCount.length;
      }
    }, 1000*1)

  }

}


