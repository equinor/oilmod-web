import { Component, OnInit } from '@angular/core';
import { AdalService } from '../adal.service';

@Component({
  selector: 'sto-callback',
  templateUrl: './callback.component.html'
})
export class StoCallbackComponent implements OnInit {

  constructor(private adalService: AdalService) {
  }

  ngOnInit() {
    this.adalService.handleCallback();
  }

}
