import {storiesOf} from '@storybook/angular';
import {boolean, number, withKnobs} from "@storybook/addon-knobs/angular";
import {StoDatatableModule} from "../../projects/stoui-datatable/src/lib/sto-datatable/sto-datatable.module";
import {columns, fixedColumns, rows} from './rows';
import {action} from "@storybook/addon-actions";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {MatCardModule} from "@angular/material/card";

const stories = storiesOf('Datatable - StoDatatable', module)
  .addDecorator(withKnobs);

stories
  .add('Basic usage', () => ({
    moduleMetadata: {
      declarations: [],
      imports: [StoDatatableModule, BrowserAnimationsModule, MatCardModule]
    },
    template: `<mat-card class="sto-card">
<button (click)="theme()">Theme</button>
<sto-datatable [virtualScroll]="vScroll" [selected]="selected"
[columnGroups]="showGroups ? columnGroups : null"
[rowHeight]="rowHeight"
[loading]="loading"
[sortable]="sortable"
[scrollbarH]="horizontalScroll"
[footerRow]="showFooter ? footerRow : null"
[headerHeight]="headerHeight"
(rowContextMenu)="$event.event.preventDefault(); contextMenu($event)"
(select)="select($event); selected = $event.row" [autoSize]="false"
[height]="height" [rows]="rows" [columns]="columns"></sto-datatable>
</mat-card>`,
    props: {
      rows,
      columns: fixedColumns,
      select: action('Selection made'),
      contextMenu: action('Context menu'),
      selected: null,
      loading: boolean('Loading', false),
      vScroll: boolean('Virtual scroll', true),
      horizontalScroll: boolean('Horizontal scroll', false),
      footerRow: {allocated: 'Over 9000'},
      showFooter: boolean('Show footer', false),
      height: number('Height', 400),
      rowHeight: number('Rowheight', 40),
      headerHeight: number('Headerheight', 22),
      sortable: boolean('Sortable', true),
      theme: () => document.body.classList.toggle('sto-dark-theme'),
      columnGroups: [
        {name: 'First group', columnStart: 1, columnEnd: 3},
        {name: 'Second group', columnStart: 4, columnEnd: 6},
        {name: 'Third group', columnStart: 7, columnEnd: 9},
      ],
      showGroups: boolean('Show groups (only with horz scroll and fixed column width)', false)
    }
  }));

stories
  .add('Slim', () => ({
    moduleMetadata: {
      declarations: [],
      imports: [StoDatatableModule]
    },
    template: `<div [style.width.px]="slimView ? breakpoint - 1 : 1000">
<sto-datatable [virtualScroll]="true"
[responsiveBreakPoint]="breakpoint"
[responsive]="true"
[responsiveView]="responsive"
[height]="400"
[rows]="rows"
[columns]="columns"></sto-datatable>
<ng-template #responsive let-row="row">{{ row | json }}</ng-template>
</div>`,
    props: {
      rows,
      columns,
      slimView: boolean('Toggle slim view', true),
      breakpoint: number('Breakpoint for slim view ([breakpoint])', 500),
    }
  }));

stories.add('Automatic height adjustment', () => ({
  moduleMetadata: {
    declarations: [],
    imports: [StoDatatableModule]
  },
  template: `<div (resize)="resize()">
<sto-datatable [virtualScroll]="true" [autoSize]="true" [autoSizeOffset]="autosizeOffset" [height]="height" [rows]="rows" [columns]="columns"></sto-datatable>
</div>`,
  props: {
    rows,
    columns,
    autosizeOffset: number('Bottom offset', 10),
    resize: () => document.dispatchEvent(new Event('resize'))
  }
}));

