#### HttpErrorHandler
Service and methods to handle API errors on the client, and present them in a readable manner to the end user, either using a dialog for complex / critical errors, or formatting a HttpErrorResponse to a readable message, and cleaning this up on error dismissal

##### Utility methods
###### formatError
A method used to convert an angular HttpErrorResponse to a more generic format, allowing us to easily present this information in a logical manner.

Usage:
```typescript
http.get('/api/data')
    .pipe(
      catchError(err => formatError(err))
    )
```

##### HttpErrorHandlerService
The primary usage for the error handler. Takes in a formatted error from `formatError`, and handles the error accordingly.

As of now, 400 and 404 (by default) will only emit a new message on `errorMessage$`. Other errors are passed to a dialog to be handled.
```typescript
http.get('/api/data')
    .pipe(
      catchError(err => formatError(err))
    ).subscribe(err => this.httpErrorHandlerService.errorHandler(err));
```

If you want to override the default handler for 400 / 404 and open a dialog, we expose `handleModalError`. This forces the error to be handled inside a dialog.
```typescript
http.get('/api/data')
    .pipe(
      catchError(err => formatError(err))
    ).subscribe(err => this.httpErrorHandlerService.handleModalError(err));
```
