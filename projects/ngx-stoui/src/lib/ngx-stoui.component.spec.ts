import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NgxStouiComponent } from './ngx-stoui.component';

describe('NgxStouiComponent', () => {
  let component: NgxStouiComponent;
  let fixture: ComponentFixture<NgxStouiComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NgxStouiComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NgxStouiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
