import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  forwardRef,
  Input,
  NgZone,
  OnDestroy,
  ViewChild,
  ViewEncapsulation
} from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { fromEvent, merge, Subject } from 'rxjs';
import { debounceTime, filter, takeUntil } from 'rxjs/operators';
import { WysiwygEditorComponent } from './wysiwyg-editor/wysiwyg-editor.component';
import { Modifiers, validCommands } from './modifiers';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'sto-wysiwyg',
  templateUrl: './wysiwyg.component.html',
  styleUrls: [ './wysiwyg.component.scss' ],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => WysiwygComponent),
      multi: true
    }
  ],
})
export class WysiwygComponent implements AfterViewInit, OnDestroy, ControlValueAccessor {
  @Input('readonly')
  disabled: boolean;
  private destroyed$ = new Subject<boolean>();
  @ViewChild(WysiwygEditorComponent, { static: true, read: ElementRef })
  editor: ElementRef<HTMLDivElement>;
  public value: SafeHtml;
  public active = [];
  public propagateChange: any;
  public onTouched: any;

  constructor(private domSanitizer: DomSanitizer, private zone: NgZone, private cdr: ChangeDetectorRef) {
  }

  ngAfterViewInit() {
    this.listenForSelectEvents();
  }

  ngOnDestroy(): void {
    this.destroyed$.next(true);
    this.destroyed$.complete();
  }

  private listenForSelectEvents() {
    merge(
      fromEvent(this.editor.nativeElement, 'mouseup'),
      fromEvent(this.editor.nativeElement, 'keyup')
        .pipe(
          filter((ev: KeyboardEvent) => ( ev.ctrlKey && ev.key === 'A' ) || ( /Arrow/.test(ev.key) ))
        )
    ).pipe(debounceTime(200), takeUntil(this.destroyed$))
      .subscribe(ev => {
        this.active = Modifiers.getActiveModifiers();
        this.cdr.detectChanges();
      });
  }

  execute(method: string) {
    if ( !validCommands.includes(method) ) {
      return;
    }
    const showUi = method === 'createLink';
    if ( showUi ) {
      const url = window.prompt('url');
      if ( !!url ) {
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
      this.value = this.domSanitizer.bypassSecurityTrustHtml(value);
      this.cdr.detectChanges();
    }
  }

  registerOnChange(fn: any): void {
    this.propagateChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
    this.cdr.detectChanges();
  }

  valueChanged(value: string) {
    this.propagateChange(value);
  }
}
