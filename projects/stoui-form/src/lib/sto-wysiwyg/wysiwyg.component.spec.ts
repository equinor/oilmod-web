import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WysiwygComponent } from './wysiwyg.component';
import { WysiwygEditorComponent } from './wysiwyg-editor/wysiwyg-editor.component';
import { WysiwygActionsComponent } from './wysiwyg-actions/wysiwyg-actions.component';
import { MaterialModule } from '@testing/material.module';
import { ChangeDetectionStrategy, Component, DebugElement } from '@angular/core';
import { By, SafeHtml } from '@angular/platform-browser';
import { FormControl, ReactiveFormsModule } from '@angular/forms';

interface TestSafeHtml extends SafeHtml {
  changingThisBreaksApplicationSecurity: string;
  getTypeName: () => string;
}

@Component({
  selector: 'sto-wrap',
  template: `
      <sto-wysiwyg [formControl]="ctrl">
          <button id="submit">SaveButton</button>
      </sto-wysiwyg>`
})
class WrapperComponent {
  public ctrl = new FormControl();

  disable() {
    this.ctrl.disable();
  }

  enable() {
    this.ctrl.enable();
  }
}

describe('WysiwygComponent unit tests', () => {
  let component: WysiwygComponent;
  let fixture: ComponentFixture<WysiwygComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
        imports: [ MaterialModule ],
        declarations: [ WysiwygComponent, WysiwygEditorComponent, WysiwygActionsComponent ]
      })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WysiwygComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should only call execCommand when execute is called with a known method', () => {
    const spy = spyOn(document, 'execCommand');
    component.execute('bold');
    expect(spy).toHaveBeenCalled();
    component.execute('formatDocument');
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('should execute [in|out]dent when onKeyDownHandleTab is called with tab', () => {
    const spy = spyOn(component, 'execute');

    const ev = {
      key: 'Tab',
      shiftKey: false,
      preventDefault: () => {
      }
    } as any;

    component.onKeyDownHandleTab(ev);
    expect(spy).toHaveBeenCalledWith('indent');
    ev.shiftKey = true;
    component.onKeyDownHandleTab(ev);
    expect(spy).toHaveBeenCalledWith('outdent');

    expect(spy).toHaveBeenCalledTimes(2);
    ev.key = 'ArrowLeft';
    component.onKeyDownHandleTab(ev);
    expect(spy).toHaveBeenCalledTimes(2);
  });

  it('should set value to SafeHtml when writeValue is called', () => {
    const html = `<h1>A Header</h1>`;
    component.writeValue(html);
    const val = component.value as TestSafeHtml;
    const el = document.createElement('div');
    el.innerHTML = html;
    expect(val.changingThisBreaksApplicationSecurity).toEqual(el.innerHTML);
  });

  it('should set the component as readonly when setDisabledState is called', () => {
    expect(component.disabled).toBeFalsy();
    component.setDisabledState(true);
    expect(component.disabled).toBeTruthy();
    component.setDisabledState(false);
    expect(component.disabled).toBeFalsy();
  });

});

describe('WysiwygComponent integration tests', () => {
  let wrapper: WrapperComponent;
  let fixture: ComponentFixture<WrapperComponent>;
  let page: Page;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
        imports: [ MaterialModule, ReactiveFormsModule ],
        declarations: [ WrapperComponent, WysiwygComponent, WysiwygEditorComponent, WysiwygActionsComponent ]
      })
      .overrideComponent(WysiwygComponent, { set: { changeDetection: ChangeDetectionStrategy.Default } })
      .compileComponents()
      .then(createComponent);
  }));

  it('should create with children', () => {
    expect(wrapper).toBeTruthy();
    expect(page.wysiwyg).toBeTruthy();
    expect(page.actions).toBeTruthy();
    expect(page.editor).toBeTruthy();
  });

  it('should update value from wrapper to wysiwyg', () => {
    wrapper.ctrl.setValue(`<h1>A title!</h1>`);
    fixture.detectChanges();
    const val = page.wysiwyg.value as TestSafeHtml;
    expect(val.changingThisBreaksApplicationSecurity).toEqual(`<h1>A title!</h1>`);
  });

  it('should update value from wysiwyg to wrapper', () => {
    expect(wrapper.ctrl.value).toBeFalsy();
    const value = `<h1>Heading</h1>`;
    page.wysiwyg.valueChanged(value);
    expect(wrapper.ctrl.value).toEqual(value);
  });

  it('should toggle contenteditable attribute in editor when ctrl is disabled / enabled', () => {
    expect(page.editable.getAttribute('contenteditable')).toEqual('true');
    expect(page.editor.readonly).toBeFalsy();
    expect(page.wysiwyg.disabled).toBeFalsy();
    const spy = spyOn(page.wysiwyg, 'setDisabledState').and.callThrough();
    wrapper.disable();
    fixture.detectChanges();
    expect(spy).toHaveBeenCalled();
    expect(page.wysiwyg.disabled).toBeTruthy();
    expect(page.editor.readonly).toBeTruthy();
    expect(page.editable.getAttribute('contenteditable')).toEqual('false');
    wrapper.enable();
    fixture.detectChanges();
    expect(page.editable.getAttribute('contenteditable')).toEqual('true');
  });

  it('should project a button', () => {
    expect(page.projectedButton).toBeTruthy();
    // Test that it was projected correctly.
    expect(page.projectedButton.parentElement.classList.contains('user-buttons')).toBeTruthy();
  });

  function createComponent() {
    fixture = TestBed.createComponent(WrapperComponent);
    wrapper = fixture.componentInstance;
    fixture.detectChanges();

    return fixture.whenStable().then(() => {
      fixture.detectChanges();
      page = new Page(fixture);
    });
  }

});

class Page {
  public actions: WysiwygActionsComponent;
  public editor: WysiwygEditorComponent;
  public wysiwyg: WysiwygComponent;
  public editable: HTMLDivElement;
  public editorDe: DebugElement;
  public wysiwygDe: DebugElement;
  public projectedButton: HTMLButtonElement;

  constructor(fixture: ComponentFixture<WrapperComponent>) {
    const wysiwygDe = fixture.debugElement.query(By.directive(WysiwygComponent));
    this.wysiwyg = wysiwygDe.componentInstance;
    this.wysiwygDe = wysiwygDe;
    const actionsDe = wysiwygDe.query(By.directive(WysiwygActionsComponent));
    this.actions = actionsDe.componentInstance;
    const editorDe = wysiwygDe.query(By.directive(WysiwygEditorComponent));
    this.editorDe = editorDe;
    this.editor = editorDe.componentInstance;
    const editableDe = editorDe.query(By.css('.sto-wysiwyg__editor'));
    this.editable = editableDe.nativeElement;
    this.projectedButton = wysiwygDe.query(By.css('#submit')).nativeElement;
  }
}
