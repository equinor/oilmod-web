import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { CommonModule } from '@angular/common';
import { Component, ElementRef, ViewChild } from '@angular/core';
import { MaterialModule } from '@ngx-stoui/testing';
import { QuickKeysDirective } from './quick-keys.directive';

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

});

function createComponent() {
  fixture = TestBed.createComponent(WrapperComponent);
  comp = fixture.componentInstance;

  fixture.detectChanges();

  return fixture.whenStable().then(() => {
    fixture.detectChanges();
  });
}
