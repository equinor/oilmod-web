import { Meta, Story } from '@storybook/angular/types-6-0';
import { moduleMetadata } from '@storybook/angular';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ErrorHandlerModule } from '../../projects/stoui-error-handler/src/public_api';
import { NextWrapperComponent, WrapperModule } from './wrapper';

export default {
  title: 'Error Handling/Error Handling',
  decorators: [
    moduleMetadata({
      imports: [ ErrorHandlerModule, WrapperModule, BrowserAnimationsModule
      ],
    })
  ],
} as Meta;

const Template: Story<any> = (args: any) => {
  return {
    props: args,
    template: `<next-wrapper></next-wrapper>`,
    sampleComponent: `@Component({
  selector: 'next-wrapper',
  template: \`
    <button mat-button
            (click)="overRide(404)">Overridden 404
    </button>
    <button mat-button
            (click)="showError(s)"
            *ngFor="let s of errors">{{s}} {{ s === 401 ? '(App Override)' : ''}}</button>
  \`,
  providers: []
})
export class NextWrapperComponent {
  public errors = [
    0,
    400,
    401,
    403,
    404,
    409,
    500,
    501,
    503
  ];

  constructor(private service: ErrorHandlerService) {
  }

  showError(status: number) {
    const err = new HttpErrorResponse({
      status,
      error: {
        message: 'server error message'
      },
      statusText: 'Error',
      url: 'http://errorhandler/api'
    });
    this.service.handler(err);
  }

  overRide(status: number) {
    const err = new HttpErrorResponse({
      status,
      error: {
        message: 'server error message'
      },
      statusText: 'Error',
      url: 'http://errorhandler/api'
    });
    const handler = function (err: HttpErrorResponse) {
      const e = new HttpError(err);
      e.title = 'Local override 404';
      e.text = 'Local override not found item';
      return e;
    };
    this.service.handler(err, handler);
  }
}

@Injectable()
export class ErrorHandlerImpl implements StoErrorHandler {
  [ code: number ]: Handler;

  401(err: HttpErrorResponse) {
    const error = new HttpError(err);
    error.title = 'Custom not signed in';
    error.text = 'Custom not signed in text';
    return error;
  }
}

@Injectable()
export class Logger {
  constructor(private http: HttpClient) {
  }

  log(err: HttpError) {
    // This method will typically go to the application backend or a central log repository
    console.log('Error', err);
  }
}

function LoggerFactory(http: HttpClient) {
  return new Logger(http);
}

@NgModule({
  declarations: [ NextWrapperComponent ],
  imports: [ CommonModule, MatButtonModule, HttpClientModule ],
  exports: [ NextWrapperComponent ],
  providers: [
    { provide: CUSTOM_ERROR_HANDLER, useClass: ErrorHandlerImpl },
    { provide: ERROR_LOGGER, useFactory: LoggerFactory, deps: [ HttpClient ] }
  ]
})
export class WrapperModule {
}`,
  };
};
console.log(NextWrapperComponent);

export const NormalUse = Template.bind({});
NormalUse.args = {};
