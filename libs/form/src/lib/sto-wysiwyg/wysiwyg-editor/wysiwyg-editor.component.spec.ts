import { ComponentFixture, fakeAsync, TestBed, tick, waitForAsync } from '@angular/core/testing';

import { WysiwygEditorComponent } from './wysiwyg-editor.component';

class TestEvent<T> extends CustomEvent<T> {
  public target: HTMLDivElement;

  constructor(typeArg: string, eventInitDict?: CustomEventInit<T>) {
    super(typeArg, eventInitDict);
  }
}

describe('WysiwygEditorComponent', () => {
  let component: WysiwygEditorComponent;
  let fixture: ComponentFixture<WysiwygEditorComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
        imports: [ WysiwygEditorComponent ]
      })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WysiwygEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should toggle the contenteditable attribute when readonly is true / falsy', () => {
    const el = component.editor.nativeElement;
    expect(component.readonly).toBeFalsy();
    expect(el.getAttribute('contentEditable')).toEqual('true');
    component.readonly = true;
    fixture.detectChanges();
    expect(el.getAttribute('contentEditable')).toEqual('false');
    ( component as any ).readonly = 'true';
    expect(component.readonly).toBeTruthy();
    fixture.detectChanges();
    expect(el.getAttribute('contentEditable')).toEqual('false');
    ( component.readonly as unknown as null ) = null;
    fixture.detectChanges();
    expect(el.getAttribute('contentEditable')).toEqual('true');
    ( component.readonly as unknown as undefined ) = undefined;
    fixture.detectChanges();
    expect(el.getAttribute('contentEditable')).toEqual('true');
  });

  it('should emit valueChanged when input event occurs', fakeAsync(() => {
    const ev = new TestEvent('input');
    const el = component.editor.nativeElement;
    el.innerHTML = '<h1>SomeStuff</h1>';
    const spy = jest.spyOn(component.valueChanged, 'emit');
    el.dispatchEvent(ev);
    tick(320);
    expect(spy).toHaveBeenCalledWith('<h1>SomeStuff</h1>');
  }));

  // Broken in jsdom
  /*  it('should show a warning if pasted html contains an image tag', () => {
      const el = component.editor.nativeElement;
      // set cursor inside editor
      const range = document.createRange();
      range.selectNodeContents(el);
      const sel = document.getSelection();
      sel?.removeAllRanges();
      sel?.addRange(range);

      const spy = jest.spyOn(component, 'onPaste');
      const paste = `<h1>Heading</h1><div><img src="An Image"></div><p>Some text</p>`;
      const pasteData = new DataTransfer();
      pasteData.setData('text/html', paste);
      const ev = new ClipboardEvent('paste', {
        clipboardData: pasteData
      });
      el.dispatchEvent(ev);
      fixture.detectChanges();
      expect(spy).toHaveBeenCalled();
      expect(component.warning).toBeTruthy();
    });*/
});
