import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { NgControl, ReactiveFormsModule } from '@angular/forms';
import { Subject } from 'rxjs';
import { SlideToggleComponent } from './slide-toggle.component';

const ngControl = {
  statusChanges: new Subject(),
};

describe('SlideToggleComponent', () => {
  let component: SlideToggleComponent;
  let fixture: ComponentFixture<SlideToggleComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [SlideToggleComponent, ReactiveFormsModule],
    })
      .overrideComponent(SlideToggleComponent, {
        set: {
          providers: [{ provide: NgControl, useValue: ngControl }],
        },
      })
      .compileComponents()
      .then(createComponent);
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should update the control value', () => {
    expect(component.ctrl.value).toBe(false);
    component.writeValue(true);
    fixture.detectChanges();
    expect(component.ctrl.value).toBe(true);
  });

  it('should trigger statechanges when attributes are set', () => {
    const spy = jest.spyOn(component.stateChanges, 'next');
    component.required = true;
    fixture.detectChanges();
    component.setDisabledState(true);
    fixture.detectChanges();
    fixture.componentRef.setInput('readonly', true);
    fixture.detectChanges();
    // required setter, setDisabledState, and readonly input each trigger stateChanges
    expect(spy).toHaveBeenCalledTimes(3);
  });

  it('should call onChange with the new value', () => {
    const spy = jest.spyOn(component as any, 'onChange');
    component.writeValue(false);
    component.ctrl.updateValueAndValidity();
    fixture.detectChanges();
    expect(spy).toHaveBeenCalledWith(false);
  });

  it('should update error state', () => {
    expect(component.errorState).toBeFalsy();
    ngControl.statusChanges.next('INVALID');
    fixture.detectChanges();
    expect(component.errorState).toBeTruthy();
  });

  it('should set component as control value accessor', () => {
    // ngControl is optionally injected; in this test we provide a stub so it should be set.
    expect(component.ngControl!.valueAccessor).toBe(component);
  });

  function createComponent() {
    fixture = TestBed.createComponent(SlideToggleComponent);
    component = fixture.componentInstance;
    component.ctrl.setValue(false);
    fixture.detectChanges();

    return fixture.whenStable().then(() => {
      fixture.detectChanges();
    });
  }
});
