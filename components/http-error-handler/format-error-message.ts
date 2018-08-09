import { HttpErrorResponse } from '@angular/common/http';
import { format } from 'date-fns';

/**
 * Function used to format server errors, and convert them to a generalized format to be handled by
 * {@link HttpErrorHandlerService#errorHandler}
 * @param err
 * @returns {FormattedError}
 */
export const formatError = (err: HttpErrorResponse): FormattedError => {
  switch (err.status) {
    case 0:
      return offlineError();
    case 400:
      return formatBadRequest(err);
    case 404:
      return formatNotFound(err);
    case 409:
      return formatConflict(err);
    case 401:
    case 403:
      return noAccessError(err);
    case 424:
      return dependencyError(err);
    case 503:
    case 504:
      return formatServerDownOrTimeout(err);
    default:
      return formatUnknownException(err);
  }
};

const defaultActions: ErrorAction[] = [
  {
    label: 'Cancel',
    closeDialogData: null
  }
];

/**
 * Angular will sometimes not format the error-object returned from the server.
 * If we get this as a string, this function will convert it to an instance of {@link ServerError}
 * @param serverError
 */
const convertMessageStringToJson = (serverError: string|ServerError): ServerError => {
  if (typeof serverError === 'string') {
    let parsed;
    try {
      parsed = JSON.parse(serverError);
    } catch (e) {
      console.log('Failed to parse', serverError);
    }
    if (!parsed) {
      parsed = {
        message: 'No error message returned from server!'
      };
    }
    return parsed;
  }
  return serverError;
};

/**
 * @ignore
 */
const noAccessError = (err: HttpErrorResponse): FormattedError => {
  const baseUrl = `https://accessit.statoil.no/Home/Search?term=`;
  const method = err['method'] as RequestMethods;
  const title = noAccessTitle(method);
  const terms = createAccessItSearchString(err.url, method);
  const url = baseUrl + terms;
  const linkText = noAccessLinkText(method);
  const message = `<a href="${url}">${linkText}</a>`;
  const actions = [];
  if (method !== 'GET') {
    actions.push({
      label: 'OK',
      closeDialogData: null
    })
  }
  const response = {
    timestamp: Date.now(),
    status: err.status,
    error: 'timeout',
    exception: null,
    message,
    path: null
  };
  return Object.assign({}, response, {title, message, actions});
}

/**
 * @ignore
 */
function noAccessLinkText(method: RequestMethods): string {
  let text: string;
  if (method === 'GET') {
    text = 'APPLY FOR ACCESS';
  } else {
    text = 'APPLY FOR EDIT PRIVILEGES';
  }
  return text;
}

/**
 * @ignore
 */
function noAccessTitle(method: RequestMethods): string {
  let title: string;
  if (method === 'GET') {
    title = `Sorry, but you don�t have access to view this page`;
  } else {
    title = 'You do not have edit privileges';
  }
  return title;
}

/**
 * Creates a search string for Access IT, making it easier for the end user to apply for required rights.
 * @param url
 * @param method
 * @returns {string} A search string pointing to the relevant access it query.
 */
function createAccessItSearchString(url: string, method: RequestMethods): string {
  let searchString: string;
  if (url.includes('/im/')) {
    searchString = `OPERATION - TOPS IM (TOPS IM)`.replace(/ /g, '+');
  } else if (url.includes('/is/')) {
    searchString = `SETTLEMENT - TOPS IM (TOPS IM)`.replace(/ /g, '+');
  } else if (url.includes('/va/')) {
    searchString =  `VALUATION - TOPS IM (TOPS IM)`.replace(/ /g, '+');
  } else {
    searchString = `TOPS IM (TOPS IM)`.replace(/ /g, '+');
  }
  if (method !== 'GET') {
    searchString += ' WRITE';
  }
  return searchString;
}

/**
 * @ignore
 */
const offlineError = (): FormattedError => {
  const title = `No network connection`;
  let message: string;
  if (navigator.onLine) {
    message = `<p>We were unable to establish a connection with the server - is your firewall blocking us?</p>`;
  } else {
    message = `<p>You appear to have lost your network connection</p>`;
  }
  const error = {
    actions: defaultActions,
    timestamp: Date.now(),
    status: 0,
    error: 'offline',
    exception: null,
    message,
    path: null
  };
  return Object.assign({}, error, {title, message});
};

/**
 * @ignore
 */
const formatServerDownOrTimeout = (err: HttpErrorResponse): FormattedError => {
  const title = `I was not able to contact the server`;
  const message = `<p>The server appears to have gone offline, or the connection timed out.</p>
  <p>Please report this issue via Services@Statoil.</p>
  <p>In the issue registration form, select "Business Specific IT", and "TOPS IM" as Application.</p>`;
  const serviceNowUrl = `https://statoil.service-now.com/selfservice/?id=sc_cat_item&sys_id=3373cf4cdb97f200bc7af7461d96195b`;
  const actions: ErrorAction[] = [
    {label: 'REPORT ISSUE IN SERVICES@STATOIL', action: () => window.open(serviceNowUrl, '_blank')}
  ];
  const response = {
    timestamp: Date.now(),
    status: err.status,
    error: 'timeout',
    exception: null,
    message,
    path: null
  };
  return Object.assign({}, response, {title, message, actions: [...actions, ...defaultActions]});
};

