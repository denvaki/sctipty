import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {MainViewComponent} from './search/main-view/main-view.component';
import {GenerateMainViewComponent} from './generate/generate-main-view/generate-main-view.component';
import {WrongUrlComponent} from './wrong-url/wrong-url.component';


const routes: Routes = [
  {path: 'search', component: MainViewComponent},
  {path: 'generate', component: GenerateMainViewComponent},
  {path: '', component: MainViewComponent},
  {path: '**', component: WrongUrlComponent}

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
