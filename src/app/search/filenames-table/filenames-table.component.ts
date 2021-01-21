import {Component, Input,  ViewChild, OnChanges} from '@angular/core';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';
import {SelectionModel} from '@angular/cdk/collections';
import { v4 as uuid } from 'uuid';

@Component({
  selector: 'app-filenames-table',
  templateUrl: './filenames-table.component.html',
  styleUrls: ['./filenames-table.component.css']
})
export class FilenamesTableComponent implements OnChanges {

  @Input()
  data;
  @Input()
  userInput;

  basicColumns: string[] = ['Filename', 'Packages'];
  displayedColumns: string[] = this.basicColumns;
  dataSource : MatTableDataSource<FilePackagesRows[]>;

  isInitialCall = true;
  isFirstCall = true;

  @ViewChild(MatPaginator, {static:false}) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor() {
  }

  

  ngOnChanges(){
    if (this.isInitialCall) {
      this.isInitialCall = false;
      return;
    }

    if (!this.isInitialCall && this.isFirstCall){
      this.dataSource =  new MatTableDataSource<FilePackagesRows[]>();
      this.dataSource.data = this.data;
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
      this.isFirstCall = false;
      return;
    }
    this.dataSource.data = this.data;
  }

  


}

interface FilePackagesRows {
  'filename': string,
  'packages': string[]
}