/**
 * @ignore
 */
const formatNotFound = (err: HttpErrorResponse): FormattedError => {
  const response = convertMessageStringToJson(err.error);
  const title = `Item not found`;
  let message = response.message;
  if (!message) {
    message = `<p>We were unable to locate the requested item</p>`;
  }
  const severity = 'warning';
  const actions = defaultActions;
  return Object.assign({}, response, {title, message, severity, actions});
};

/**
 * @ignore
 */
const formatBadRequest = (err: HttpErrorResponse): FormattedError => {
  const response = convertMessageStringToJson(err.error);
  const title = `Errors in submitted data`;
  let message = response.message;
  if(!message) {
    message = `<p>The server refused to process your request, and responsed with the follow error:</p>
  <p>${response.message}</p>
  <p>Please correct the errors listed above, and try again</p>`;
  }
  const severity = 'error';
  const actions = defaultActions;
  return Object.assign({}, response, {title, message, severity, actions});
};

/**
 * @ignore
 */
const formatUnknownException = (err: HttpErrorResponse): FormattedError => {
  const response = convertMessageStringToJson(err.error);
  const title = `Unexcepted error occured`;
  let message = response.message;
  if (!message) {
    message = `<p>The application experienced an unknown and fatal exception, and returned the following error:</p>
  <p>${response.message}</p>
  <p>You can attempt reloading the page, and if the error still occurs, please log a ticket via ServiceNow</p>`;
  }
  const actions: ErrorAction[] = [
    {label: 'Refresh the page', action: () => window.location.reload(true)}
  ];
  return Object.assign({}, response, {title, message, actions: [...actions, ...defaultActions]});
};

/**
 * @ignore
 */
const formatConflict = (err: HttpErrorResponse): FormattedError => {
  const response = convertMessageStringToJson(err.error);
  const url = `<a href="${window.location.href}" tabindex="-1" target="_blank">you can open the updated version in a new window</a>`;
  const title = `Not able to save because your data is obsolete`;
  const message = `<p>The server has a newer version of this item.</p>`;
  const actions: ErrorAction[] = [
    {label: 'GET THE LATEST VERSION', closeDialogData: 'replace'},
  ];
  return Object.assign({}, response, {title, message, actions: [...actions, ...defaultActions]});
};

/**
 * @ignore
 */
const dependencyError = (err: HttpErrorResponse): FormattedError => {
  const response = convertMessageStringToJson(err.error);
  const errorObject: DependencyError = JSON.parse(response.message);
  const movementTypeMap = getMovementTypeMap();
  const movementType = movementTypeMap.get(errorObject.transactionType.toLowerCase());
  const {pathname} = window.location;
  const href = `${pathname}#/overview/movements/${movementType}/${errorObject.id}`;
  const title = errorObject.messageHeader;
  const {messageBody, errorMessage} = errorObject;
  const message = `<p>${messageBody}</p><p>${errorMessage}</p><p>Movement details: ${format(errorObject.date, 'ddd DD. MMM YYYY')}; ${errorObject.transactionType};${errorObject.externalReference || 'No Reference'}</p>`;
  const actions: ErrorAction[] = [
    {label: `Open ${errorObject.transactionType}`, action: () => window.open(href, '_blank')},
  ];

  return Object.assign({}, response, {title, message, actions: [...actions, ...defaultActions]});
};

/**
 * @ignore
 */
function getMovementTypeMap(): Map<string, string> {
  const movementTypeMap = new Map<string, string>();
  movementTypeMap.set('movement import', 'imports');
  movementTypeMap.set('movement export', 'exports');
  movementTypeMap.set('movement t2t', 't2t');
  movementTypeMap.set('movement itt', 'itt');
  movementTypeMap.set('statement', 'statement');
  movementTypeMap.set('regrade', 'regrade');
  return movementTypeMap;
}

/**
 * @ignore
 */
export interface DependencyError {
  date: string;
  errorMessage: string;
  messageBody: string;
  id: string;
  messageHeader: string;
  transactionType: string;
  referenceKey: string;
  externalReference: string;
}

/**
 * Represents the error object returned from the server
 */
export interface ServerError {
  timestamp?: number;
  status?: number;
  error?: string;
  exception?: string;
  message: any;
  path?: string;
}

/**
 * A formatted instance of the server error, including additional info
 */
export interface FormattedError extends ServerError {
  /**
   * A list of the available actions for the given error
   */
  actions?: ErrorAction[];
  /**
   * Error or warning severity
   */
  severity?: string;
  /**
   * Dialog title
   */
  title: string;
}

/**
 * Available properties on dialog actions
 */
export interface ErrorAction {
  /**
   * Button label
   */
  label: string;
  /**
   * A function to be called based on the given action (e.g window.location.reload to refresh the tab)
   */
  action?: Function;
  /**
   * The data to be returned when the dialog is closed.
   */
  closeDialogData?: any;
}

export type RequestMethods = 'GET'|'POST'|'PUT'|'PATCH'|'DELETE';
