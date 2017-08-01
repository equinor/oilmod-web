import {NgModule,Component,ElementRef,AfterViewInit,OnDestroy,Input,Output,Renderer,EventEmitter,Inject,forwardRef,ViewChild} from '@angular/core';
import {CommonModule} from '@angular/common';
import {DomHandler} from '../dom/domhandler';
import {MenuItem} from '../common/api';
import {Location} from '@angular/common';
import {RouterModule} from '@angular/router';

export class SlideMenuSub implements OnDestroy {

    @Input() item: MenuItem;
    
    @Input() root: boolean;
    
    @Input() backLabel: string = 'Back';
    
    @Input() menuWidth: string;
    
    @Input() effectDuration: any;
        
    @Input() easing: string = 'ease-out';
        
    constructor(@Inject(forwardRef(() => SlideMenu)) public slideMenu: SlideMenu) {}
        
    activeItem: any;
                            
    itemClick(event, item: MenuItem, listitem: any) {
        if(item.disabled) {
            event.preventDefault();
            return;
        }
        
        if(!item.url) {
            event.preventDefault();
        }
                
        if(item.command) {
            if(!item.eventEmitter && item.command) {
                item.eventEmitter = new EventEmitter();
                item.eventEmitter.subscribe(item.command);
            }
            
            item.eventEmitter.emit({
                originalEvent: event,
                item: item
            });
        }
        
        if(item.items && !this.slideMenu.animating) {
            this.slideMenu.left -= this.slideMenu.menuWidth;
            this.activeItem = listitem;
            this.slideMenu.animating = true;
            setTimeout(() => this.slideMenu.animating = false, this.effectDuration);
        }
    }
        
    ngOnDestroy() {
        this.activeItem = null;
    }
}

export class SlideMenu implements AfterViewInit,OnDestroy {

    @Input() model: MenuItem[];

    @Input() popup: boolean;

    @Input() style: any;

    @Input() styleClass: string;
    
    @Input() menuWidth: number = 200;
    
    @Input() viewportHeight: number = 175;
    
    @Input() effectDuration: any = 500;
        
    @Input() easing: string = 'ease-out';
    
    @Input() backLabel: string = 'Back';
    
    @ViewChild('container') containerViewChild: ElementRef;
    
    @ViewChild('backward') backwardViewChild: ElementRef;
    
    @ViewChild('slideMenuContent') slideMenuContentViewChild: ElementRef;
    
    public container: HTMLDivElement;
    
    public backwardElement: HTMLDivElement;
    
    public slideMenuContentElement: HTMLDivElement;
    
    public documentClickListener: any;
    
    public preventDocumentDefault: any;
        
    public left: number = 0;
    
    public animating: boolean = false;
        
    constructor(public el: ElementRef, public domHandler: DomHandler, public renderer: Renderer) {}

    ngAfterViewInit() {
        this.container = <HTMLDivElement> this.containerViewChild.nativeElement;
        this.backwardElement = <HTMLDivElement> this.backwardViewChild.nativeElement;
        this.slideMenuContentElement = <HTMLDivElement> this.slideMenuContentViewChild.nativeElement;
        this.slideMenuContentElement.style.height = this.viewportHeight - this.domHandler.getHiddenElementOuterHeight(this.backwardElement) + 'px';
        
        if(this.popup) {
            this.documentClickListener = this.renderer.listenGlobal('document', 'click', () => {
                if(!this.preventDocumentDefault) {
                    this.hide();
                }
                this.preventDocumentDefault = false;
            });
        }
    }
    
    toggle(event) {
        if(this.container.offsetParent)
            this.hide();
        else
            this.show(event);
    }
    
    show(event) {
        this.preventDocumentDefault = true;
        this.container.style.display = 'block';
        this.domHandler.absolutePosition(this.container, event.target);
        this.domHandler.fadeIn(this.container, 250);
    }
    
    hide() {
        this.container.style.display = 'none';
    }

    unsubscribe(item: any) {
        if(item.eventEmitter) {
            item.eventEmitter.unsubscribe();
        }
        
        if(item.items) {
            for(let childItem of item.items) {
                this.unsubscribe(childItem);
            }
        }
    }
    
    onClick(event) {
        this.preventDocumentDefault = true;
    }
    
    goBack() {
        this.left += this.menuWidth;
    }
        
    ngOnDestroy() {
        if(this.documentClickListener) {
            this.documentClickListener();
        }
        
        if(this.model) {
            for(let item of this.model) {
                this.unsubscribe(item);
            }
        }
    }

}

export class SlideMenuModule { }
