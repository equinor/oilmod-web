import { InjectionToken } from '@angular/core';
import { ErrorHandler, ErrorLogger } from './error-handler';

export const CUSTOM_ERROR_HANDLER = new InjectionToken<ErrorHandler>('sto.custom-error-handler');
export const ERROR_LOGGER = new InjectionToken<ErrorLogger>('sto.error-logger');
