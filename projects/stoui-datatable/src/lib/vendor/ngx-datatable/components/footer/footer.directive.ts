import { ContentChild, Directive, Input, TemplateRef } from '@angular/core';
import { DataTableFooterTemplateDirective } from './footer-template.directive';

@Directive({ selector: 'ngx-datatable-footer' })
export class DatatableFooterDirective {

  @Input() footerHeight: number;
  @Input() totalMessage: string;
  @Input() selectedMessage: string | boolean;
  @Input() pagerLeftArrowIcon: string;
  @Input() pagerRightArrowIcon: string;
  @Input() pagerPreviousIcon: string;
  @Input() pagerNextIcon: string;

  @ContentChild(DataTableFooterTemplateDirective, { read: TemplateRef, static: true })
  template: TemplateRef<any>;

}
