import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { StoMessagePanelModule } from 'ngx-stoui';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    StoMessagePanelModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
