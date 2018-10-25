import { Directive, TemplateRef, Input } from '@angular/core';

@Directive({selector: 'ngx-datatable-group'})
export class StoDataTableColumnGroupDirective {

  @Input() name?: string;
  @Input() properties?: string[];
  @Input() frozenLeft: any;
  @Input() frozenRight: any;
  @Input() headerTemplate?: TemplateRef<any>;
   @Input() headerClass?: any;
  //@Input()
  //@ContentChild(DataTableColumnHeaderDirective, { read: TemplateRef })
  //headerTemplate: TemplateRef<any>;

}
