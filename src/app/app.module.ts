import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {QuickViewModule} from '@ngx-stoui/quick-view';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    QuickViewModule
  ],
  providers: [
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
