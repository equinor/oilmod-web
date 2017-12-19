import { HttpErrorResponse } from '@angular/common/http';

export const formatError = (err: HttpErrorResponse): FormattedError => {
  switch (err.status) {
    case 400:
      return formatBadRequest(err);
    case 404:
      return formatNotFound(err);
    case 409:
      return formatConflict(err);
    default:
      return formatUnknownException(err);
  }
};

const convertMessageStringToJson = (serverError: string): ServerError => {
  let parsed;
  try {
    parsed = JSON.parse(serverError);
  } catch (e) {
    alert(`Failed to convert error: ${e.message}`);
  }
  return parsed;
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
  return Object.assign({}, response, {title, message, actions});
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
    {label: 'Cancel', closeDialogData: null},
    {label: 'DISCARD MY CHANGES AND GET THE LATEST VERSION', closeDialogData: 'replace'},
  ];
  return Object.assign({}, response, {title, message, actions});
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
