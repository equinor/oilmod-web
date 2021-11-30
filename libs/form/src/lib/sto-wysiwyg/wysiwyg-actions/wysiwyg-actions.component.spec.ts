import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { WysiwygActionsComponent } from './wysiwyg-actions.component';
import { MaterialModule } from '@ngx-stoui/testing';
import { By } from '@angular/platform-browser';
import { MatButtonToggle } from '@angular/material/button-toggle';
import { ChangeDetectionStrategy } from '@angular/core';

describe('WysiwygActionsComponent', () => {
  let component: WysiwygActionsComponent;
  let fixture: ComponentFixture<WysiwygActionsComponent>;
  let toggleButtons: MatButtonToggle[];

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
        imports: [ MaterialModule ],
        declarations: [ WysiwygActionsComponent ],
      })
      .overrideComponent(WysiwygActionsComponent, { set: { changeDetection: ChangeDetectionStrategy.Default } })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WysiwygActionsComponent);
    component = fixture.componentInstance;
    component.disabled = false;
    const de = fixture.debugElement.queryAll(By.directive(MatButtonToggle));
    toggleButtons = de.map(d => d.componentInstance);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should emit a single string to apply formatting', () => {
    const spy = jest.spyOn(component.modifier, 'emit');
    const buttonDe = fixture.debugElement.query(By.css('.sto-wysiwyg__editor__button'));
    buttonDe.triggerEventHandler('click', { type: 'click' });
    fixture.detectChanges();
    expect(spy).toHaveBeenCalledWith('createLink');
  });
});
