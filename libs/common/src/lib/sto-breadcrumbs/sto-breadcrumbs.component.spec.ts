import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { CommonModule } from '@angular/common';
import { By } from '@angular/platform-browser';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MaterialModule } from '@ngx-stoui/testing';
import { StoBreadcrumbsComponent } from './sto-breadcrumbs.component';
import { breadCrumbs } from '../../test-utils';
import { RouterTestingModule } from '@angular/router/testing';

let comp: StoBreadcrumbsComponent;
let fixture: ComponentFixture<StoBreadcrumbsComponent>;
let wrapFixture: ComponentFixture<WrapperComponent>;
let page: Page;

@Component({
  selector: 'sto-spec-wrap',
  template: ''
})
class WrapperComponent {
}

describe('StoBreadcrumbsComponent', () => {

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
        imports: [ CommonModule, MaterialModule, RouterTestingModule ],
        declarations: [ StoBreadcrumbsComponent, WrapperComponent ]
      })
      .overrideComponent(StoBreadcrumbsComponent, { set: { changeDetection: ChangeDetectionStrategy.Default } })
      .compileComponents()
      .then(createComponent);
  }));

  it('should create', () => {
    expect(comp).toBeTruthy();
  });

  it('should trigger the command of a clicked item', () => {
    spyOn(breadCrumbs[ 0 ], 'command');
    page.elements[ 0 ].dispatchEvent(new Event('click'));
    fixture.detectChanges();
    expect(breadCrumbs[ 0 ].command).toHaveBeenCalled();
  });

});

function createComponent() {
  fixture = TestBed
    .createComponent(StoBreadcrumbsComponent);
  // wrapFixture = TestBed.createComponent(WrapperComponent);
  comp = fixture.componentInstance;
  comp.model = breadCrumbs;

  fixture.detectChanges();

  return fixture.whenStable().then(() => {
    fixture.detectChanges();
    page = new Page();
  });
}

class Page {
  public elements: HTMLAnchorElement[];

  constructor() {
    const debugElements = fixture.debugElement.queryAll(By.css('a'));
    this.elements = debugElements.map(de => de.nativeElement);
  }
}
