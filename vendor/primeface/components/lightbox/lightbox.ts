import {NgModule,Component,ElementRef,Input,Output,Renderer,AfterViewInit,OnDestroy} from '@angular/core';
import {CommonModule} from '@angular/common';
import {DomHandler} from '../dom/domhandler';

export class Lightbox implements AfterViewInit,OnDestroy{

    @Input() images: any[];
    
    @Input() type: string = 'image';

    @Input() style: any;
        
    @Input() styleClass: string;
    
    @Input() appendTo: any;
    
    @Input() easing: 'ease-out';
    
    @Input() effectDuration: any = '500ms';
                
    public visible: boolean;
    
    public loading: boolean;
        
    public currentImage: any;
    
    public captionText: string;
    
    public zindex: any;
    
    public panel: any;
    
    public index: number;
    
    public mask: any;
    
    public preventDocumentClickListener: boolean;
    
    public documentClickListener: any;

    constructor(public el: ElementRef, public domHandler: DomHandler, public renderer: Renderer) {}
                
    onImageClick(event,image,i,content) {
        this.index = i;
        this.loading = true;
        content.style.width = 32 + 'px';
        content.style.height = 32 + 'px';
        this.show();
        this.displayImage(image);
        
        this.preventDocumentClickListener = true;
        event.preventDefault();
    }
    
    ngAfterViewInit() {
        this.panel = this.domHandler.findSingle(this.el.nativeElement, '.ui-lightbox ');
        
        if(this.appendTo) {
            if(this.appendTo === 'body')
                document.body.appendChild(this.panel);
            else
                this.domHandler.appendChild(this.panel, this.appendTo);
        }
        
        this.documentClickListener = this.renderer.listenGlobal('document', 'click', (event) => {
            if(!this.preventDocumentClickListener&&this.visible) {
                this.hide(event);
            }
            this.preventDocumentClickListener = false;
        });
    }
    
    onLinkClick(event,content) {
        this.show();
        this.preventDocumentClickListener = true;
        event.preventDefault();
    }
    
    displayImage(image) {
        setTimeout(() => {
            this.currentImage = image;
            this.captionText = image.title;
        }, 1000);
    }
    
    show() {
        this.mask = document.createElement('div');
        this.mask.style.zIndex = ++DomHandler.zindex;
        this.domHandler.addMultipleClasses(this.mask, 'ui-widget-overlay ui-dialog-mask');
        document.body.appendChild(this.mask);
        
        this.zindex = ++DomHandler.zindex;
        this.center();
        this.visible = true;
    }
    
    hide(event) {
        this.captionText = null;
        this.index = null;
        this.currentImage = null;
        this.visible = false;
        this.panel.style.left = 'auto';
        this.panel.style.top = 'auto';
        
        if(this.mask) {
            document.body.removeChild(this.mask);
            this.mask = null;
        }
        
        event.preventDefault();
    }
    
    center() {
        let elementWidth = this.domHandler.getOuterWidth(this.panel);
        let elementHeight = this.domHandler.getOuterHeight(this.panel);
        if(elementWidth == 0 && elementHeight == 0) {
            this.panel.style.visibility = 'hidden';
            this.panel.style.display = 'block';
            elementWidth = this.domHandler.getOuterWidth(this.panel);
            elementHeight = this.domHandler.getOuterHeight(this.panel);
            this.panel.style.display = 'none';
            this.panel.style.visibility = 'visible';
        }
        let viewport = this.domHandler.getViewport();
        let x = (viewport.width - elementWidth) / 2;
        let y = (viewport.height - elementHeight) / 2;

        this.panel.style.left = x + 'px';
        this.panel.style.top = y + 'px';
    }
        
    onImageLoad(event,content) {
        let image = event.target;
        image.style.visibility = 'hidden';
        image.style.display = 'block';
        let imageWidth = this.domHandler.getOuterWidth(image);
        let imageHeight = this.domHandler.getOuterHeight(image);
        image.style.display = 'none';
        image.style.visibility = 'visible';

        content.style.width = imageWidth + 'px';
        content.style.height = imageHeight + 'px';
        this.panel.style.left = parseInt(this.panel.style.left) + (this.domHandler.getOuterWidth(this.panel) - imageWidth) / 2 + 'px';
        this.panel.style.top = parseInt(this.panel.style.top) + (this.domHandler.getOuterHeight(this.panel) - imageHeight) / 2 + 'px';

        setTimeout(() => {
            this.domHandler.fadeIn(image, 500);
            image.style.display = 'block';
            //this.captionText = this.currentImage.title;
            this.loading = false;
        }, parseInt(this.effectDuration));
    }
    
    prev(placeholder: any) {
        this.captionText = null;
        this.loading = true;
        placeholder.style.display = 'none';
        if(this.index > 0) {
            this.displayImage(this.images[--this.index]);
        }
    }
    
    next(placeholder: any) {
        this.captionText = null;
        this.loading = true;
        placeholder.style.display = 'none';
        if(this.index <= (this.images.length - 1)) {
            this.displayImage(this.images[++this.index]);
        }
    }
        
    get leftVisible():boolean {
        return this.images && this.images.length && this.index != 0 && !this.loading; 
    }
    
    get rightVisible():boolean {
        return this.images && this.images.length && this.index < (this.images.length - 1) && !this.loading; 
    }
    
    ngOnDestroy() {
        if(this.documentClickListener) {
            this.documentClickListener();
        }
        
        if(this.appendTo) {
            this.el.nativeElement.appendChild(this.panel);
        }
    }
        
}

export class LightboxModule { }
