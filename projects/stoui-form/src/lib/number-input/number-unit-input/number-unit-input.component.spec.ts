import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, NgControl, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from '@testing/material.module';
import { NumberInputPipe } from '../number-input.pipe';
import { StoFormModule } from '../../sto-form/sto-form.module';
import { NumberInputDirective } from '../number-input.directive';
import { NumberUnitInputComponent } from './number-unit-input.component';

describe('NumberUnitInputComponent', () => {
  let component: NumberUnitInputComponent;
  let fixture: ComponentFixture<NumberUnitInputComponent>;
  let formControlSpy: jasmine.SpyObj<NgControl>;
  formControlSpy = jasmine.createSpyObj('NgControl', [ 'value' ]);

  beforeEach(async(() => {
    TestBed.configureTestingModule({
        imports: [ MaterialModule, ReactiveFormsModule, StoFormModule ],
        declarations: [ NumberInputPipe, NumberInputDirective, NumberUnitInputComponent ],
        providers: [ NumberInputPipe, { provide: NgControl, useValue: formControlSpy } ]
      })
      .compileComponents()
      .then(createComponent);
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should update the control value', () => {
    component.writeValue({ value: 123.456, unit: 'C' });
    fixture.detectChanges();
    expect(component.form.get('value').value).toBe('123,456');
    expect(component.form.get('unit').value).toBe('C');
  });

  it('should trigger statechanges when attributes are set', () => {
    const spy = spyOn(component.stateChanges, 'next').and.callThrough();
    component.placeholder = 'Placeholder';
    component.unitPlaceholder = 'Unit Placeholder';
    component.required = true;
    component.setDisabledState(true);
    component.readonly = true;
    fixture.detectChanges();
    expect(spy).toHaveBeenCalledTimes(5);
  });

  it('should call onChange with a parsed number', () => {
    const spy = spyOn(component, 'onChange');
    component.writeValue({ value: 123.456, unit: 'C' });
    component.form.updateValueAndValidity();
    fixture.detectChanges();
    expect(spy).toHaveBeenCalledWith({ value: 123.456, unit: 'C' });
  });

  it('should clean up after calling ngOnDestroy', () => {
    component.ngOnDestroy();
    fixture.detectChanges();
    expect(component.stateChanges.isStopped).toBeTruthy();
    expect(component.sub.closed).toBeTruthy();
  });


  function createComponent() {
    fixture = TestBed.createComponent(NumberUnitInputComponent);
    component = fixture.componentInstance;
    ( fixture.componentInstance as any ).ngControl = new FormControl();
    component.fractionSize = 3;
    fixture.detectChanges();

    return fixture.whenStable().then(() => {
      fixture.detectChanges();
    });

  }

});

