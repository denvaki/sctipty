import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SavedPackageTablesComponent } from './saved-package-tables.component';

describe('SavedPackageTablesComponent', () => {
  let component: SavedPackageTablesComponent;
  let fixture: ComponentFixture<SavedPackageTablesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SavedPackageTablesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SavedPackageTablesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
