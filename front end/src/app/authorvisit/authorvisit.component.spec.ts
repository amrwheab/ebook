import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AuthorvisitComponent } from './authorvisit.component';

describe('AuthorvisitComponent', () => {
  let component: AuthorvisitComponent;
  let fixture: ComponentFixture<AuthorvisitComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AuthorvisitComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AuthorvisitComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
