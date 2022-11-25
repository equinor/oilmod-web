import { ComponentFixture, fakeAsync, TestBed, tick, waitForAsync } from '@angular/core/testing';
import { NgControl, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from '@ngx-stoui/testing';
import { NumberInputPipe } from '../number-input.pipe';
import { NumberInputDirective } from '../number-input.directive';
import { NumberUnitInputComponent } from './number-unit-input.component';
import { Subject } from 'rxjs';
import { DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';
import { MatLegacySelect as MatSelect } from '@angular/material/legacy-select';
import Mock = jest.Mock;

const ngControl = {
  statusChanges: new Subject()
};

const createSpyObj = (baseName: string, methodNames: string[]): { [ key: string ]: Mock<any> } => {
  const obj: any = {};

  for ( let i = 0; i < methodNames.length; i++ ) {
    obj[ methodNames[ i ] ] = jest.fn();
  }

  return obj;
};

describe('NumberUnitInputComponent', () => {
  let component: NumberUnitInputComponent;
  let fixture: ComponentFixture<NumberUnitInputComponent>;
  let page: Page;
  const formControlSpy = createSpyObj('NgControl', [ 'value' ]);

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [ MaterialModule, ReactiveFormsModule, NumberInputPipe, NumberInputDirective, NumberUnitInputComponent ],
      providers: [ { provide: NgControl, useValue: formControlSpy } ]
    }).overrideComponent(NumberUnitInputComponent, {
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
    component.writeValue({ value: 123.456, unit: 'C' });
    fixture.detectChanges();
    expect(component.form.get('value')?.value).toBe('123,456');
    expect(component.form.get('unit')?.value).toBe('C');
  });

  it('should trigger statechanges when attributes are set', () => {
    const spy = jest.spyOn(component.stateChanges, 'next');
    component.placeholder = 'Placeholder';
    component.unitPlaceholder = 'Unit Placeholder';
    component.required = true;
    component.setDisabledState(true);
    component.readonly = true;
    fixture.detectChanges();
    expect(spy).toHaveBeenCalledTimes(5);
  });

  it('should call onChange with a parsed number', () => {
    const spy = jest.spyOn(component, 'onChange');
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

  it('should set component as control value accessor', () => {
    expect(component.ngControl.valueAccessor).toBe(component);
  });

  it('should focus the correct element', () => {
    const ev = {} as any;
    const rect = page.input.getBoundingClientRect();
    const selectSpy = jest.spyOn(page.matSelect, 'focus');
    const selectSpyOpen = jest.spyOn(page.matSelect, 'open');
    ev.clientX = rect.right - 50;
    component.onContainerClick(ev);
    const focusEl = fixture.debugElement.query(By.css(':focus'));
    expect(focusEl.nativeElement).toBe(page.input);
    ev.clientX = rect.right + 20;
    component.onContainerClick(ev);
    fixture.detectChanges();
    expect(selectSpy).toHaveBeenCalled();
    expect(selectSpyOpen).toHaveBeenCalled();
  });

  it('should have a display value with the unit in readonly mode', fakeAsync(() => {
    component.writeValue({ value: 123, unit: 'C' });
    expect(component.input.nativeElement.value).toBe('123,000');
    component.readonly = true;
    fixture.detectChanges();
    tick(60); // due to debounce(50) on stateChanges which updates displayvalue on input
    expect(component.input.nativeElement.value).toBe('123,000 Ce');
    component.readonly = false;
    fixture.detectChanges();
    tick(60); // due to debounce(50) on stateChanges which updates displayvalue on input
    expect(component.input.nativeElement.value).toBe('123,000');
  }));

  function createComponent() {
    fixture = TestBed.createComponent(NumberUnitInputComponent);
    component = fixture.componentInstance;
    component.fractionSize = 3;
    component.list = [
      { value: 'C', title: 'Ce' },
      { value: 'F', title: 'Fa' },
    ];
    fixture.detectChanges();

    return fixture.whenStable().then(() => {
      fixture.detectChanges();
      page = new Page(fixture);
    });

  }

});

class Page {
  public input: HTMLInputElement;
  public inputDe: DebugElement;
  public matSelect: MatSelect;
  public elementRef: HTMLElement;

  constructor(fixture: ComponentFixture<NumberUnitInputComponent>) {
    this.input = fixture.componentInstance.input.nativeElement;
    this.inputDe = fixture.debugElement.query(By.css('input'));
    this.matSelect = fixture.componentInstance.select;
    this.elementRef = fixture.elementRef.nativeElement;
  }
}

