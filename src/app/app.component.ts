import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, OnInit, TemplateRef, ViewChild } from '@angular/core';
import data from './invoice';
import { StoDatatableComponent } from '@ngx-stoui/datatable';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: [ './app.component.scss' ]
})
export class AppComponent implements OnInit, AfterViewInit {
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
  public height: number;
  public cols;
  public rows;
  public fullscreen = true;
  public footer = {
    allocated: 0,
    total: 0,
    invoiceNo: '0 rows'
  };
  public homeBreadCrumbConfig = {
    command: () => {
      console.log('Primary menu button clicked!');
    }
  };
  public breadCrumbs = [
    { label: 'DEMO', command: () => console.log('Application root button clicked') },
    { label: 'DEMO LVL 2', command: () => console.log('Application level 2 clicked') }
  ];

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
          headerClass: 'aclass'
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
          headerClass: 'aclass'
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
