import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SlideToggleComponent } from './slide-toggle.component';
import { MaterialModule } from '@testing/material.module';
import { NgControl, ReactiveFormsModule } from '@angular/forms';
import { Subject } from 'rxjs';

const ngControl = {
  statusChanges: new Subject()
};

describe('SlideToggleComponent', () => {
  let component: SlideToggleComponent;
  let fixture: ComponentFixture<SlideToggleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ MaterialModule, ReactiveFormsModule ],
      declarations: [ SlideToggleComponent ]
    }).overrideComponent(SlideToggleComponent, {
        set: {
          providers: [
            { provide: NgControl, useValue: ngControl }
          ]
        }
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
    const spy = spyOn(component.stateChanges, 'next').and.callThrough();
    component.required = true;
    component.setDisabledState(true);
    component.readonly = true;
    fixture.detectChanges();
    expect(spy).toHaveBeenCalledTimes(3);
  });

  it('should call onChange with the new value', () => {
    const spy = spyOn(component, 'onChange');
    component.writeValue(true);
    component.ctrl.updateValueAndValidity();
    fixture.detectChanges();
    expect(spy).toHaveBeenCalledWith(true);
  });

  it('should clean up after calling ngOnDestroy', () => {
    component.ngOnDestroy();
    fixture.detectChanges();
    expect(component.stateChanges.isStopped).toBeTruthy();
    expect(component.sub.closed).toBeTruthy();
  });

  it('should update error state', () => {
    expect(component.errorState).toBeFalsy();
    ngControl.statusChanges.next('INVALID');
    fixture.detectChanges();
    expect(component.errorState).toBeTruthy();
  });

  it('should set component as control value accessor', () => {
    expect(component.ngControl.valueAccessor).toBe(component);
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
