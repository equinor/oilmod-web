import { InjectionToken } from '@angular/core';
import { ErrorHandler, ErrorLogger } from './error-handler';

// Custom error handler injection token, used to override error handlers
export const CUSTOM_ERROR_HANDLER = new InjectionToken<ErrorHandler>('sto.custom-error-handler');
// Error logger injection token, to enable error logging.
export const ERROR_LOGGER = new InjectionToken<ErrorLogger>('sto.error-logger');
