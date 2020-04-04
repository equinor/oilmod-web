import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { StoDatatableComponent } from '@ngx-stoui/datatable';
import data from '../invoice';
import { RowActivation, RowSelection } from '../../../projects/stoui-datatable/src/lib/sto-datatable/events';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: [ './table.component.scss' ]
})
export class TableComponent implements OnInit, AfterViewInit {

  @ViewChild('tbl', { read: ElementRef })
  table: ElementRef;
  @ViewChild('tmpl', { static: true })
  tmpl: TemplateRef<any>;
  @ViewChild('ltmpl', { static: true })
  ltmpl: TemplateRef<any>;
  @ViewChild('hdrTmpl', { static: true })
  hdrTmpl: TemplateRef<any>;
  @ViewChild('footerTmpl', { static: true })
  footerTmpl: TemplateRef<any>;
  @ViewChild(StoDatatableComponent)
  comp: StoDatatableComponent;
  public cols;
  public rows;
  public footer = {
    allocated: 0,
    total: 0,
    invoiceNo: '0 rows'
  };
  public selected: any;

  getRowClass(row) {
    return row.checked ? 'checked-row' : 'unchecked-row';
  }

  dispatch() {
    setTimeout(() => {
      window.dispatchEvent(new Event('resize'));
    }, 250);
  }

  public scrollByIndex(index: string | number) {
    index = Number(index);
    this.comp.scrollTo(index);
    console.log(this.rows[ index ]);
  }

  public scrollByItemAtIndex(index: string | number) {
    index = Number(index);
    const item = this.rows[ index ];
    this.comp.scrollTo(item);
  }

  constructor(private cdr: ChangeDetectorRef) {
  }

  ngOnInit() {
    // this.rows = [data[0], data[1]];
    // const rows = [
    //   ...data, ...data, ...data, ...data, ...data, ...data, ...data, ...data, ...data, ...data, ...data, ...data, ...data, ...data, ...data
    // ];
    // this.rows = JSON.parse(JSON.stringify(rows));
    this.rows = [ ...data ];//.slice(0, 5);
    const allocated = this.rows.map(r => r.allocated).reduce((a, b) => a + b, 0);
    const total = this.rows.map(r => r.total).reduce((a, b) => a + b, 0);
    this.footer = {
      invoiceNo: `${this.rows.length} rows`,
      allocated,
      total
    };
  }

  ngAfterViewInit() {
    requestAnimationFrame(() => {
      this.cols = [
        {
          prop: 'invoiceNo',
          name: 'Invoice#',
          cellTemplate: this.tmpl,
          headerTemplate: this.hdrTmpl,
          flexBasis: 200,
          flexShrink: 1,
          flexGrow: 1
        },
        {
          prop: 'voyageNo',
          flexBasis: 200,
          name: 'Voyage#',
          cellTemplate: this.ltmpl,
          headerClass: 'aclass',
          cellClass: (value) => {
            return 'a-cell-class';
          }
        },
        {
          prop: 'vesselName',
          flexBasis: 200,
          name: 'Vessel',
          headerClass: 'bclass',
          flexGrow: 1
        },
        {
          prop: 'allocated',
          flexBasis: 200,
          name: 'Allocated',
          headerClass: 'aclass'
        },
        {
          prop: 'total',
          flexBasis: 200,
          name: 'Total',
          headerClass: 'aclass',
          cellClass: 'a-cell-class'
        },
        /*      {
                prop: 'e',
                name: 'CellE',
                headerClass: 'aclass'
              },
              {
                prop: 'f',
                name: 'CellF',
                flexGrow: 3,
                footerTemplate: this.footerTmpl,
                headerClass: 'aclass'
              },*/
      ];
    });
    /*    setTimeout(() => {
          fromEvent(window, 'resize')
            .pipe(startWith(null))
            .subscribe(() => {
              const table: HTMLElement = this.table.nativeElement;
              const rect = table.getBoundingClientRect();
              const top = rect.top;
              const total = window.innerHeight;
              this.height = total - top - 80;
              this.cdr.detectChanges();
            });
        }, 100);*/
  }

  addCol() {
    this.cols = [
      ...this.cols,
      {
        prop: '',
        name: 'Stuff',
        flexBasis: parseInt(String(Math.random() * 100), 10)
      }
    ];
  }

  onSelect(rowSelection: RowSelection<any>) {
    this.selected = rowSelection.row;
    // rowSelection.row.checked = !rowSelection.row.checked;
  }

  onRowActivate(activateEvent: RowActivation<any>) {
    console.log({ activateEvent });
  }
}
