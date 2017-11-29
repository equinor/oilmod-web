import { EventEmitter, Injectable } from '@angular/core';
import { ReplaySubject } from 'rxjs/ReplaySubject';

@Injectable()
export class ListAutoResizeService {

  isToggled = new ReplaySubject();


}
