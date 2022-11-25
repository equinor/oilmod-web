import { ComponentFixture, fakeAsync, TestBed, tick, waitForAsync } from '@angular/core/testing';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '@ngx-stoui/testing';
import { StoSelectFilterComponent } from './sto-select-filter.component';
import { MatLegacySelect as MatSelect } from '@angular/material/legacy-select';
import { Subject } from 'rxjs';
import { By } from '@angular/platform-browser';
import { ReactiveFormsModule } from '@angular/forms';
import { FormFieldDirective, StoSelectFilterModule } from '@ngx-stoui/form';

describe('StoSelectFilterComponent', () => {

  let comp: StoSelectFilterComponent;
  let fixture: ComponentFixture<StoSelectFilterComponent>;

  class MockedSelectClass {
    openedChange = new Subject<boolean>();
  }

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
        imports: [ CommonModule, MaterialModule, ReactiveFormsModule, StoSelectFilterModule, FormFieldDirective ],
        declarations: [],
        providers: [ { provide: MatSelect, useClass: MockedSelectClass } ]
      })
      .compileComponents()
      .then(createComponent);
  }));

  it('should create', () => {
    expect(comp).toBeTruthy();
  });

  it('should have focus inputElement when focusIfNoValue is true', () => {
    comp.isFilter = true;
    comp.isMulti = true;
    fixture.detectChanges();
    comp.focusIfNoValue = true;
    comp.select.openedChange.next(true);
    const focusedEl = fixture.debugElement.query(By.css(':focus'));
    expect(focusedEl.nativeElement).toBe(comp.inputElement.nativeElement);
  });

  it('should have focus inputElement when its value is set to empty', fakeAsync(() => {
    comp.isFilter = true;
    fixture.detectChanges();
    comp.focusIfNoValue = true;
    let focusedEl = fixture.debugElement.query(By.css(':focus'));
    expect(focusedEl).toBeNull();
    comp.writeValue('');
    tick(100); // Wait for requestAnimationFrame
    focusedEl = fixture.debugElement.query(By.css(':focus'));
    expect(focusedEl.nativeElement).toBe(comp.inputElement.nativeElement);
  }));

  it('should emit valueChanges when value input element is changed', () => {
    comp.isFilter = true;
    fixture.detectChanges();
    const emitSpy = jest.spyOn(comp.valueChanges, 'emit');
    comp.value = 'test';
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
