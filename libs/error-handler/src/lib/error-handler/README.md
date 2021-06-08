### Error Handler
A general purpose error handler to ensure a uniform error handling across all TOPS projects.

The difference between this and our previous error handler implementation, is that this one is built to be more dynamic and flexible.
It's still just as easy to use as our previous implementation, where there are still defaults.

* Common error codes (listed below) have a general purpose handler , and there is a generic fallback.
* The application can use the injection token `CUSTOM_ERROR_HANDLER` to override specific codes and defaultHandler
* Each error can also pass in a handler along with the error for specific overrides
* A logger can also be provided with the injection token `ERROR_LOGGER`, e.g to handle central error logging.

Handled errors:
* 0 (Timeout or network connection lost)
* 400
* 401
* 403
* 404
* 409
* 500
* 501
* 503

####Usage 
All errors (even custom ones) are handled centrally via ErrorHandlerService.handler  

```
constructor(private errorHandler: ErrorHandlerService) {
}

onError(err: HttpErrorResponse) {
  // Default handlers
  this.errorHandler.handler(err);
  // Override
  const handler = function(error: HttpErrorResponse): HttpError {
    const e = new HttpError(error);
    e.title = 'A Title';
    e.text = 'Error text';
    e.action = [
      label: 'Custom button Reload', action: () => window.location.reload()
    ];
    return e;
  }
  this.errorHandler.handler(err, handler);
}
      
```

A custom, app-wide implementation can also be done. This is typically useful for 401 / 403 errors, where the errors are handled equally across the app, but with specific links etc.
A logger is handled the same way
```
import { CUSTOM_ERROR_HANDLER, ERROR_LOGGER, StoErrorHandler, ErrorLogger, HttpError } from '@ngx-stoui/error-handler';

class ErrorHandler implements StoErrorHandler {
  401(err: HttpErrorResponse): HttpError {
    const e = new HttpError(err);
    e.title = '..';
    e.text = '...';
    e.actions = [...];
    return e;
  }
}

class Logger implements ErrorLogger {
  log(err: HttpError) {
    console.log(err);
  }
}

function LoggerFactory(http: HttpClient) {
  return new Logger(http);
}

@NgModule({
    providers: [
        { provide: CUSTOM_ERROR_HANDLER, useClass: ErrorHandler },
        { provide: ERROR_LOGGER, useClass: Logger },
        // If using a service with dependencies:
        { provide: ERROR_LOGGER, useFactory: LoggerFactory, deps: [...]}
    ],
    ...
})
```
