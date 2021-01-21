import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ScriptyApiService } from '../../services/scripty-api.service';
import { FormControl, Validators } from '@angular/forms';
import { fromEvent, Observable } from 'rxjs';
import { debounceTime, map, switchMap, tap } from 'rxjs/operators';

@Component({
  selector: 'app-main-view',
  templateUrl: './main-view.component.html',
  styleUrls: ['./main-view.component.css']
})
export class MainViewComponent implements AfterViewInit, OnInit {
  public isPackageSearchLoading = false;
  public isFileSearchLoading = false;
  @ViewChild('packageNameInput') packageNameInput: ElementRef;
  @ViewChild('fileNameInput') fileNameInput: ElementRef;
  
  public filenameMatchMode = 'strict';
  public packagenameMatchMode = 'strict';
  public availableDistributions: any[];
  public availableReleases: any[];
  public availableArchitectures: string[];

  private reqeustFieldDistro = '';
  private reqeustFieldRelease = '';
  private reqeustFieldArch = '';
  public chData



  constructor(private scriptyApi: ScriptyApiService) {
  }

  public distributionFormFieldControl = new FormControl('', Validators.required);
  public releaseFormFieldControl = new FormControl('');
  public architectureFormFieldControl = new FormControl('');
  public packagenameFormFieldControl = new FormControl('', { validators: Validators.required });
  public filenameFormFieldControl = new FormControl('', { validators: Validators.required });


  public fileUserInput = '';
  public packageUserInput = {};
  public releaseArchCols: string[];

  public packageData = [];
  public fileData    = [];

  errorMsg;

  ngAfterViewInit() {
    fromEvent(this.packageNameInput.nativeElement, 'input').pipe(

      debounceTime(1000),
      map((event: Event) => (event.target as HTMLInputElement)),
      tap(() => this.isPackageSearchLoading = true),
      switchMap(value => {

        if (!value.value) {
          this.isPackageSearchLoading = false;
          return [];
        }
        this.triggerPackageSearch(value.value);


        return new Observable();

      })
    )
      .subscribe(() => {

      })



    fromEvent(this.fileNameInput.nativeElement, 'input').pipe(

      debounceTime(1000),
      map((event: Event) => (event.target as HTMLInputElement)),
      tap(() => this.isFileSearchLoading = true),
      switchMap(value => {

        if (!value.value) {
          this.isFileSearchLoading = false;
          return [];
        }
        this.triggerFileSearch(value.value);


        return new Observable();

      })
    )
      .subscribe(() => {

      })

  }

  ngOnInit() {
    this.releaseFormFieldControl.disable();
    this.architectureFormFieldControl.disable();
    this.packagenameFormFieldControl.disable();
    this.filenameFormFieldControl.disable();

    this.scriptyApi.getMap().subscribe(packageData => {
      console.log(packageData);
      if (packageData.length > 0) {
        this.availableDistributions = packageData;
      }

    });

  }

  setReqeustFieldDistro() {
    this.reqeustFieldDistro = this.distributionFormFieldControl.value ? this.distributionFormFieldControl.value : '';
  }

  setReqeustFieldRelease() {
    this.reqeustFieldRelease = this.releaseFormFieldControl.value ? this.releaseFormFieldControl.value : '';
  }

  setReqeustFieldArch() {
    this.reqeustFieldArch = this.architectureFormFieldControl.value ? this.architectureFormFieldControl.value : '';
  }

  filterReleases() {

    const selectedDistribution = this.distributionFormFieldControl.value;
    if (!selectedDistribution) {
      this.releaseFormFieldControl.disable();
      this.architectureFormFieldControl.disable();
      this.packagenameFormFieldControl.disable();
      this.filenameFormFieldControl.disable();
      return;
    }

    if (selectedDistribution?.releaseNames?.length > 0) {
      this.releaseFormFieldControl.enable();
      this.architectureFormFieldControl.enable();
      this.enableInput();


      if (this.architectureFormFieldControl.value) {
        if (this.releaseFormFieldControl.value) {
          const releaseHasArch = this.releaseFormFieldControl.value.components
            .find(component => component.archs.includes(this.architectureFormFieldControl.value)).length;
          if (!releaseHasArch) {
            this.availableReleases = selectedDistribution.releaseNames
              .filter(release => release.components.find(component => component.archs.includes(this.architectureFormFieldControl.value)));
          }
        }
        else this.availableReleases = selectedDistribution.releaseNames
          .filter(release => release.components.find(component => component.archs.includes(this.architectureFormFieldControl.value)));
      } else {
        this.availableReleases = selectedDistribution.releaseNames;
      }

    } else {
      // TODO: show error msg
      this.releaseFormFieldControl.disable();
      this.architectureFormFieldControl.disable();
      this.packagenameFormFieldControl.disable();
      this.filenameFormFieldControl.disable();

    }
  }


