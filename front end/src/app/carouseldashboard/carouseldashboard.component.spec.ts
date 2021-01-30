import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CarouseldashboardComponent } from './carouseldashboard.component';

describe('CarouseldashboardComponent', () => {
  let component: CarouseldashboardComponent;
  let fixture: ComponentFixture<CarouseldashboardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CarouseldashboardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CarouseldashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
