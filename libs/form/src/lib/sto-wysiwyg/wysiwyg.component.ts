import {
  afterNextRender,
  ChangeDetectionStrategy,
  Component,
  computed,
  DestroyRef,
  ElementRef,
  inject,
  input,
  SecurityContext,
  signal,
  viewChild,
  ViewEncapsulation,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { fromEvent, merge } from 'rxjs';
import { debounceTime, filter } from 'rxjs/operators';
import { Modifiers, validCommands } from './modifiers';
import { WysiwygActionsComponent } from './wysiwyg-actions/wysiwyg-actions.component';
import { WysiwygEditorComponent } from './wysiwyg-editor/wysiwyg-editor.component';

@Component({
  selector: 'sto-wysiwyg',
  templateUrl: './wysiwyg.component.html',
  styleUrl: './wysiwyg.component.scss',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: WysiwygComponent,
      multi: true,
    },
  ],
  imports: [WysiwygActionsComponent, WysiwygEditorComponent],
})
export class WysiwygComponent implements ControlValueAccessor {
  private readonly domSanitizer = inject(DomSanitizer);
  private readonly destroyRef = inject(DestroyRef);

  readonly readonly = input(false);
  readonly editor = viewChild.required(WysiwygEditorComponent, {
    read: ElementRef<HTMLDivElement>,
  });

  private readonly disabledState = signal(false);
  protected readonly isDisabled = computed(
    () => this.readonly() || this.disabledState(),
  );

  protected readonly value = signal<string>('');
  protected readonly sanitizedValue = computed(() => {
    const val = this.value();
    if (!val) return '';
    return this.domSanitizer.sanitize(SecurityContext.HTML, val) ?? '';
  });
  protected readonly active = signal<string[]>([]);

  private onTouched = () => {};
  private onChange = (_value: string) => {};

  constructor() {
    afterNextRender(() => {
      this.setupSelectionTracking();
    });
  }

  execute(method: string) {
    if (!validCommands.includes(method)) {
      return;
    }

    if (method === 'createLink') {
      const url = window.prompt('url');
      if (url) {
        document.execCommand(method, false, url);
      }
    } else if (method === 'insertImage') {
      this.insertImage();
      return;
    } else {
      document.execCommand(method, false, '');
    }

    this.updateActiveModifiers();
  }

  insertImage() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = (e: Event) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
          const img = `<img src="${event.target?.result}" style="max-height: 300px;" />`;
          document.execCommand('insertHTML', false, img);
          this.updateActiveModifiers();
        };
        reader.readAsDataURL(file);
      }
    };
    input.click();
  }

  onKeyDownHandleTab(event: KeyboardEvent) {
    if (event.key === 'Tab') {
      event.preventDefault();
      const method = event.shiftKey ? 'outdent' : 'indent';
      this.execute(method);
    }
  }

  writeValue(value: string): void {
    this.value.set(value ?? '');
  }

  registerOnChange(fn: (value: string) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabledState.set(isDisabled);
  }

  valueChanged(value: string) {
    this.value.set(value);
    this.onChange(value);
  }

  private setupSelectionTracking() {
    const editorEl = this.editor().nativeElement;

    merge(
      fromEvent(editorEl, 'mouseup'),
      fromEvent<KeyboardEvent>(editorEl, 'keyup').pipe(
        filter((ev) => (ev.ctrlKey && ev.key === 'A') || /Arrow/.test(ev.key)),
      ),
    )
      .pipe(debounceTime(200), takeUntilDestroyed(this.destroyRef))
      .subscribe(() => {
        this.updateActiveModifiers();
      });
  }

  private updateActiveModifiers() {
    this.active.set(Modifiers.getActiveModifiers());
  }
}
