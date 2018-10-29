import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import showdown from 'showdown';
import { DomSanitizer } from '@angular/platform-browser';
import { MatDialog } from '@angular/material';
import { DocsComponent } from './docs.component';

@Injectable()
export class DocsService {
  public docs = new Subject<string | null>();
  constructor(private sanitizer: DomSanitizer, private dialog: MatDialog) {
    const converter = new showdown.Converter();
    this.docs.asObservable()
      .pipe(
        map(doc => doc ? converter.makeHtml(doc) : null),
        filter(doc => !!doc)
      ).subscribe(doc => {
        if (doc) {
          const sanitized = this.sanitizer.bypassSecurityTrustHtml(doc);
          const ref = this.dialog.open(DocsComponent, {
            panelClass: 'sto-dialog',
            data: sanitized
          });
          ref.afterClosed()
            .subscribe(() => this.docs.next(null));
        }
    });
  }
}
