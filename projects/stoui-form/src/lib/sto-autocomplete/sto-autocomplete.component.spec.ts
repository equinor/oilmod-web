import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MaterialModule } from '@testing/material.module.ts';
import { StoAutocompleteComponent } from './sto-autocomplete.component';

let comp: StoAutocompleteComponent;
let fixture: ComponentFixture<StoAutocompleteComponent>;
let page: Page;

const list = [
  { label: 'Item A', id: 1 },
  { label: 'Item B', id: 2 },
  { label: 'Item C', id: 3 },
  { label: 'Item D', id: 4 },
  { label: 'Item E', id: 5 },
];

const displayFn = item => item ? item.label : '';
const searchForKey = 'label';

@Component({
  selector: 'sto-spec-wrap',
  template: ''
})
class WrapperComponent {
}

describe('StoAutocompleteComponent', () => {

  beforeEach(async(() => {
    TestBed.configureTestingModule({
        imports: [ CommonModule, MaterialModule ],
        declarations: [ StoAutocompleteComponent, WrapperComponent ]
      })
      .overrideComponent(StoAutocompleteComponent, { set: { changeDetection: ChangeDetectionStrategy.Default } })
      .compileComponents()
      .then(createComponent);
  }));

  it('should create', () => {
    expect(comp).toBeTruthy();
  });

  it('should filter list', async(() => {
    comp.filtered$.subscribe(rows => {
      expect(rows.length).toBeLessThan(list.length);
      expect(rows.length).toBe(1);
      expect(rows[ 0 ]).toEqual(list[ 0 ]);
    });
    comp.searchControl.setValue('A');
    fixture.detectChanges();
  }));

});

function createComponent() {
  fixture = TestBed
    .createComponent(StoAutocompleteComponent);
  comp = fixture.componentInstance;
  comp.displayFn = displayFn;
  comp.searchForKey = searchForKey;
  comp.unfiltered = list;
  comp.label = 'Autocomplete';

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
