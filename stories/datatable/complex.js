import {storiesOf} from '@storybook/angular';
import {boolean, number, withKnobs} from "@storybook/addon-knobs/angular";
import {fixedColumns, rows} from './rows';
import {action} from "@storybook/addon-actions";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {MatCardModule} from "@angular/material/card";
import {NgxDatatableModule} from '@swimlane/ngx-datatable'

const stories = storiesOf('Swimlanes Ngx-Datatable', module)
  .addDecorator(withKnobs);


stories
  .add('Basic usage', () => ({
    moduleMetadata: {
      declarations: [],
      imports: [NgxDatatableModule, MatCardModule, BrowserAnimationsModule]
    },
    template: `<mat-card>
<mat-card-title><h2>This replaces StoComplexDatatable and is only here for CSS</h2></mat-card-title>
<ngx-datatable [loadingIndicator]="loading"
[selectionType]="'single'"
[scrollbarV]="true"
[scrollbarH]="horizontalScroll"
[style.height.px]="height"
[rowHeight]="rowHeight"
[headerHeight]="headerHeight"
[class.sto-datatable]="withCss"
[rows]="rows"
[columns]="columns"></ngx-datatable>
</mat-card>`,
    props: {
      rows,
      columns: fixedColumns,
      select: action('Selection made'),
      contextMenu: action('Context menu'),
      selected: null,
      loading: boolean('Loading', false),
      horizontalScroll: boolean('Horizontal scroll', false),
      footerRow: {allocated: 'Over 9000'},
      withCss: boolean('Use css', true),
      height: number('Height', 400),
      rowHeight: number('Rowheight', 40),
      headerHeight: number('Headerheight', 36),
      theme: () => document.body.classList.toggle('sto-dark-theme'),
      columnGroups: [
        {name: 'First group', columnStart: 1, columnEnd: 3},
        {name: 'Second group', columnStart: 4, columnEnd: 6},
        {name: 'Third group', columnStart: 7, columnEnd: 9},
      ],
    }
    }),
    {notes: 'Usage @ https://swimlane.github.io/ngx-datatable'}
  );
