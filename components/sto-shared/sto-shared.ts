import {
  Component,
  ContentChildren,
  Directive,
  Input,
  NgModule,
  QueryList,
  TemplateRef,
  ViewContainerRef
} from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  Column,
  ColumnBodyTemplateLoader,
  ColumnEditorTemplateLoader,
  ColumnFilterTemplateLoader,
  ColumnHeaderTemplateLoader,
  FooterColumnGroup,
  Row,
  TemplateLoader,
  TemplateWrapper,
  ColumnFooterTemplateLoader,
  HeaderColumnGroup
} from '../../vendor/primeface/components/common/shared';

@Component({
  selector: 'sto-header',
  template: '<ng-content></ng-content>'
})
export class StoHeader {
}

@Component({
  selector: 'sto-footer',
  template: '<ng-content></ng-content>'
})
export class StoFooter {
}

@Directive({
  selector: '[stoTemplate]',
  host: {}
})
export class StoTemplate {

  @Input() type: string;

  @Input('stoTemplate') name: string;

  constructor(public template: TemplateRef<any>) {
  }

  getType(): string {
    return this.name;
  }
}

@Directive({
  selector: '[stoTemplateWrapper]'
})
export class StoTemplateWrapper extends TemplateWrapper {

  @Input('stoTemplateWrapper') templateRef: TemplateRef<any>;

}

@Component({
  selector: 'sto-column',
  template: ``
})
export class StoColumn extends Column {

  @ContentChildren(StoTemplate) templates: QueryList<any>;

}

@Component({
  selector: 'sto-row',
  template: ``
})
export class StoRow extends Row {

  @ContentChildren(StoColumn) columns: QueryList<Column>;

}

@Component({
  selector: 'sto-headerColumnGroup',
  template: ``
})
export class StoHeaderColumnGroup extends HeaderColumnGroup {

  @ContentChildren(StoRow) rows: QueryList<any>;
}

@Component({
  selector: 'sto-footerColumnGroup',
  template: ``
})
export class StoFooterColumnGroup extends FooterColumnGroup {

  @ContentChildren(StoRow) rows: QueryList<any>;
}

@Component({
  selector: 'sto-columnBodyTemplateLoader',
  template: ``
})
export class StoColumnBodyTemplateLoader extends ColumnBodyTemplateLoader {

}

@Component({
  selector: 'sto-columnHeaderTemplateLoader',
  template: ``
})
export class StoColumnHeaderTemplateLoader extends ColumnHeaderTemplateLoader {
}

@Component({
  selector: 'sto-columnFooterTemplateLoader',
  template: ``
})
export class StoColumnFooterTemplateLoader extends ColumnFooterTemplateLoader {

}

@Component({
  selector: 'sto-columnFilterTemplateLoader',
  template: ``
})
export class StoColumnFilterTemplateLoader extends ColumnFilterTemplateLoader {
}

@Component({
  selector: 'sto-columnEditorTemplateLoader',
  template: ``
})
export class StoColumnEditorTemplateLoader extends ColumnEditorTemplateLoader {

}

@Component({
  selector: 'sto-templateLoader',
  template: ``
})
export class StoTemplateLoader extends TemplateLoader {

}

@NgModule({
  imports: [CommonModule],
  exports: [StoHeader, StoFooter, StoColumn, StoTemplateWrapper, StoColumnHeaderTemplateLoader, StoColumnBodyTemplateLoader, StoColumnFooterTemplateLoader, StoColumnFilterTemplateLoader, StoTemplate, StoTemplateLoader, StoRow, StoHeaderColumnGroup, StoFooterColumnGroup, StoColumnEditorTemplateLoader],
  declarations: [StoHeader, StoFooter, StoColumn, StoTemplateWrapper, StoColumnHeaderTemplateLoader, StoColumnBodyTemplateLoader, StoColumnFooterTemplateLoader, StoColumnFilterTemplateLoader, StoTemplate, StoTemplateLoader, StoRow, StoHeaderColumnGroup, StoFooterColumnGroup, StoColumnEditorTemplateLoader],
})
export class StoSharedModule {
}
