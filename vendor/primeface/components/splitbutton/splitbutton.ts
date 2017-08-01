import {NgModule,Component,ElementRef,OnInit,OnDestroy,Input,Output,EventEmitter,ContentChildren,QueryList,Renderer,ChangeDetectorRef} from '@angular/core';
import {CommonModule} from '@angular/common';
import {DomHandler} from '../dom/domhandler';
import {MenuItem} from '../common/api';
import {ButtonModule} from '../button/button';
import {Router} from '@angular/router';

export class SplitButton implements OnInit,OnDestroy {

    @Input() model: MenuItem[];

    @Input() icon: string;

    @Input() iconPos: string = 'left';
        
    @Input() label: string;
    
    @Output() onClick: EventEmitter<any> = new EventEmitter();
    
    @Input() style: any;
    
    @Input() styleClass: string;
    
    @Input() menuStyle: any;
    
    @Input() menuStyleClass: string;
    
    @Input() disabled: boolean;

    @Input() tabindex: number;
                
    public menuVisible: boolean = false;
    
    public documentClickListener: any;

    constructor(public el: ElementRef, public domHandler: DomHandler, public renderer: Renderer, public router: Router, public cd: ChangeDetectorRef) {}
    
    ngOnInit() {
        this.documentClickListener = this.renderer.listenGlobal('document', 'click', () => {
            this.menuVisible = false;
            this.cd.markForCheck();
        });
    }
    
    onDefaultButtonClick(event: Event) {
        this.onClick.emit(event);
    }
    
    itemClick(event: Event, item: MenuItem) {
        if(item.disabled) {
            event.preventDefault();
            return;
        }
        
        if(!item.url||item.routerLink) {
            event.preventDefault();
        }
        
        if(item.command) {
            if(!item.eventEmitter) {
                item.eventEmitter = new EventEmitter();
                item.eventEmitter.subscribe(item.command);
            }
            
            item.eventEmitter.emit(event);
        }
        
        this.menuVisible = false;
        
        if(item.routerLink) {
            this.router.navigate(item.routerLink);
        }
    }
    
    onDropdownClick(event: Event, menu: HTMLDivElement, container: Element) {
        this.menuVisible= !this.menuVisible;
        this.domHandler.relativePosition(menu, container);
        this.domHandler.fadeIn(menu,25);
        menu.style.zIndex = String(++DomHandler.zindex);
        event.stopPropagation();
    }
        
    ngOnDestroy() {
        if(this.documentClickListener) {
            this.documentClickListener();
        }
    }
}

export class SplitButtonModule { }
