import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { NgxDatatableModule } from 'ngx-stoui';
import {MatIconModule} from '@angular/material';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import { StoMessagePanelModule } from '@ngx-stoui/common';


@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    NgxDatatableModule,
    MatIconModule,
    BrowserAnimationsModule,
    StoMessagePanelModule
  ],
  providers: [
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
