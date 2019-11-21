import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WysiwygActionsComponent } from './wysiwyg-actions.component';
import { MaterialModule } from '@testing/material.module';
import { By } from '@angular/platform-browser';
import { MatButtonToggle } from '@angular/material/button-toggle';

describe('WysiwygActionsComponent', () => {
  let component: WysiwygActionsComponent;
  let fixture: ComponentFixture<WysiwygActionsComponent>;
  let toggleButtons: MatButtonToggle[];

  beforeEach(async(() => {
    TestBed.configureTestingModule({
        imports: [ MaterialModule ],
        declarations: [ WysiwygActionsComponent ]
      })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WysiwygActionsComponent);
    component = fixture.componentInstance;
    const de = fixture.debugElement.queryAll(By.directive(MatButtonToggle));
    toggleButtons = de.map(d => d.componentInstance);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should update selected (highlighted) buttons when active changes', () => {
    component.active = [];
    fixture.detectChanges();
    let active = toggleButtons.filter(btn => btn.checked);
    expect(active.length).toBe(0);
    component.active = [ 'bold', 'italic' ];
    fixture.detectChanges();
    active = toggleButtons.filter(btn => btn.checked);
    expect(active.length).toBe(2);
  });

  it('should emit a single string to apply formatting', () => {
    const spy = spyOn(component.modifier, 'emit');
    const buttonDe = fixture.debugElement.query(By.css('.sto-wysiwyg__editor__button'));
    buttonDe.triggerEventHandler('click', { type: 'click' });
    fixture.detectChanges();
    expect(spy).toHaveBeenCalledWith('createLink');
  });
});
