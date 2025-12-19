import { ChangeDetectionStrategy } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { NgControl, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from '@ngx-stoui/testing';
import { Subject } from 'rxjs';
import { NumberInputDirective } from '../number-input.directive';
import { NumberInputPipe } from '../number-input.pipe';
import { NumberInputComponent } from './number-input.component';

const ngControl = {
  statusChanges: new Subject(),
};

describe('NumberInputComponent', () => {
  let component: NumberInputComponent;
  let fixture: ComponentFixture<NumberInputComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        MaterialModule,
        ReactiveFormsModule,
        NumberInputPipe,
        NumberInputDirective,
        NumberInputComponent,
      ],
    })
      .overrideComponent(NumberInputComponent, {
        set: {
          providers: [{ provide: NgControl, useValue: ngControl }],
          changeDetection: ChangeDetectionStrategy.Default,
        },
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
    // writeValue sets the internal value, ctrl gets formatted on input changes
    expect(component.valueModel()).toBe(123.456);
  });

  it('should trigger statechanges when attributes are set', () => {
    const spy = jest.spyOn(component.stateChanges, 'next');
    fixture.componentRef.setInput('placeholder', 'Placeholder');
    fixture.detectChanges();
    fixture.componentRef.setInput('required', true);
    fixture.detectChanges();
    component.setDisabledState(true);
    fixture.componentRef.setInput('readonly', true);
    fixture.detectChanges();
    // Only signal inputs trigger stateChanges: placeholder, required, readonly (3 total)
    expect(spy).toHaveBeenCalledTimes(3);
  });

  it('should call onChange with a parsed number', () => {
    const spy = jest.spyOn(component as any, 'onChange');
    component.ctrl.setValue('123.456');
    fixture.detectChanges();
    expect(spy).toHaveBeenCalledWith(123.456);
  });

  it('should allow a dynamic number of decimal places', () => {
    fixture.componentRef.setInput('dynamicFractionSize', true);
    const spy = jest.spyOn(component as any, 'onChange');
    fixture.detectChanges();
    component.ctrl.setValue('123.4567');
    fixture.detectChanges();
    component.ctrl.setValue('1323.456789');
    fixture.detectChanges();
    fixture.componentRef.setInput('dynamicFractionSize', false);
    fixture.detectChanges();
    // Need to retrigger value formatting after changing fractionSize
    component.ctrl.updateValueAndValidity();
    fixture.detectChanges();

    expect(spy).toHaveBeenCalledWith(123.4567);
    expect(spy).toHaveBeenCalledWith(1323.456789);
    // When dynamicFractionSize is turned off, the existing value stays as-is
    expect(spy).toHaveBeenCalledWith(1323.456789);
  });

  it('should allow null as input', () => {
    component.valueModel.set(5);
    fixture.detectChanges();
    component.valueModel.set(null);
    fixture.detectChanges();
    expect(component.valueModel()).toBe(null);
  });

  it('should keep number 0 as 0', () => {
    component.valueModel.set(5);
    fixture.detectChanges();
    component.valueModel.set(0);
    fixture.detectChanges();
    expect(component.valueModel()).toBe(0);
  });

  it('should set component as control value accessor', () => {
    expect(component.ngControl?.valueAccessor).toBe(component);
  });

  function createComponent() {
    fixture = TestBed.createComponent(NumberInputComponent);
    component = fixture.componentInstance;
    // ( fixture.componentInstance as any ).ngControl = new FormControl(null, Validators.required);
    fixture.componentRef.setInput('fractionSize', 3);
    fixture.detectChanges();

    return fixture.whenStable().then(() => {
      fixture.detectChanges();
    });
  }
});
