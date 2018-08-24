import { TestBed, inject } from '@angular/core/testing';

import { NgxStouiService } from './ngx-stoui.service';

describe('NgxStouiService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [NgxStouiService]
    });
  });

  it('should be created', inject([NgxStouiService], (service: NgxStouiService) => {
    expect(service).toBeTruthy();
  }));
});
