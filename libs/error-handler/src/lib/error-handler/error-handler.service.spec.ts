import { TestBed } from '@angular/core/testing';

import { HttpErrorResponse } from '@angular/common/http';
import { MatDialogModule } from '@angular/material/dialog';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { ErrorHandlerModule } from './error-handler.module';
import { ErrorHandlerService } from './error-handler.service';
import { HttpError } from './http-error';
import { CUSTOM_ERROR_HANDLER, ERROR_LOGGER } from './token';

const getError = (status: number) => {
  return new HttpErrorResponse({
    status,
    error: {
      message: 'server error message',
    },
    statusText: 'Error',
    url: 'http://errorhandler/api',
  });
};

class CustomHandler {
  401(err: HttpErrorResponse) {
    return new HttpError(err);
  }
}

class Logger {
  log(ex: HttpError) {}
}

describe('ErrorHandlerService', () => {
  beforeEach(() =>
    TestBed.configureTestingModule({
      imports: [ErrorHandlerModule, MatDialogModule, NoopAnimationsModule],
      providers: [
        { provide: CUSTOM_ERROR_HANDLER, useClass: CustomHandler },
        { provide: ERROR_LOGGER, useClass: Logger },
      ],
    })
  );

  it('should be created', () => {
    const service: ErrorHandlerService = TestBed.get(ErrorHandlerService);
    expect(service).toBeTruthy();
  });

  it('should call the correct error handler', () => {
    const service: ErrorHandlerService = TestBed.get(ErrorHandlerService);
    // @ts-ignore
    let spy = jest.spyOn(service, 400);
    service.handler(getError(400));
    expect(spy).toHaveBeenCalled();
    // @ts-ignore
    spy = jest.spyOn(service, 403);
    service.handler(getError(403));
    expect(spy).toHaveBeenCalled();
    // @ts-ignore
    spy = jest.spyOn(service, 500);
    service.handler(getError(500));
    expect(spy).toHaveBeenCalled();
    // @ts-ignore
    spy = jest.spyOn(service, 'defaultHandler');
    service.handler(getError(428));
    expect(spy).toHaveBeenCalled();
  });

  it('should call the passed in error handler', () => {
    const handler = {
      handler: (err: HttpErrorResponse) => new HttpError(err),
    };
    const spy = jest.spyOn(handler, 'handler');
    const service: ErrorHandlerService = TestBed.get(ErrorHandlerService);
    service.handler(getError(401), handler.handler);
    expect(spy).toHaveBeenCalled();
  });

  it('should use the injected handler', () => {
    const service: ErrorHandlerService = TestBed.get(ErrorHandlerService);
    const custom: CustomHandler = TestBed.get(CUSTOM_ERROR_HANDLER);
    // @ts-ignore
    const spy = jest.spyOn(custom, '401');
    service.handler(getError(401));
    expect(spy).toHaveBeenCalled();
  });

  it('should call the injected logger', () => {
    const service: ErrorHandlerService = TestBed.get(ErrorHandlerService);
    const logger: Logger = TestBed.get(ERROR_LOGGER);
    const spy = jest.spyOn(logger, 'log');
    service.handler(getError(400));
    expect(spy).toHaveBeenCalled();
  });
});
