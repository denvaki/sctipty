import {AfterViewInit, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {ScriptyApiService} from '../../services/scripty-api.service';
import {FormControl, Validators} from '@angular/forms';
import {fromEvent, Observable} from 'rxjs';
import {debounceTime, map, switchMap, tap} from 'rxjs/operators';

@Component({
  selector: 'app-main-view',
  templateUrl: './main-view.component.html',
  styleUrls: ['./main-view.component.css']
})
export class MainViewComponent implements AfterViewInit, OnInit {
  public isLoading = false;
  @ViewChild('filter') filter: ElementRef;

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
  public packagenameFormFieldControl = new FormControl('', {validators: Validators.required});


  public userInput = {};
  public releaseArchCols: string[];

  public data = [];

  errorMsg;

  ngAfterViewInit() {
    fromEvent(this.filter.nativeElement, 'input').pipe(

      debounceTime(1000),
      map((event: Event) => (event.target as HTMLInputElement)),
      tap(() => this.isLoading = true),
      switchMap(value => {

        if (!value.value){
          this.isLoading = false;
          return [];
        }
        this.triggerSearch(value.value);


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

    this.scriptyApi.getMap().subscribe(data => {
      console.log(data);
      if (data.length > 0) {
        this.availableDistributions = data;
      }

    });

  }

  setReqeustFieldDistro(){
    this.reqeustFieldDistro = this.distributionFormFieldControl.value ? this.distributionFormFieldControl.value : '';
  }

  setReqeustFieldRelease(){
    this.reqeustFieldRelease = this.releaseFormFieldControl.value ? this.releaseFormFieldControl.value : '';
  }

  setReqeustFieldArch(){
    this.reqeustFieldArch = this.architectureFormFieldControl.value ? this.architectureFormFieldControl.value : '';
  }

  filterReleases() {

    const selectedDistribution = this.distributionFormFieldControl.value;
    if (!selectedDistribution) {
      this.releaseFormFieldControl.disable();
      this.architectureFormFieldControl.disable();
      this.packagenameFormFieldControl.disable();
      return;
    }

    if (selectedDistribution?.releaseNames?.length > 0) {
      this.releaseFormFieldControl.enable();
      this.architectureFormFieldControl.enable();
      this.enableInput();


      if (this.architectureFormFieldControl.value){
        if (this.releaseFormFieldControl.value){
          const releaseHasArch = this.releaseFormFieldControl.value.components
            .find(component => component.archs.includes(this.architectureFormFieldControl.value)).length;
          if (!releaseHasArch){
            this.availableReleases = selectedDistribution.releaseNames
              .filter(release => release.components.find(component => component.archs.includes(this.architectureFormFieldControl.value)));
          }
        }
        else this.availableReleases = selectedDistribution.releaseNames
          .filter(release => release.components.find(component => component.archs.includes(this.architectureFormFieldControl.value)));
      }else{
        this.availableReleases = selectedDistribution.releaseNames;
      }

    } else {
      // TODO: show error msg
      this.releaseFormFieldControl.disable();
      this.architectureFormFieldControl.disable();
      this.packagenameFormFieldControl.disable();

    }
  }


  filterArchitectures() {

    const selectedRelease = this.releaseFormFieldControl.value;
    const selectedDistribution = this.distributionFormFieldControl.value;
    if (!selectedDistribution) {
      this.releaseFormFieldControl.disable();
      this.architectureFormFieldControl.disable();
      this.packagenameFormFieldControl.disable();
      return;
    }

    if (selectedDistribution?.releaseNames?.length > 0) {
      this.releaseFormFieldControl.enable();
      this.architectureFormFieldControl.enable();
      this.enableInput();

      if (selectedRelease && selectedRelease?.components?.length > 0){
        if (this.architectureFormFieldControl.value){
          const releaseHasArch = selectedRelease.components
            .filter(archsObj => archsObj?.archs?.length > 0 && archsObj.archs.includes(this.architectureFormFieldControl.value)).length
          if (!releaseHasArch){
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
        selectedDistribution?.releaseNames.forEach( release => {
            release.components
              .filter(archsObj => archsObj?.archs?.length > 0)
              .forEach(archsObj => archsObj.archs.filter(arch => arch && arch !== 'all').forEach(arch => archs.push(arch)));
          }
        );
        this.availableArchitectures = Array.from(new Set(archs));
      }


    }else {
      // TODO: show error msg
      this.releaseFormFieldControl.disable();
      this.architectureFormFieldControl.disable();
      this.packagenameFormFieldControl.disable();

    }

  }

  enableInput() {
    if (this.packagenameFormFieldControl.disabled) {
      this.packagenameFormFieldControl.enable();
    } else if (this.packagenameFormFieldControl.enabled && this.packagenameFormFieldControl.value) {

      this.triggerSearch(this.packagenameFormFieldControl.value)
    }
  }

  triggerSearch(packageName) {
    this.isLoading = true;
    const distro = this.distributionFormFieldControl.value.distro,
      release = this.releaseFormFieldControl.value ? this.releaseFormFieldControl.value.release : '',
      arch = this.architectureFormFieldControl.value

    return this.scriptyApi.packageSearch(distro, release, packageName, arch)
      .subscribe((response) => {
        this.userInput = {
          distroField: this.distributionFormFieldControl.value.distro,
          packageNameField: this.packagenameFormFieldControl.value
        };
        this.isLoading = false;
        if (response.status !== 'success'){
          this.errorMsg = response;
        }else{
          this.errorMsg = null;
          this.releaseArchCols = [];
          if (!release) this.releaseArchCols.push('Release')
          if (!arch) this.releaseArchCols.push('Architecture')
          this.data = response.result;
          console.log(this.data);
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
