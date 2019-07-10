import {storiesOf} from '@storybook/angular';
import {boolean, number, withKnobs} from "@storybook/addon-knobs";
import {StoDatatableModule} from "../../projects/stoui-datatable/src/lib/sto-datatable/sto-datatable.module";
import {columns, rows} from './rows';
import {action} from "@storybook/addon-actions";

const stories = storiesOf('Datatable - StoDatatable', module)
  .addDecorator(withKnobs);

stories
  .add('Basic usage', () => ({
    moduleMetadata: {
      declarations: [],
      imports: [StoDatatableModule]
    },
    template: `<div style="margin: 50px">
<sto-datatable [virtualScroll]="vScroll" [selected]="selected"
[rowHeight]="rowHeight"
[headerHeight]="headerHeight"
(rowContextMenu)="$event.event.preventDefault(); contextMenu($event)"
(select)="select($event); selected = $event.row" [autoSize]="false"
[height]="height" [rows]="rows" [columns]="columns"></sto-datatable>
</div>`,
    props: {
      rows,
      columns,
      select: action('Selection made'),
      contextMenu: action('Context menu'),
      selected: null,
      vScroll: boolean('Virtual scroll', true),
      height: number('Height', 400),
      rowHeight: number('Rowheight', 40),
      headerHeight: number('Headerheight', 22),
    }
  }));

stories
  .add('Slim', () => ({
    moduleMetadata: {
      declarations: [],
      imports: [StoDatatableModule]
    },
    template: `<div style="margin: 50px" [style.width.px]="slimView ? breakpoint - 1 : 1000">
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
  template: `<div style="margin: 50px" (resize)="resize()">
<sto-datatable [virtualScroll]="true" [autoSize]="true" [autoSizeOffset]="autosizeOffset" [height]="height" [rows]="rows" [columns]="columns"></sto-datatable>
</div>`,
  props: {
    rows,
    columns,
    autosizeOffset: number('Bottom offset', 10),
    resize: () => document.dispatchEvent(new Event('resize'))
  }
}));

