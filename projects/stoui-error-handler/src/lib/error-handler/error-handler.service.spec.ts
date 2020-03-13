import { TestBed } from '@angular/core/testing';

import { ErrorHandlerService } from './error-handler.service';
import { ErrorHandlerModule } from './error-handler.module';
import { MatDialogModule } from '@angular/material/dialog';

describe('ErrorHandlerService', () => {
  beforeEach(() => TestBed.configureTestingModule({
    imports: [ ErrorHandlerModule, MatDialogModule ]
  }));

  it('should be created', () => {
    const service: ErrorHandlerService = TestBed.get(ErrorHandlerService);
    expect(service).toBeTruthy();
  });
});
