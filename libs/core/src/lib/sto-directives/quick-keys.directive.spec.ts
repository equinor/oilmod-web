import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { CommonModule } from '@angular/common';
import { By } from '@angular/platform-browser';
import { Component, ElementRef, ViewChild } from '@angular/core';
import { MaterialModule } from '@ngx-stoui/testing';
import { QuickKeysDirective } from './quick-keys.directive';
import { Key } from '../abstract-and-interfaces/keyPress.enum';

let comp: WrapperComponent;
let fixture: ComponentFixture<WrapperComponent>;

@Component({
  selector: 'sto-spec-wrap',
  template: `<mat-form-field>
    <input quickKeys (quickSubmit)="submit()" (quickCancel)="cancel()" matInput #input>
  </mat-form-field>`
})
class WrapperComponent {
  @ViewChild('input')
  input: ElementRef<HTMLInputElement>;

  submit() {
    console.log('submit')
  }

  cancel() {
    console.log('cancel')
  }
}

describe('QuickKeysDirective', () => {

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
        imports: [ CommonModule, MaterialModule ],
        declarations: [ QuickKeysDirective, WrapperComponent ]
      })
      .compileComponents()
      .then(createComponent);
  }));

  it('should create', () => {
    expect(comp).toBeTruthy();
  });

/*  it('should emit submit on ctrl + enter', () => {
    spyOn(comp, 'submit');
    const event = new Event('keyup') as KeyboardEvent;
    ( <any>event ).ctrlKey = true;
    ( <any>event ).keyCode = Key.Enter;
    comp.input.nativeElement.focus();
    comp.input.nativeElement.dispatchEvent(event);
    expect(comp.submit).toHaveBeenCalled();
  });

  it('should emit cancel on escape', () => {
    spyOn(comp, 'cancel');
    const event = new Event('keyup') as KeyboardEvent;
    ( <any>event ).keyCode = Key.Escape;
    comp.input.nativeElement.focus();
    comp.input.nativeElement.dispatchEvent(event);
    expect(comp.cancel).toHaveBeenCalled();
  });*/

});

function createComponent() {
  fixture = TestBed.createComponent(WrapperComponent);
  comp = fixture.componentInstance;

  fixture.detectChanges();

  return fixture.whenStable().then(() => {
    fixture.detectChanges();
  });
}
