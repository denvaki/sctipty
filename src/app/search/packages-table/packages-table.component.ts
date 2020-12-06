import {Component, Input, OnInit, ViewChild, OnChanges} from '@angular/core';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';
import {SelectionModel} from '@angular/cdk/collections';
import { v4 as uuid } from 'uuid';

@Component({
  selector: 'app-packages-table',
  templateUrl: './packages-table.component.html',
  styleUrls: ['./packages-table.component.css']
})
export class PackagesTableComponent implements OnInit, OnChanges {

  @Input()
  data;
  @Input()
  userInput;
  @Input()
  releaseArchCols;
  @Input()
  distro;

  basicColumns: string[] = ['select', 'Package', 'Version', 'Installed_Size', 'Maintainer', 'Section'];
  displayedColumns: string[] = this.basicColumns;
  selection = new SelectionModel(true, []);
  dataSource : MatTableDataSource<PackageRows[]>;

  isInitialCall = true;
  isFirstCall = true;

  @ViewChild(MatPaginator, {static:false}) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor() {
  }

  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  masterToggle() {
    this.isAllSelected() ?
      this.selection.clear() :
      this.dataSource.data.forEach(row => this.selection.select(row));
  }

  ngOnInit(): void {}

  ngOnChanges(){
    this.selection.clear();
    if (this.isInitialCall) {
      this.isInitialCall = false;
      return;
    }

    this.displayedColumns = this.basicColumns.concat(this.releaseArchCols);
    if (!this.isInitialCall && this.isFirstCall){
      this.dataSource =  new MatTableDataSource<PackageRows[]>();
      this.dataSource.data = this.data;
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
      this.isFirstCall = false;
      return;
    }
    this.dataSource.data = this.data;
  }

  addSelectedPackage(){
    const saved = JSON.parse(localStorage.getItem('savedPackages'));
    let selectedPackages = this.selection.selected;
    if (selectedPackages.length){
      selectedPackages = selectedPackages.map(p => {
        p.uuid = uuid();
        return p;
      });
      if (saved){
        if (saved[this.userInput.distroField]?.length){
          saved[this.userInput.distroField] = saved[this.userInput.distroField].concat(selectedPackages);
        }else {
          saved[this.userInput.distroField] = selectedPackages;
        }
        localStorage.setItem('savedPackages', JSON.stringify(saved));
      }else {
        let saveObj = {};
        saveObj[this.userInput.distroField] = selectedPackages;
        localStorage.setItem('savedPackages', JSON.stringify(saveObj));
      }
    }

  }


}

interface PackageRows {
  'Package': string,
  'Version': string,
  'Installed_Size': number,
  'Maintainer': string,
  'Architecture': string,
  'Depends': string,
  'Description': string,
  'Homepage': string,
  'Section': string,
  'Sub_Section': string,
  'Filename': string,
  'Size': number,
  'Conflicts': string,
  'Release': string
}

