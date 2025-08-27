import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, forwardRef, Input, NgZone, OnDestroy, SecurityContext, ViewChild, ViewEncapsulation, inject } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { fromEvent, merge, Subject } from 'rxjs';
import { debounceTime, filter, takeUntil } from 'rxjs/operators';
import { WysiwygEditorComponent } from './wysiwyg-editor/wysiwyg-editor.component';
import { Modifiers, validCommands } from './modifiers';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { WysiwygActionsComponent } from './wysiwyg-actions/wysiwyg-actions.component';

@Component({
    selector: 'sto-wysiwyg',
    templateUrl: './wysiwyg.component.html',
    styleUrls: ['./wysiwyg.component.scss'],
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => WysiwygComponent),
            multi: true
        }
    ],
    imports: [
        WysiwygActionsComponent,
        WysiwygEditorComponent
    ]
})
export class WysiwygComponent implements AfterViewInit, OnDestroy, ControlValueAccessor {
  private domSanitizer = inject(DomSanitizer);
  private zone = inject(NgZone);
  private cdr = inject(ChangeDetectorRef);

  // eslint-disable-next-line @angular-eslint/no-input-rename
  @Input('readonly')
  disabled: boolean;
  @ViewChild(WysiwygEditorComponent, { read: ElementRef })
  editor: ElementRef<HTMLDivElement>;
  public value: SafeHtml;
  public active: string[] = [];
  public onTouched: unknown;
  private destroyed$ = new Subject<boolean>();

  ngAfterViewInit() {
    this.listenForSelectEvents();
  }

  ngOnDestroy(): void {
    this.destroyed$.next(true);
    this.destroyed$.complete();
  }

  execute(method: string) {
    if ( !validCommands.includes(method) ) {
      return;
    }
    const showUi = method === 'createLink';
    if ( showUi ) {
      const url = window.prompt('url');
      if ( url ) {
        document.execCommand(method, false, url);
      }
    } else {
      document.execCommand(method, false, '');
    }
    this.active = Modifiers.getActiveModifiers();
    this.cdr.detectChanges();
  }

  onKeyDownHandleTab(event: KeyboardEvent) {
    if ( event.key === 'Tab' ) {
      event.preventDefault();
      let method: string;
      if ( event.shiftKey ) {
        method = 'outdent';
      } else {
        method = 'indent';
      }
      this.execute(method);
    }
  }

  writeValue(value: string): void {
    if ( value ) {
      const sanitized = this.domSanitizer.sanitize(SecurityContext.HTML, value) ?? '';
      this.value = this.domSanitizer.bypassSecurityTrustHtml(sanitized);
      this.cdr.detectChanges();
    }
  }

  // eslint-disable-next-line
  propagateChange = (value: unknown) => {
    console.log(value); // To remove eslint warning..
  };

  registerOnChange(fn: never): void {
    this.propagateChange = fn;
  }

  registerOnTouched(fn: unknown): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
    this.cdr.detectChanges();
  }

  valueChanged(value: string) {
    this.propagateChange(value);
  }

  private listenForSelectEvents() {
    merge(
      fromEvent(this.editor.nativeElement, 'mouseup'),
      fromEvent<KeyboardEvent>(this.editor.nativeElement, 'keyup')
        .pipe(
          filter((ev) => ( ev.ctrlKey && ev.key === 'A' ) || ( /Arrow/.test(ev.key) ))
        )
    ).pipe(debounceTime(200), takeUntil(this.destroyed$))
      .subscribe(() => {
        this.active = Modifiers.getActiveModifiers();
        this.cdr.detectChanges();
      });
  }
}
