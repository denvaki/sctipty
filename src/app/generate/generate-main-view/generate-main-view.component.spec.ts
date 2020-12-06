import { ComponentFixture, TestBed } from '@angular/core/testing';


import { GenerateMainViewComponent } from './generate-main-view.component';

describe('GenerateMainViewComponent', () => {
  let component: GenerateMainViewComponent;
  let fixture: ComponentFixture<GenerateMainViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GenerateMainViewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GenerateMainViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
