import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GenerateMainViewComponent } from './generate-main-view/generate-main-view.component';
import {MatInputModule} from '@angular/material/input';
import {MatSelectModule} from '@angular/material/select';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {MatToolbarModule} from '@angular/material/toolbar';
import {ReactiveFormsModule} from '@angular/forms';
import {MatTableModule} from '@angular/material/table';
import {MatPaginatorModule} from '@angular/material/paginator';
import {MatSortModule} from '@angular/material/sort';
import {MatCardModule} from '@angular/material/card';
import {MatButtonModule} from '@angular/material/button';
import {RouterModule} from '@angular/router';
import { SavedPackageTablesComponent } from './saved-package-tables/saved-package-tables.component';
import 'prismjs/components/prism-bash'


@NgModule({
  declarations: [GenerateMainViewComponent, SavedPackageTablesComponent],
  imports: [
    CommonModule,
    MatInputModule,
    MatSelectModule,
    MatCheckboxModule,
    MatProgressSpinnerModule,
    MatToolbarModule,
    ReactiveFormsModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatCardModule,
    MatButtonModule,
    RouterModule,

  ],
  exports: [
    GenerateMainViewComponent
  ]
})
export class GenerateModule { }
