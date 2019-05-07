import { Inject, Injectable, Optional } from '@angular/core';
import { ACCESSIT_TERM, SERVICENOW_URL } from './tokens';
import { HttpErrorResponse } from '@angular/common/http';
import { formatError, FormattedError } from './format-error-message';

@Injectable()
export class ErrorFormatter {
  constructor(
    @Inject(SERVICENOW_URL) @Optional() private serviceNowUrl: string,
    @Inject(ACCESSIT_TERM) @Optional() private accessitTerm: string
  ) {
  }

  public format(error: HttpErrorResponse): FormattedError {
    return formatError(error, this.serviceNowUrl, this.accessitTerm);
  }
}
