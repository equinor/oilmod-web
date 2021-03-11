import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StoDatatableActionsComponent } from './sto-datatable-actions.component';

describe('StoDatatableActionsComponent', () => {
  let component: StoDatatableActionsComponent;
  let fixture: ComponentFixture<StoDatatableActionsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
        declarations: [ StoDatatableActionsComponent ]
      })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StoDatatableActionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
