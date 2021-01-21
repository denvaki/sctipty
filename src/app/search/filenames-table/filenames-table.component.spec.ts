import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FilenamesTableComponent } from './filenames-table.component';

describe('FilenamesTableComponent', () => {
  let component: FilenamesTableComponent;
  let fixture: ComponentFixture<FilenamesTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FilenamesTableComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FilenamesTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
