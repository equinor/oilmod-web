import { Component, OnInit } from '@angular/core';
import { ConfirmService } from '@ngx-stoui/common';
import { HttpClient } from '@angular/common/http';
import showdown from 'showdown';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { DocsService } from '../docs/docs.service';
import { MatTabChangeEvent } from '@angular/material/tabs';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import hljs from 'highlight.js';

showdown.extension('highlight', function () {
  return [ {
    type: 'output',
    filter: function (text, converter, options) {
      const left = '<pre><code\\b[^>]*>',
        right = '</code></pre>',
        flags = 'g';
      const replacement = function (wholeMatch, match, left, right) {
        const unescaped = match.replace(/&lt;/g, '<')
          .replace(/&gt;/g, '>');
        const lang = ( left.match(/class=\"([^ \"]+)/) || [] )[ 1 ];
        left = left.slice(0, 18) + 'hljs ' + left.slice(18);
        if ( lang && hljs.getLanguage(lang) ) {
          return left + hljs.highlight(lang, unescaped).value + right;
        } else {
          return left + hljs.highlightAuto(unescaped).value + right;
        }
      };
      return showdown.helper.replaceRecursiveRegExp(text, replacement, left, right, flags);
    }
  } ];
});

@Component({
  selector: 'app-common',
  templateUrl: './common.component.html',
  styleUrls: [ './common.component.scss' ],
  providers: [ ConfirmService ]
})
export class CommonComponent implements OnInit {
  public docs: { [ key: string ]: SafeHtml } = {};
  converter: any;
  severity: 'error' | 'info' | 'warning' = 'warning';
  loading: boolean;

  onTabChange(event: MatTabChangeEvent) {
    const i = event.index;
    if ( !this.docs[ event.index ] ) {
      let obs: Observable<SafeHtml>;
      switch ( event.index ) {
        case 0:
          obs = this.getDocs('sto-filter-panel.component.md');
          break;
        case 1:
          obs = this.getDocs('sto-message-panel.component.md');
          break;
        case 2:
          obs = this.getDocs('sto-action-footer.component.md');
          break;
      }
      obs.subscribe(
        doc => this.docs[ i ] = doc,
        err => this.docs[ i ] = this.sanitizer.bypassSecurityTrustHtml(`<p>No docs exists</p>`)
      );
    }

  }

  onDismiss() {
    this.confirmSvc.confirm(`You dismissed an error, well done!`, null, `Close`);
  }

  getDocs(name: string) {
    return this.http.get(`/assets/docs/${name}`, { responseType: 'text' })
      .pipe(
        map(doc => this.converter.makeHtml(doc)),
        map(doc => doc.replace(/&amp;/g, '&')),
        map(doc => this.sanitizer.bypassSecurityTrustHtml(doc))
      );
  }

  constructor(
    private confirmSvc: ConfirmService
    , private http: HttpClient
    , private docService: DocsService
    , private sanitizer: DomSanitizer
  ) {
  }

  ngOnInit() {
    this.converter = new showdown.Converter({ extensions: [ 'highlight' ] });
    this.onTabChange({ index: 0 } as MatTabChangeEvent);
  }

}
