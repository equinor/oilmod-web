import { NumberInputComponent } from './number-input.component';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { NgControl, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from '@testing/material.module';
import { NumberInputPipe } from '../number-input.pipe';
import { StoFormModule } from '../../sto-form/sto-form.module';
import { NumberInputDirective } from '../number-input.directive';
import { Subject } from 'rxjs';
import { ChangeDetectionStrategy } from '@angular/core';

const ngControl = {
  statusChanges: new Subject()
};

describe('NumberInputComponent', () => {
  let component: NumberInputComponent;
  let fixture: ComponentFixture<NumberInputComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
        imports: [ MaterialModule, ReactiveFormsModule, StoFormModule ],
        declarations: [ NumberInputPipe, NumberInputDirective, NumberInputComponent ],
        providers: [ NumberInputPipe ]
      })
      .overrideComponent(NumberInputComponent, {
        set: {
          providers: [
            { provide: NgControl, useValue: ngControl }
          ],
          changeDetection: ChangeDetectionStrategy.Default
        }
      })
      .compileComponents()
      .then(createComponent);
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should update the control value', () => {
    component.writeValue(123.456);
    fixture.detectChanges();
    expect(component.ctrl.value).toBe('123,456');
  });

  it('should trigger statechanges when attributes are set', () => {
    const spy = spyOn(component.stateChanges, 'next').and.callThrough();
    component.placeholder = 'Placeholder';
    component.required = true;
    component.setDisabledState(true);
    component.readonly = true;
    fixture.detectChanges();
    expect(spy).toHaveBeenCalledTimes(4);
  });

  it('should call onChange with a parsed number', () => {
    const spy = spyOn(component, 'onChange');
    component.writeValue(123.456);
    component.ctrl.updateValueAndValidity();
    fixture.detectChanges();
    expect(spy).toHaveBeenCalledWith(123.456);
  });

  it('should allow a dynamic number of decimal places', () => {
    component.dynamicFractionSize = true;
    const spy = spyOn(component, 'onChange');
    fixture.detectChanges();
    component.writeValue(123.4567);
    component.ctrl.updateValueAndValidity();
    fixture.detectChanges();
    component.writeValue(1323.4567890);
    component.ctrl.updateValueAndValidity();
    fixture.detectChanges();
    component.dynamicFractionSize = false;
    fixture.detectChanges();
    component.writeValue(1323.4567890);
    component.ctrl.updateValueAndValidity();
    fixture.detectChanges();

    expect(spy).toHaveBeenCalledWith(123.4567);
    expect(spy).toHaveBeenCalledWith(1323.4567890);
    expect(spy).toHaveBeenCalledWith(1323.457); // Rounded
  });

  it('should clean up after calling ngOnDestroy', () => {
    component.ngOnDestroy();
    fixture.detectChanges();
    expect(component.stateChanges.isStopped).toBeTruthy();
    expect(component.sub.closed).toBeTruthy();
  });

  it('should set component as control value accessor', () => {
    expect(component.ngControl.valueAccessor).toBe(component);
  });


  function createComponent() {
    fixture = TestBed.createComponent(NumberInputComponent);
    component = fixture.componentInstance;
    // ( fixture.componentInstance as any ).ngControl = new FormControl(null, Validators.required);
    component.fractionSize = 3;
    fixture.detectChanges();

    return fixture.whenStable().then(() => {
      fixture.detectChanges();
    });

  }

});

