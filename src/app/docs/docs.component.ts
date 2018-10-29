import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material';
import { SafeHtml } from '@angular/platform-browser';

@Component({
  selector: 'app-docs',
  templateUrl: './docs.component.html',
  styles: []
})
export class DocsComponent implements OnInit {

  constructor(@Inject(MAT_DIALOG_DATA) public data: SafeHtml) { }

  ngOnInit() {
  }

}
