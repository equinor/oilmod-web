import {NgModule,Component,ElementRef,AfterViewInit,OnDestroy,OnChanges,Input,Output,SimpleChange} from '@angular/core';
import {CommonModule} from '@angular/common';
import {Message} from '../common/api';

export class Messages {

    @Input() value: Message[];

    @Input() closable: boolean = true;

    hasMessages() {
        return this.value && this.value.length > 0;
    }

    getSeverityClass() {
        return this.value[0].severity;
    }

    clear(event) {
        this.value.splice(0, this.value.length);

        event.preventDefault();
    }
    
    get icon(): string {
        let icon: string = null;
        if(this.hasMessages()) {
            let msg = this.value[0];
            switch(msg.severity) {
                case 'success':
                    icon = 'fa-check';
                break;
                
                case 'info':
                    icon = 'fa-info-circle';
                break;
                
                case 'error':
                    icon = 'fa-close';
                break;
                
                case 'warn':
                    icon = 'fa-warning';
                break;
                
                case 'success':
                    icon = 'fa-check';
                break;
                
                default:
                    icon = 'fa-info-circle';
                break;
            }
        }
        
        return icon;
    }
}

export class MessagesModule { }