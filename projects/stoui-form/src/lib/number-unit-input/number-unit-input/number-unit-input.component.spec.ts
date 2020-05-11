import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NumberUnitInputComponent } from './number-unit-input.component';

describe('NumberUnitInputComponent', () => {
  let component: NumberUnitInputComponent;
  let fixture: ComponentFixture<NumberUnitInputComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
        declarations: [ NumberUnitInputComponent ]
      })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NumberUnitInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
