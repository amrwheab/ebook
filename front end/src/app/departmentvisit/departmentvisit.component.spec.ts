import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DepartmentvisitComponent } from './departmentvisit.component';

describe('DepartmentvisitComponent', () => {
  let component: DepartmentvisitComponent;
  let fixture: ComponentFixture<DepartmentvisitComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DepartmentvisitComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DepartmentvisitComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
