import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MaterialModule } from '@testing/material.module.ts';
import { StoComplexDatatableComponent } from './stoui-complex-datatable.component';
import { NgxDatatableModule } from '../sto-datatable.module';
import { columns, rows } from '../../../testing/utils';

let comp: StoComplexDatatableComponent;
let fixture: ComponentFixture<StoComplexDatatableComponent>;
let wrapFixture: ComponentFixture<WrapperComponent>;
let page: Page;

@Component({
  selector: 'sto-spec-wrap',
  template: ''
})
class WrapperComponent {
}

fdescribe('StoComplexDatatableComponent', () => {

  beforeEach(async(() => {
    TestBed.configureTestingModule({
        imports: [ CommonModule, MaterialModule, NgxDatatableModule ],
        declarations: [ WrapperComponent ]
      })
      .overrideComponent(StoComplexDatatableComponent, { set: { changeDetection: ChangeDetectionStrategy.Default } })
      .compileComponents()
      .then(createComponent);
  }));

  it('should create', () => {
    expect(comp).toBeTruthy();
  });

});

function createComponent() {
  fixture = TestBed
    .createComponent(StoComplexDatatableComponent);
  // wrapFixture = TestBed.createComponent(WrapperComponent);
  comp = fixture.componentInstance;
  comp.columns = columns as any;
  comp.rows = rows;
  comp.scrollbarV = true;
  comp.scrollbarH = true;
  comp.rowHeight = 36;
  comp.height = '400px';
  const el = fixture.debugElement.nativeElement as HTMLElement;
  el.classList.add('sto-datatable', 'ngx-datatable');
  el.style.width = '500px';

  fixture.detectChanges();

  return fixture.whenStable().then(() => {
    fixture.detectChanges();
    page = new Page();
  });
}

class Page {
  constructor() {
  }
}
