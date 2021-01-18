import {AfterViewInit, Component, Input, OnInit, ViewChild} from '@angular/core';
import {MatTableDataSource} from '@angular/material/table';
import {SelectionModel} from '@angular/cdk/collections';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {ScriptyApiService} from '../../services/scripty-api.service'
import * as prism from 'prismjs';


@Component({
  selector: 'app-saved-package-tables',
  templateUrl: './saved-package-tables.component.html',
  styleUrls: ['./saved-package-tables.component.css']
})
export class SavedPackageTablesComponent implements OnInit, AfterViewInit {

  @Input()
  data;
  @Input()
  distribution
  dataSource: MatTableDataSource<PackageRows[]>;
  displayedColumns =  ['select', 'Package', 'Version', 'Installed_Size', 'Maintainer', 'Section', 'Release', 'Architecture'];
  selection = new SelectionModel(true, []);

  @ViewChild(MatPaginator, {static:false}) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  urlInput: string;
  public errorMsg;
  public installationSrcipt: string;
  public isLoading = false;
  showScriptArea: boolean;

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

  constructor(private scriptyApi: ScriptyApiService) {
  }

  ngOnInit(): void {
    this.dataSource = new  MatTableDataSource<PackageRows[]>();
    this.dataSource.data = this.data;
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    console.log(this.dataSource.data);
  }

  deleteSelectedPackages(){
    const savedPackages = JSON.parse(localStorage.getItem('savedPackages'));
    const packagesToDeleted = this.selection.selected;
    if (savedPackages[this.distribution]?.length && packagesToDeleted?.length){
      const uuids = packagesToDeleted.map(p => p.uuid).filter(id => id);
      const updatedListOfSavedPackages = savedPackages[this.distribution].filter(p => !uuids.includes(p.uuid));
      this.dataSource.data = updatedListOfSavedPackages;
      this.selection.clear();
      savedPackages[this.distribution] = updatedListOfSavedPackages;
      localStorage.setItem('savedPackages', JSON.stringify(savedPackages));
    }
  }

  generateScript() {
    const packagesForScript = this.selection.selected;
    if (packagesForScript.length > 0){

      let isReleaseSame = true;
      let isArchitectureSame = true;
      if (packagesForScript?.length > 1) {
        const release = packagesForScript[0].Release;
        const architecture = packagesForScript[0].Architecture;
        const differentReleasesCount = packagesForScript.find(p => p?.Release !== release);
        const differentArchitectureCount = packagesForScript.find(p => p?.Architecture !== architecture);
        if (differentReleasesCount) isReleaseSame = false;
        if (differentArchitectureCount) isArchitectureSame = false;
      }
      const releaseNameForRequest = packagesForScript[0].Release;
      const architectureForRequest = packagesForScript[0].Architecture;
      const packageNamesForRequest = Array.from(new Set(packagesForScript.map(p => p.Package).filter(p => p)));
      this.isLoading = true;
      this.errorMsg = null;
      this.installationSrcipt = null;
      this.urlInput = '';
      this.scriptyApi.generateScript(this.distribution, releaseNameForRequest, packageNamesForRequest, architectureForRequest)
        .subscribe((response) =>{
          this.isLoading = false;
          if (response?.status && response?.status !== 200){
            const error = JSON.parse(response.error);
            if (error && error?.status !== 'success' && error?.message){
              const errMsgObj = {message: '', statusText:''};
              errMsgObj.message = error.message;
              errMsgObj.statusText = response.statusText;
              this.errorMsg = errMsgObj;
            }

          }else{
            this.errorMsg = null;
            this.installationSrcipt = prism.highlight(response + '\n', prism.languages.bash, 'bash');
            let domain = window.location.hostname + (window.location.port ? ":" + window.location.port : '');
            this.urlInput = 'http://' + domain + this.scriptyApi.URL;
          }
        })
    }
  }

  showScript() {
    this.showScriptArea = !this.showScriptArea;
  }

  copyText(element) {
    const selBox = document.createElement('textarea');
    selBox.style.position = 'fixed';
    selBox.style.left = '0';
    selBox.style.top = '0';
    selBox.style.opacity = '0';
    selBox.value = element.innerText;
    document.body.appendChild(selBox);
    selBox.focus();
    selBox.select();
    document.execCommand('copy');
    document.body.removeChild(selBox);
  }
}


interface PackageRows {
  'Package': string,
  'uuid': string,
  'Version': string,
  'Installed_Size': string,
  'Maintainer': string,
  'Architecture': string,
  'Depends': string,
  'Description': string,
  'Homepage': string,
  'Section': string,
  'Sub_Section': string,
  'Filename': string,
  'Size': string,
  'Conflicts': string,
  'Release': string
}
