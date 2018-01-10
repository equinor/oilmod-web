import { HttpErrorResponse } from '@angular/common/http';

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
]

const convertMessageStringToJson = (serverError: string): ServerError => {
  let parsed;
  try {
    parsed = JSON.parse(serverError);
  } catch (e) {
    console.log(serverError);
    alert(`Failed to convert error: ${e.message}`);
  }
  return parsed;
};

const offlineError = (): FormattedError => {
  const title = `No network connection`;
  let message: string;
  if (navigator.onLine) {
    message = `We were unable to establish a connection with the server - is your firewall blocking us?`;
  } else {
    message = `You appear to have lost your network connection`;
  }
  const error = {
    timestamp: Date.now(),
    status: 0,
    error: 'offline',
    exception: null,
    message,
    path: null
  };
  return Object.assign({}, error, {title, message});
};

const formatServerDownOrTimeout = (err: HttpErrorResponse): FormattedError => {
  const title = `I was not able to contact the server`;
  const message = `The server appears to have gone offline, or the connection timed out.

  Please report this issue via Services@Statoil.

  In the issue registration form, select "Business Specific IT", and "TOPS IM" as Application.`;
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

const formatNotFound = (err: HttpErrorResponse): FormattedError => {
  const response = convertMessageStringToJson(err.error);
  const title = `Item not found`;
  const message = `We were unable to locate the requested item, and the server responsed with the following error:
  ${response.message}`;
  const severity = 'warning';
  return Object.assign({}, response, {title, message, severity});
};

const formatBadRequest = (err: HttpErrorResponse): FormattedError => {
  const response = convertMessageStringToJson(err.error);
  const title = `Errors in submitted data`;
  const message = `The server refused to process your request, and responsed with the follow error:
  ${response.message}
  Please correct the errors listed above, and try again`;
  const severity = 'error';
  return Object.assign({}, response, {title, message, severity});
};

const formatUnknownException = (err: HttpErrorResponse): FormattedError => {
  const response = convertMessageStringToJson(err.error);
  const title = `Unexcepted error occured`;
  const message = `The application experienced an unknown and fatal exception, and returned the following error:

  ${response.message}

  You can attempt reloading the page, and if the error still occurs, please log a ticket via ServiceNow`;
  const actions: ErrorAction[] = [
    {label: 'Refresh the page', action: () => window.location.reload(true)}
  ];
  return Object.assign({}, response, {title, message, actions: [...actions, ...defaultActions]});
};

const formatConflict = (err: HttpErrorResponse): FormattedError => {
  const response = convertMessageStringToJson(err.error);
  const url = `<a href="${window.location.href}"
tabindex="-1"
target="_blank">you can open the updated version in a new window</a>`;
  const title = `I was not able to save because your data is obsolete`;
  const message = `The server has a newer version of this item.

  If you do not want to loose your unsaved data, ${url} and apply your changes there.`;
  const actions: ErrorAction[] = [
    {label: 'DISCARD MY CHANGES AND GET THE LATEST VERSION', closeDialogData: 'replace'},
  ];
  return Object.assign({}, response, {title, message, actions: [...actions, ...defaultActions]});
};


export interface ServerError {
  timestamp: number;
  status: number;
  error: string;
  exception: string;
  message: string;
  path: string;
}

export interface FormattedError extends ServerError {
  actions?: ErrorAction[];
  severity?: string;
  title: string;
}

export interface ErrorAction {
  label: string;
  action?: Function;
  closeDialogData?: any;
}
