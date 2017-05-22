import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StoCalendarComponent } from './sto-calendar.component';

describe('StoCalendarComponent', () => {
  let component: StoCalendarComponent;
  let fixture: ComponentFixture<StoCalendarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StoCalendarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StoCalendarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
