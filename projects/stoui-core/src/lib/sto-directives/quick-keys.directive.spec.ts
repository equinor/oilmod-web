import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { CommonModule } from '@angular/common';
import { By } from '@angular/platform-browser';
import { Component, ElementRef, ViewChild } from '@angular/core';
import { MaterialModule } from '@testing/material.module.ts';
import { QuickKeysDirective } from './quick-keys.directive';
import { Key } from '../abstract-and-interfaces/keyPress.enum';

let comp: WrapperComponent;
let fixture: ComponentFixture<WrapperComponent>;
let page: Page;

@Component({
  selector: 'sto-spec-wrap',
  template: `<mat-form-field>
    <input quickKeys (quickSubmit)="submit()" (quickCancel)="cancel()" matInput #input>
  </mat-form-field>`
})
class WrapperComponent {
  @ViewChild('input', { static: true })
  input: ElementRef<HTMLInputElement>;

  submit() {
  }

  cancel() {
  }
}

describe('QuickKeysDirective', () => {

  beforeEach(async(() => {
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

  it('should emit submit on ctrl + enter', () => {
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
  });

});

function createComponent() {
  fixture = TestBed.createComponent(WrapperComponent);
  comp = fixture.componentInstance;

  fixture.detectChanges();

  return fixture.whenStable().then(() => {
    fixture.detectChanges();
    page = new Page();
  });
}

class Page {
  public dir: QuickKeysDirective;

  constructor() {
    const de = fixture.debugElement.query(By.directive(QuickKeysDirective));
    this.dir = de.componentInstance;
  }
}
