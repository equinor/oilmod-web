import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { StoDatatableComponent } from '@ngx-stoui/datatable';
import data from '../invoice';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: [ './table.component.scss' ]
})
export class TableComponent implements OnInit, AfterViewInit {

  @ViewChild('tbl', { read: ElementRef })
  table: ElementRef;
  @ViewChild('tmpl')
  tmpl: TemplateRef<any>;
  @ViewChild('ltmpl')
  ltmpl: TemplateRef<any>;
  @ViewChild('hdrTmpl')
  hdrTmpl: TemplateRef<any>;
  @ViewChild('footerTmpl')
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

  getRowClass(row) {
    return row.invoiceNo === 212666588 ? 'user-defined-class' : '';
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
    const rows = [
      ...data, ...data, ...data, ...data, ...data, ...data, ...data, ...data, ...data, ...data, ...data, ...data, ...data, ...data, ...data
    ];
    this.rows = JSON.parse(JSON.stringify(rows));
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
          flexBasis: 80,
          flexShrink: 1,
          flexGrow: 0
        },
        {
          prop: 'voyageNo',
          name: 'Voyage#',
          cellTemplate: this.ltmpl,
          headerClass: 'aclass',
          cellClass: (value) => {
            return 'a-cell-class';
          }
        },
        {
          prop: 'vesselName',
          name: 'Vessel',
          headerClass: 'bclass',
          flexGrow: 10
        },
        {
          prop: 'allocated',
          name: 'Allocated',
          headerClass: 'aclass'
        },
        {
          prop: 'total',
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

}
