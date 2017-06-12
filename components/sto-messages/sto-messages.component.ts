import {NgModule,Component,ElementRef,AfterViewInit,OnDestroy,OnChanges,Input,Output,SimpleChange} from '@angular/core';
import {CommonModule} from '@angular/common';
import { Messages } from '../../vendor/primeface/components/messages/messages';
import { Message } from '../sto-shared/sto-api';

@Component({
    selector: 'sto-messages',
    templateUrl: 'sto-messages.component.html',
    styleUrls : ['sto-messages.component.scss']
})
export class StoMessagesComponent extends Messages{

    @Input() value: Message[];

    public typeof(arg) {
        return typeof arg;
    }

}

@NgModule({
    imports: [CommonModule],
    exports: [StoMessagesComponent],
    declarations: [StoMessagesComponent]
})
export class StoMessagesModule { }