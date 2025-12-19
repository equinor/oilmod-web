import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import {
  ChangeDetectionStrategy,
  Component,
  DebugElement,
} from '@angular/core';
import { ReactiveFormsModule, UntypedFormControl } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { WysiwygActionsComponent } from './wysiwyg-actions/wysiwyg-actions.component';
import { WysiwygEditorComponent } from './wysiwyg-editor/wysiwyg-editor.component';
import { WysiwygComponent } from './wysiwyg.component';

@Component({
  selector: 'sto-wrap',
  standalone: true,
  template: ` <sto-wysiwyg [formControl]="ctrl">
    <button id="submit">SaveButton</button>
  </sto-wysiwyg>`,
  imports: [
    ReactiveFormsModule,
    WysiwygComponent,
    WysiwygEditorComponent,
    WysiwygActionsComponent,
  ],
})
class WrapperComponent {
  public ctrl = new UntypedFormControl();

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

  beforeEach(waitForAsync(() => {
    // Mock document methods
    document.execCommand = jest.fn();
    document.queryCommandState = jest.fn();

    TestBed.configureTestingModule({
      imports: [
        WysiwygComponent,
        WysiwygEditorComponent,
        WysiwygActionsComponent,
      ],
    }).compileComponents();
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
    const spy = jest.spyOn(document, 'execCommand');
    component.execute('bold');
    expect(spy).toHaveBeenCalled();
    component.execute('formatDocument');
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('should execute [in|out]dent when onKeyDownHandleTab is called with tab', () => {
    const spy = jest.spyOn(component, 'execute');

    const ev = {
      key: 'Tab',
      shiftKey: false,
      preventDefault: () => {},
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

  it('should set value signal when writeValue is called', () => {
    const html = `<h1>A Header</h1>`;
    component.writeValue(html);
    expect(component['value']()).toEqual(html);
    expect(component['sanitizedValue']()).toEqual(html);
  });

  it('should set the component as readonly when setDisabledState is called', () => {
    expect(component['isDisabled']()).toBeFalsy();
    component.setDisabledState(true);
    expect(component['isDisabled']()).toBeTruthy();
    component.setDisabledState(false);
    expect(component['isDisabled']()).toBeFalsy();
  });
});

describe('WysiwygComponent integration tests', () => {
  let wrapper: WrapperComponent;
  let fixture: ComponentFixture<WrapperComponent>;
  let page: Page;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        ReactiveFormsModule,
        WysiwygComponent,
        WysiwygEditorComponent,
        WysiwygActionsComponent,
        WrapperComponent,
      ],
    })
      .overrideComponent(WysiwygComponent, {
        set: { changeDetection: ChangeDetectionStrategy.Default },
      })
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
    expect(page.wysiwyg['value']()).toEqual(`<h1>A title!</h1>`);
    expect(page.wysiwyg['sanitizedValue']()).toEqual(`<h1>A title!</h1>`);
  });

  it('should update value from wysiwyg to wrapper', () => {
    expect(wrapper.ctrl.value).toBeFalsy();
    const value = `<h1>Heading</h1>`;
    page.wysiwyg.valueChanged(value);
    expect(wrapper.ctrl.value).toEqual(value);
  });

  it('should toggle contenteditable attribute in editor when ctrl is disabled / enabled', () => {
    expect(page.editable.getAttribute('contenteditable')).toEqual('true');
    expect(page.editor.readonly()).toBeFalsy();
    expect(page.wysiwyg['isDisabled']()).toBeFalsy();
    const spy = jest.spyOn(page.wysiwyg, 'setDisabledState');
    wrapper.disable();
    fixture.detectChanges();
    expect(spy).toHaveBeenCalled();
    expect(page.wysiwyg['isDisabled']()).toBeTruthy();
    expect(page.editor.readonly()).toBeTruthy();
    expect(page.editable.getAttribute('contenteditable')).toEqual('false');
    wrapper.enable();
    fixture.detectChanges();
    expect(page.editable.getAttribute('contenteditable')).toEqual('true');
  });

  it('should project a button', () => {
    expect(page.projectedButton).toBeTruthy();
    // Test that it was projected correctly.
    expect(
      page.projectedButton.parentElement?.classList.contains('user-buttons'),
    ).toBeTruthy();
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
    const wysiwygDe = fixture.debugElement.query(
      By.directive(WysiwygComponent),
    );
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
