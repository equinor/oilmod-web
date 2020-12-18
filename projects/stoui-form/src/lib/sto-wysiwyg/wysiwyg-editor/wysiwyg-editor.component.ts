import { AfterViewInit, Component, ElementRef, EventEmitter, Input, NgZone, OnDestroy, Output, ViewChild } from '@angular/core';
import { SafeHtml } from '@angular/platform-browser';
import { fromEvent, Subject } from 'rxjs';
import { debounceTime, takeUntil } from 'rxjs/operators';

@Component({
  selector: 'sto-wysiwyg-editor',
  templateUrl: './wysiwyg-editor.component.html',
  styleUrls: [ './wysiwyg-editor.component.scss' ]
})
export class WysiwygEditorComponent implements AfterViewInit, OnDestroy {
  @Input()
  content: SafeHtml;
  @Input()
  readonly: boolean;
  @ViewChild('editor')
  editor: ElementRef<HTMLDivElement>;
  @Output()
  valueChanged = new EventEmitter<string>();
  public warning: string;

  private destroyed$ = new Subject<boolean>();

  constructor(private zone: NgZone) {
  }


  ngOnDestroy(): void {
    this.destroyed$.next(true);
    this.destroyed$.complete();
  }

  ngAfterViewInit() {
    this.listenForValueChange();
  }

  private listenForValueChange() {
    fromEvent(this.editor.nativeElement, 'input')
      .pipe(
        debounceTime(100),
        takeUntil(this.destroyed$)
      ).subscribe(ev => {
      this.warning = null;
      this.valueChanged.emit(( ev.target as any ).innerHTML);
    });
  }

  onPaste(event: ClipboardEvent) {
    if ( this.readonly ) {
      return;
    }
    const img = event.clipboardData.files.item(0);
    if ( !!img && img.type.includes('image') ) {
      // event.preventDefault();
      this.insertImage(img);
    } else if ( !img ) {
      this.pasteText(event);
    }
  }

  private pasteText(event: ClipboardEvent) {
    const html = event.clipboardData.getData('text/html');
    const hasImage: boolean = /\<img/.test(html);
    if ( hasImage ) {
      event.preventDefault();
      this.warning = `Some images were not included due to browser security around mixed content. Try to paste the image separately.`;
      const stripped = this.stripImageSection(html);
      const el = document.createElement('div');
      el.innerHTML = stripped;
      const sel = document.getSelection();
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
    Array.from(images)
      .forEach(image => {
        let el = image as HTMLElement;
        while ( el.parentElement !== div ) {
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
        const res = ( loadEvent.currentTarget as any ).result;
        const el = document.createElement('img');
        el.title = `${img.name}`;
        el.src = res;
        el.style.maxHeight = '300px';
        const sel = document.getSelection();
        const range = sel.getRangeAt(0);
        const cont = range.endContainer;
        if ( !this.editor.nativeElement.contains(cont) ) {
          range.setStart(this.editor.nativeElement, 0);
        }
        range.deleteContents();
        range.insertNode(el);
        sel.removeAllRanges();
        range.collapse();
        sel.addRange(range);
        this.valueChanged.emit(this.editor.nativeElement.innerHTML);
        this.warning = null;
      });
    };
    fr.readAsDataURL(img);
  }

  onDrop(event: DragEvent) {
    if ( this.readonly ) {
      return;
    }
    if ( event.dataTransfer.types.includes('Files') ) {
      event.preventDefault();
      const img = event.dataTransfer.files.item(0);
      this.insertImage(img);
    }
  }
}
