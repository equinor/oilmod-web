import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MaterialModule } from '@testing/material.module.ts';
import { ConfirmComponent } from './sto-confirm-dialog.component';
import { ConfirmModule } from './sto-confirm-dialog.module';
import { ConfirmService } from './sto-confirm-dialog.service';
import { MatButton } from '@angular/material/button';
import { By } from '@angular/platform-browser';

let comp: WrapperComponent;
let fixture: ComponentFixture<WrapperComponent>;
let page: Page;

@Component({
  selector: 'sto-spec-wrap',
  template: `
    <button (click)="confirm()"
            mat-button>Confirm
    </button>`
})
class WrapperComponent {
  constructor(public confirmSvc: ConfirmService) {
  }

  confirm() {
    this.confirmSvc.confirm('Confirm message');
  }
}

describe('ConfirmComponent', () => {

  beforeEach(async(() => {
    TestBed.configureTestingModule({
        imports: [ CommonModule, MaterialModule, ConfirmModule ],
        declarations: [ WrapperComponent ]
      })
      .compileComponents()
      .then(createComponent);
  }));

  it('should open a confirmation dialog', (done: DoneFn) => {
    expect(comp).toBeTruthy();
    const ev = new Event('click');
    page.confirmBtn.dispatchEvent(ev);
    fixture.detectChanges();
    expect(comp.confirmSvc.ref).toBeDefined();
    // cleanup
    comp.confirmSvc.ref.close();
    fixture.detectChanges();
    setTimeout(() => {
      expect(comp.confirmSvc.ref).toBeNull();
      done();
    }, 300);
  });

  it('should open a confirmation dialog and return a value', (done: DoneFn) => {
    const ref = comp.confirmSvc.confirm('Can you confirm this?');
    fixture.detectChanges();
    ref.subscribe(res => {
      expect(res).toBeTruthy();
      done();
    });
    fixture.detectChanges();
    const confirmCmp = comp.confirmSvc.ref.componentInstance;
    comp.confirmSvc.ref.afterOpened()
      .subscribe(() => {
        confirmCmp.dialogRef.close(true);
        fixture.detectChanges();
      });
  });

});

function createComponent() {
  fixture = TestBed
    .createComponent(WrapperComponent);
  comp = fixture.componentInstance;

  fixture.detectChanges();

  return fixture.whenStable().then(() => {
    fixture.detectChanges();
    page = new Page();
  });
}

class Page {
  public confirmBtn: HTMLButtonElement;

  constructor() {
    this.confirmBtn = fixture.debugElement.query(By.directive(MatButton)).nativeElement;
  }
}
