import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AuthersdashboardComponent } from './authersdashboard.component';

describe('AuthersdashboardComponent', () => {
  let component: AuthersdashboardComponent;
  let fixture: ComponentFixture<AuthersdashboardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AuthersdashboardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AuthersdashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