  filterArchitectures() {

    const selectedRelease = this.releaseFormFieldControl.value;
    const selectedDistribution = this.distributionFormFieldControl.value;
    if (!selectedDistribution) {
      this.releaseFormFieldControl.disable();
      this.architectureFormFieldControl.disable();
      this.packagenameFormFieldControl.disable();
      this.filenameFormFieldControl.disable();
      return;
    }

    if (selectedDistribution?.releaseNames?.length > 0) {
      this.releaseFormFieldControl.enable();
      this.architectureFormFieldControl.enable();
      this.enableInput();

      if (selectedRelease && selectedRelease?.components?.length > 0) {
        if (this.architectureFormFieldControl.value) {
          const releaseHasArch = selectedRelease.components
            .filter(archsObj => archsObj?.archs?.length > 0 && archsObj.archs.includes(this.architectureFormFieldControl.value)).length
          if (!releaseHasArch) {
            const archs = [];
            selectedRelease.components
              .filter(archsObj => archsObj?.archs?.length > 0)
              .forEach(archsObj => archsObj.archs.filter(arch => arch && arch !== 'all').forEach(arch => archs.push(arch)));
            this.availableArchitectures = Array.from(new Set(archs));
          }
        } else {
          const archs = [];
          selectedRelease.components
            .filter(archsObj => archsObj?.archs?.length > 0)
            .forEach(archsObj => archsObj.archs.filter(arch => arch && arch !== 'all').forEach(arch => archs.push(arch)));
          this.availableArchitectures = Array.from(new Set(archs));
        }
      } else {
        const archs = [];
        selectedDistribution?.releaseNames.forEach(release => {
          release.components
            .filter(archsObj => archsObj?.archs?.length > 0)
            .forEach(archsObj => archsObj.archs.filter(arch => arch && arch !== 'all').forEach(arch => archs.push(arch)));
        }
        );
        this.availableArchitectures = Array.from(new Set(archs));
      }


    } else {
      // TODO: show error msg
      this.releaseFormFieldControl.disable();
      this.architectureFormFieldControl.disable();
      this.packagenameFormFieldControl.disable();
      this.filenameFormFieldControl.disable();

    }

  }

  enableInput() {
    if (this.packagenameFormFieldControl.disabled) {
      this.packagenameFormFieldControl.enable();
    } else if (this.packagenameFormFieldControl.enabled && this.packagenameFormFieldControl.value) {

      this.triggerPackageSearch(this.packagenameFormFieldControl.value)
    }

    if (this.filenameFormFieldControl.disabled) {
      this.filenameFormFieldControl.enable();
    } else if (this.filenameFormFieldControl.enabled && this.filenameFormFieldControl.value) {

      this.triggerFileSearch(this.filenameFormFieldControl.value)
    }

  }

  triggerPackageSearch(packageName: string) {
    this.isPackageSearchLoading = true;
    const distro = this.distributionFormFieldControl.value.distro,
      release = this.releaseFormFieldControl.value ? this.releaseFormFieldControl.value.release : '',
      arch = this.architectureFormFieldControl.value

    return this.scriptyApi.packageSearch(distro, release, packageName, arch, this.packagenameMatchMode)
      .subscribe((response) => {
        this.packageUserInput = {
          distroField: this.distributionFormFieldControl.value.distro,
          packageNameField: this.packagenameFormFieldControl.value
        };
        this.isPackageSearchLoading = false;
        if (response.status !== 'success') {
          this.errorMsg = response;
        } else {
          this.errorMsg = null;
          this.releaseArchCols = [];
          if (!release) this.releaseArchCols.push('Release')
          if (!arch) this.releaseArchCols.push('Architecture')
          this.packageData = response.result;
          console.log(this.packageData);
        }

      })

  }

  triggerFileSearch(fileName: string) {
    this.isFileSearchLoading = true;
    const distro = this.distributionFormFieldControl.value.distro,
      release = this.releaseFormFieldControl.value ? this.releaseFormFieldControl.value.release : '',
      arch = this.architectureFormFieldControl.value

    return this.scriptyApi.fileSearch(distro, release, fileName, arch, this.filenameMatchMode)
      .subscribe((response) => {
        this.isFileSearchLoading = false;

        if (response.status !== 'success') {
          this.errorMsg = response;
        } else {
          this.errorMsg = null;
          this.fileData = response.result;
          console.log(this.fileData)
        }

      })

  }



  resetFiltered() {
    this.availableReleases = [];
    this.availableArchitectures = [];
    this.architectureFormFieldControl.setValue('');
    this.releaseFormFieldControl.setValue('');
  }
}
