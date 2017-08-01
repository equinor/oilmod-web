import {NgModule,Component,ElementRef,OnInit,AfterViewInit,AfterViewChecked,AfterContentInit,EventEmitter,OnDestroy,Input,Output,TemplateRef,ContentChildren,QueryList,Renderer} from '@angular/core';
import {DomHandler} from '../dom/domhandler';
import {SharedModule,PrimeTemplate} from '../common/shared';
import {CommonModule} from '@angular/common';

export class Carousel implements OnInit,AfterViewChecked,AfterViewInit,OnDestroy{
    
    @Input() numVisible: number = 3;

    @Input() firstVisible: number = 0;

    @Input() headerText: string;

    @Input() circular: boolean = false;

    @Input() breakpoint: number = 560;

    @Input() responsive: boolean = true;

    @Input() autoplayInterval: number = 0;
    
    @Input() effectDuration: any = '1s';
        
    @Input() easing: string = 'ease-out';

    @Input() pageLinks: number = 3;

    @Input() style: any;

    @Input() styleClass: string;
    
    @Output() onPage: EventEmitter<any> = new EventEmitter();
    
    @ContentChildren(PrimeTemplate) templates: QueryList<any>;
    
    public _value: any[];
    
    public itemTemplate: TemplateRef<any>;
        
    public container: any;    
    
    public left: any = 0;
    
    public viewport: any;
    
    public itemsContainer: any;
    
    public items: any;
    
    public columns: any;
        
    public page: number;
                    
    public valuesChanged: any;
    
    public interval: any;
    
    public anchorPageLinks: any[];
    
    public mobileDropdownOptions: any[];
    
    public selectDropdownOptions: any[];
    
    public shrinked: boolean;
    
    documentResponsiveListener: any;
    
    differ: any;

    constructor(public el: ElementRef, public domHandler: DomHandler, public renderer: Renderer) {
        
    }
    
    ngAfterContentInit() {
        this.templates.forEach((item) => {
            switch(item.getType()) {
                case 'item':
                    this.itemTemplate = item.template;
                break;
                
                default:
                    this.itemTemplate = item.template;
                break;
            }
        });
    }
    
    @Input() get value(): any[] {
        return this._value;
    }

    set value(val:any[]) {
        this._value = val;
        this.handleDataChange();
    }
    
    handleDataChange() {
        if(this.value && this.value.length) {
            if(this.value.length && this.firstVisible >= this.value.length) {
                this.setPage(this.totalPages - 1);
            }
        }
        else {
            this.setPage(0);
        }

        this.valuesChanged = true;
        
        if(this.autoplayInterval) {
            this.stopAutoplay();
        }
        
        this.updateMobileDropdown();
        this.updateLinks();
        this.updateDropdown();
    }
        
    ngAfterViewChecked() {
        if(this.valuesChanged) {
            this.render();
            this.valuesChanged = false;
        }
    }
    
    ngOnInit() {
        if(window.innerWidth <= this.breakpoint) {
            this.shrinked = true;
            this.columns = 1;
        }
        else {
            this.shrinked = false;
            this.columns = this.numVisible;
        }
        this.page = Math.floor(this.firstVisible / this.columns);
    }

    ngAfterViewInit() {
        this.container = this.el.nativeElement.children[0];
        this.viewport = this.domHandler.findSingle(this.el.nativeElement, 'div.ui-carousel-viewport');
        this.itemsContainer = this.domHandler.findSingle(this.el.nativeElement, 'ul.ui-carousel-items');    

        if(this.responsive) {
            this.documentResponsiveListener = this.renderer.listenGlobal('window', 'resize', (event) => {
                this.updateState();
            });
        }
        
        if(this.value && this.value.length) {
            this.render();
        }
    }
    
    updateLinks() {
        this.anchorPageLinks = [];
        for (let i = 0; i < this.totalPages; i++) {
            this.anchorPageLinks.push(i);
        }
    }
    
    updateDropdown() {
        this.selectDropdownOptions = [];
        for (let i = 0; i < this.totalPages; i++) {
            this.selectDropdownOptions.push(i);
        }
    }
    
    updateMobileDropdown() {
        this.mobileDropdownOptions = [];
        for (let i = 0; i < this.value.length; i++) {
            this.mobileDropdownOptions.push(i);
        }
    }
    
    render() {
        this.items = this.domHandler.find(this.itemsContainer,'li');
        this.calculateItemWidths();
        
        if(!this.responsive) {
            this.container.style.width = (this.domHandler.width(this.container)) + 'px';
        }
        
        if(this.autoplayInterval) {
            this.circular = true;
            this.startAutoplay();
        }
    }
    
    calculateItemWidths () {
        let firstItem = (this.items && this.items.length) ? this.items[0] : null;
        if(firstItem) {
            for (let i = 0; i < this.items.length; i++) {
                this.items[i].style.width = ((this.domHandler.innerWidth(this.viewport) - (this.domHandler.getHorizontalMargin(firstItem) * this.columns)) / this.columns) + 'px';
            }
        }
    }
    
    onNextNav() {
        let lastPage = (this.page === (this.totalPages - 1));

        if(!lastPage)
            this.setPage(this.page + 1);
        else if(this.circular)
            this.setPage(0);
    }
    
    onPrevNav() {
        if(this.page !== 0)
            this.setPage(this.page - 1);
        else if(this.circular)
            this.setPage(this.totalPages - 1);
    }
    
    setPageWithLink(event, p: number) {
        this.setPage(p);
        event.preventDefault();
    }
    
    setPage(p, enforce?: boolean) {
        if(p !== this.page || enforce) {
            this.page = p;
            this.left = (-1 * (this.domHandler.innerWidth(this.viewport) * this.page));
            this.firstVisible = this.page * this.columns;
            this.onPage.emit({
                page: this.page
            });
        }
    }
    
    onDropdownChange(val: string) {
        this.setPage(parseInt(val));
    }
    
    get displayPageLinks(): boolean {
        return (this.totalPages <= this.pageLinks && !this.shrinked);
    }
    
    get displayPageDropdown(): boolean {
        return (this.totalPages > this.pageLinks && !this.shrinked);
    }
    
    get totalPages(): number {
        return (this.value && this.value.length) ? Math.ceil(this.value.length / this.columns) : 0;
    }
        
    routerDisplay () {
        let win = window;
        if(win.innerWidth <= this.breakpoint)
            return true;
        else
            return false;
    }
    
    updateState() {
        let win = window;
        if(win.innerWidth <= this.breakpoint) {
            this.shrinked = true;
            this.columns = 1;
        }
        else if(this.shrinked) {
            this.shrinked = false;
            this.columns = this.numVisible;
            this.updateLinks();
            this.updateDropdown();
        }
        
        this.calculateItemWidths();
        this.setPage(Math.floor(this.firstVisible / this.columns), true);
    }
    
    startAutoplay() {
        this.interval = setInterval(() => {
            if(this.page === (this.totalPages - 1))
                this.setPage(0);
            else
                this.setPage(this.page + 1);
        }, 
        this.autoplayInterval);
    }

    stopAutoplay() {
        clearInterval(this.interval);
    }
    
    ngOnDestroy() {
        if(this.documentResponsiveListener) {
            this.documentResponsiveListener();
        }
        
        if(this.autoplayInterval) {
            this.stopAutoplay();
        }
    }
}

export class CarouselModule { }