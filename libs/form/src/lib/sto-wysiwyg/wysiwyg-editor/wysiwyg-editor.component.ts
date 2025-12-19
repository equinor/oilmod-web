import {
  afterNextRender,
  Component,
  DestroyRef,
  effect,
  ElementRef,
  inject,
  input,
  NgZone,
  output,
  signal,
  viewChild,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { fromEvent } from 'rxjs';
import { debounceTime } from 'rxjs/operators';

@Component({
  selector: 'sto-wysiwyg-editor',
  templateUrl: './wysiwyg-editor.component.html',
  styleUrl: './wysiwyg-editor.component.scss',
  imports: [],
})
export class WysiwygEditorComponent {
  private readonly zone = inject(NgZone);
  private readonly destroyRef = inject(DestroyRef);

  readonly content = input<string>();
  readonly readonly = input(false);
  readonly editor = viewChild.required<ElementRef<HTMLDivElement>>('editor');
  readonly valueChanged = output<string>();

  protected readonly warning = signal<string | null>(null);

  private isUpdatingFromUser = false;

  constructor() {
    afterNextRender(() => {
      this.setupInputListener();
    });

    // Handle content updates
    effect(() => {
      const newContent = this.content();
      const editorEl = this.editor()?.nativeElement;

      if (newContent !== undefined && editorEl && !this.isUpdatingFromUser) {
        this.updateContentIfChanged(newContent);
      }
    });
  }

  private setupInputListener() {
    const editorEl = this.editor().nativeElement;
    fromEvent(editorEl, 'input')
      .pipe(debounceTime(100), takeUntilDestroyed(this.destroyRef))
      .subscribe((ev) => {
        this.warning.set(null);
        this.isUpdatingFromUser = true;
        this.valueChanged.emit((ev.target as HTMLElement).innerHTML);
        Promise.resolve().then(() => {
          this.isUpdatingFromUser = false;
        });
      });
  }

  private updateContentIfChanged(newContent: string) {
    const editorEl = this.editor()?.nativeElement;
    if (!editorEl) return;

    const currentContent = editorEl.innerHTML;
    if (currentContent !== newContent) {
      // Save selection position before updating
      const selection = window.getSelection();
      const selectionInfo = this.saveSelection(editorEl, selection);

      editorEl.innerHTML = newContent;

      // Restore selection after updating
      if (selectionInfo) {
        this.restoreSelection(editorEl, selection, selectionInfo);
      }
    }
  }

  private saveSelection(
    editorEl: HTMLElement,
    selection: Selection | null,
  ): { start: number; end: number } | null {
    if (!selection || selection.rangeCount === 0) return null;

    const range = selection.getRangeAt(0);
    if (!editorEl.contains(range.commonAncestorContainer)) return null;

    const preSelectionRange = range.cloneRange();
    preSelectionRange.selectNodeContents(editorEl);
    preSelectionRange.setEnd(range.startContainer, range.startOffset);
    const start = preSelectionRange.toString().length;

    const end = start + range.toString().length;

    return { start, end };
  }

  private restoreSelection(
    editorEl: HTMLElement,
    selection: Selection | null,
    selectionInfo: { start: number; end: number },
  ) {
    if (!selection) return;

    let charIndex = 0;
    const range = document.createRange();
    range.setStart(editorEl, 0);
    range.collapse(true);
    const nodeStack: Node[] = [editorEl];
    let node: Node | undefined;
    let foundStart = false;
    let stop = false;

    while (!stop && (node = nodeStack.pop())) {
      if (node.nodeType === Node.TEXT_NODE) {
        const textNode = node as Text;
        const nextCharIndex = charIndex + textNode.length;
        if (
          !foundStart &&
          selectionInfo.start >= charIndex &&
          selectionInfo.start <= nextCharIndex
        ) {
          range.setStart(textNode, selectionInfo.start - charIndex);
          foundStart = true;
        }
        if (
          foundStart &&
          selectionInfo.end >= charIndex &&
          selectionInfo.end <= nextCharIndex
        ) {
          range.setEnd(textNode, selectionInfo.end - charIndex);
          stop = true;
        }
        charIndex = nextCharIndex;
      } else {
        let i = node.childNodes.length;
        while (i--) {
          nodeStack.push(node.childNodes[i]);
        }
      }
    }

    try {
      selection.removeAllRanges();
      selection.addRange(range);
    } catch (e) {
      // Selection restoration failed, ignore
    }
  }

  onPaste(event: ClipboardEvent) {
    if (this.readonly()) {
      return;
    }
    if (!event.clipboardData) {
      return;
    }
    const img = event.clipboardData.files.item(0);
    if (img?.type.includes('image')) {
      this.insertImage(img);
    } else if (!img) {
      this.pasteText(event);
    }
  }

  onDrop(event: DragEvent) {
    if (this.readonly() || !event.dataTransfer) {
      return;
    }
    if (event.dataTransfer.types.includes('Files')) {
      event.preventDefault();
      const img = event.dataTransfer.files.item(0);
      if (img) {
        this.insertImage(img);
      }
    }
  }

  private pasteText(event: ClipboardEvent) {
    if (!event.clipboardData) {
      return;
    }
    const html = event.clipboardData.getData('text/html');
    const hasImage: boolean = /<img/.test(html);
    if (hasImage) {
      event.preventDefault();
      this.warning.set(
        'Some images were not included due to browser security around mixed content. Try to paste the image separately.',
      );
      const stripped = this.stripImageSection(html);
      const el = document.createElement('div');
      el.innerHTML = stripped;
      const sel = document.getSelection();
      if (!sel) {
        return;
      }
      const range = sel.getRangeAt(0);
      range.deleteContents();
      range.insertNode(el);
      sel.removeAllRanges();
      range.collapse();
      sel.addRange(range);
    }
  }

  private stripImageSection(html: string) {
    const div = document.createElement('div');
    div.innerHTML = html;
    const images = div.querySelectorAll('img');
    Array.from(images).forEach((image) => {
      let el = image as HTMLElement;
      while (el.parentElement && el.parentElement !== div) {
        el = el.parentElement;
      }
      div.removeChild(el);
    });
    return div.innerHTML;
  }

  private insertImage(img: File) {
    const fr = new FileReader();
    fr.onloadend = (loadEvent) => {
      this.zone.runOutsideAngular(() => {
        const editorEl = this.editor().nativeElement;
        const res = (loadEvent.currentTarget as FileReader).result as string;
        const el = document.createElement('img');
        el.title = `${img.name}`;
        el.src = res;
        el.style.maxHeight = '300px';
        const sel = document.getSelection();
        if (!sel) {
          return;
        }
        const range = sel.getRangeAt(0);
        const cont = range.endContainer;
        if (!editorEl.contains(cont)) {
          range.setStart(editorEl, 0);
        }
        range.deleteContents();
        range.insertNode(el);
        sel.removeAllRanges();
        range.collapse();
        sel.addRange(range);
        this.valueChanged.emit(editorEl.innerHTML);
        this.warning.set(null);
      });
    };
    fr.readAsDataURL(img);
  }
}
