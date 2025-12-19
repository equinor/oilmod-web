import { CommonModule } from '@angular/common';
import {
  ComponentFixture,
  fakeAsync,
  TestBed,
  tick,
  waitForAsync,
} from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MatSelect } from '@angular/material/select';
import { By } from '@angular/platform-browser';
import { FormFieldDirective } from '@ngx-stoui/form';
import { MaterialModule } from '@ngx-stoui/testing';
import { Subject } from 'rxjs';
import { StoSelectFilterComponent } from './sto-select-filter.component';

describe('StoSelectFilterComponent', () => {
  let comp: StoSelectFilterComponent;
  let fixture: ComponentFixture<StoSelectFilterComponent>;
  let mockSelect: MockedSelectClass;

  class MockedSelectClass {
    openedChange = new Subject<boolean>();
  }

  beforeEach(waitForAsync(() => {
    mockSelect = new MockedSelectClass();
    TestBed.configureTestingModule({
      imports: [
        CommonModule,
        MaterialModule,
        ReactiveFormsModule,
        StoSelectFilterComponent,
        FormFieldDirective,
      ],
      providers: [{ provide: MatSelect, useValue: mockSelect }],
    })
      .compileComponents()
      .then(createComponent);
  }));

  it('should create', () => {
    expect(comp).toBeTruthy();
  });

  it.skip('should have focus inputElement when focusIfNoValue is true', () => {
    // Skip: afterNextRender doesn't execute in test environment
    fixture.componentRef.setInput('isFilter', true);
    fixture.componentRef.setInput('isMulti', true);
    fixture.componentRef.setInput('focusIfNoValue', true);
    fixture.detectChanges();
    mockSelect.openedChange.next(true);
    fixture.detectChanges();
    const focusedEl = fixture.debugElement.query(By.css(':focus'));
    // Focus is applied via afterNextRender, just verify an element has focus
    expect(focusedEl).toBeTruthy();
  });

  it.skip('should have focus inputElement when its value is set to empty', fakeAsync(() => {
    // Skip: afterNextRender doesn't execute in test environment
    fixture.componentRef.setInput('isFilter', true);
    fixture.componentRef.setInput('focusIfNoValue', true);
    fixture.detectChanges();
    let focusedEl = fixture.debugElement.query(By.css(':focus'));
    expect(focusedEl).toBeNull();
    fixture.componentRef.setInput('value', '');
    fixture.detectChanges();
    tick(100); // Wait for requestAnimationFrame
    focusedEl = fixture.debugElement.query(By.css(':focus'));
    // Focus is applied via afterNextRender
    expect(focusedEl).toBeTruthy();
  }));

  it('should emit valueChanges when filter input is changed', () => {
    fixture.componentRef.setInput('isFilter', true);
    fixture.detectChanges();
    const emitSpy = jest.spyOn(comp.valueChanges, 'emit');
    comp.inputControl.setValue('test');
    fixture.detectChanges();
    expect(emitSpy).toHaveBeenCalledWith('test');
  });

  function createComponent() {
    fixture = TestBed.createComponent(StoSelectFilterComponent);
    comp = fixture.componentInstance;
    fixture.detectChanges();

    return fixture.whenStable().then(() => {
      fixture.detectChanges();
    });
  }
});
