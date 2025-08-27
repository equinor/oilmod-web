import { Component, ElementRef, ViewChild } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { By } from '@angular/platform-browser';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { Key } from '@ngx-stoui/core';
import { QuickKeysDirective } from './quick-keys.directive';

let comp: WrapperComponent;
let fixture: ComponentFixture<WrapperComponent>;

@Component({
  selector: 'sto-spec-wrap',
  imports: [MatFormFieldModule, MatInputModule, QuickKeysDirective],
  template: ` <mat-form-field>
    <input
      stoQuickKeys
      (quickSubmit)="submit()"
      (quickCancel)="cancel()"
      matInput
      #input
    />
  </mat-form-field>`,
})
class WrapperComponent {
  @ViewChild('input')
  input: ElementRef<HTMLInputElement>;

  submit() {
    console.log('submit');
  }

  cancel() {
    console.log('cancel');
  }
}

describe('QuickKeysDirective', () => {
  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [NoopAnimationsModule, WrapperComponent],
    })
      .compileComponents()
      .then(createComponent);
  }));

  it('should create', () => {
    expect(comp).toBeTruthy();
  });

  it('should react on ctrl+enter', () => {
    const spy = jest.spyOn(comp, 'submit');
    const event = new KeyboardEvent('keyup', {
      ctrlKey: true,
      keyCode: Key.Enter,
    });
    const el = fixture.debugElement.query(By.css('input'));
    el.nativeElement.dispatchEvent(event);
    expect(spy).toHaveBeenCalled();
  });

  it('should react on escape', () => {
    const spy = jest.spyOn(comp, 'cancel');
    const event = new KeyboardEvent('keyup', { keyCode: Key.Escape });
    const el = fixture.debugElement.query(By.css('input'));
    el.nativeElement.dispatchEvent(event);
    expect(spy).toHaveBeenCalled();
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
