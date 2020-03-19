import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MaterialModule } from '@testing/material.module';
import { StoNumberInputComponent } from './sto-number-input.component';
import { StoNumberInputPipe } from './sto-number-input.pipe';
import { StoNumberInputDirective } from './sto-number-input.directive';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { StoDirectivesModule } from '@ngx-stoui/core';
import { StoFormModule } from '../sto-form/sto-form.module';

describe('StoNumberInputComponent unit tests', () => {
  let component: StoNumberInputComponent;
  let fixture: ComponentFixture<StoNumberInputComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
        imports: [ MaterialModule, FormsModule, ReactiveFormsModule, StoDirectivesModule, StoFormModule ],
        declarations: [ StoNumberInputPipe, StoNumberInputDirective, StoNumberInputComponent ],
        providers: [ StoNumberInputPipe ]
      })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StoNumberInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should output a rounded un-formatted number', (done) => {
    const spy = spyOn(component, 'propagateChange').and.callThrough();
    component.control.setValue(0.0009);
    fixture.detectChanges();
    setTimeout(() => {
      expect(spy).toHaveBeenCalledWith(0.001);
      done();
    });
  });

});

class Page {

  constructor() {
  }
}
