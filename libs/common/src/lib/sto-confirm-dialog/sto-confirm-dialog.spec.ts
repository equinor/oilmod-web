import { Component, inject } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { MatButton, MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { By } from '@angular/platform-browser';
// Import only the minimal material modules to avoid pulling BrowserModule twice via large aggregated testing module.
import { ConfirmModule } from './sto-confirm-dialog.module';
import { ConfirmService } from './sto-confirm-dialog.service';
import DoneCallback = jest.DoneCallback;

let comp: WrapperComponent;
let fixture: ComponentFixture<WrapperComponent>;
let page: Page;

@Component({
  selector: 'sto-spec-wrap',
  template: ` <button (click)="confirm()" matButton="filled">Confirm</button>`,
  imports: [MatButtonModule, MatDialogModule, ConfirmModule],
})
class WrapperComponent {
  confirmSvc = inject(ConfirmService);

  confirm() {
    this.confirmSvc.confirm('Confirm message');
  }
}

describe('ConfirmComponent', () => {
  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [WrapperComponent],
    })
      .compileComponents()
      .then(createComponent);
  }));

  it('should open a confirmation dialog', (done: DoneCallback) => {
    expect(comp).toBeTruthy();
    const ev = new Event('click');
    const subscription = comp.confirmSvc
      .confirm('Confirm message')
      .subscribe(() => {
        // Dialog closed
      });
    page.confirmBtn.dispatchEvent(ev);
    fixture.detectChanges();
    // Dialog is opened, verify by checking MatDialog openDialogs
    expect(comp.confirmSvc['dialog'].openDialogs.length).toBeGreaterThan(0);
    // cleanup - close all dialogs
    comp.confirmSvc['dialog'].closeAll();
    fixture.detectChanges();
    setTimeout(() => {
      expect(comp.confirmSvc['dialog'].openDialogs.length).toBe(0);
      subscription.unsubscribe();
      done();
    }, 300);
  });

  it('should open a confirmation dialog and return a value', (done: DoneCallback) => {
    const ref = comp.confirmSvc.confirm('Can you confirm this?');
    fixture.detectChanges();
    ref.subscribe((res) => {
      expect(res).toBeTruthy();
      done();
    });
    fixture.detectChanges();
    const openDialog = comp.confirmSvc['dialog'].openDialogs[0];
    const confirmCmp = openDialog?.componentInstance;
    confirmCmp?.dialogRef.close(true);
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
  public confirmBtn: HTMLButtonElement;

  constructor() {
    this.confirmBtn = fixture.debugElement.query(
      By.directive(MatButton),
    ).nativeElement;
  }
}
