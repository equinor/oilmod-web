import {NgModule,Component,ElementRef,Input,Output,EventEmitter,HostListener,AfterContentInit,ContentChildren,QueryList} from '@angular/core';
import {CommonModule} from '@angular/common';
import {BlockableUI} from '../common/api';

export class TabViewNav {
    
    @Input() tabs: TabPanel[];

    @Input() orientation: string = 'top';
    
    @Output() onTabClick: EventEmitter<any> = new EventEmitter();
    
    @Output() onTabCloseClick: EventEmitter<any> = new EventEmitter();
    
    getDefaultHeaderClass(tab:TabPanel) {
        let styleClass = 'ui-state-default ui-corner-' + this.orientation; 
        if(tab.headerStyleClass) {
            styleClass = styleClass + " " + tab.headerStyleClass;
        }
        return styleClass;
    }
    
    clickTab(event, tab: TabPanel) {
        this.onTabClick.emit({
            originalEvent: event,
            tab: tab
        })
    }
    
    clickClose(event, tab: TabPanel) {
        this.onTabCloseClick.emit({
            originalEvent: event,
            tab: tab
        })
    }
}

export class TabPanel {

    @Input() header: string;

    @Input() selected: boolean;

    @Input() disabled: boolean;

    @Input() closable: boolean;

    @Input() headerStyle: any;

    @Input() headerStyleClass: string;

    @Input() leftIcon: string;

    @Input() rightIcon: string;

    public closed: boolean;

    public lazy: boolean;
}

export class TabView implements AfterContentInit,BlockableUI {

    @Input() orientation: string = 'top';
    
    @Input() style: any;
    
    @Input() styleClass: string;
    
    @Input() controlClose: boolean;
    
    @Input() lazy: boolean;
    
    @ContentChildren(TabPanel) tabPanels: QueryList<TabPanel>;

    @Output() onChange: EventEmitter<any> = new EventEmitter();

    @Output() onClose: EventEmitter<any> = new EventEmitter();
    
    initialized: boolean;
    
    tabs: TabPanel[];
    
    private _activeIndex: number;

    constructor(public el: ElementRef) {}
    
    ngAfterContentInit() {
        this.initTabs();
        
        this.tabPanels.changes.subscribe(_ => {
            this.initTabs();
        });
    }
    
    initTabs(): void {
        this.tabs = this.tabPanels.toArray();
        for(let tab of this.tabs) {
            tab.lazy = this.lazy;
        }
        
        let selectedTab: TabPanel = this.findSelectedTab();
        if(!selectedTab && this.tabs.length) {
            if(this.activeIndex != null && this.tabs.length > this.activeIndex)
                this.tabs[this.activeIndex].selected = true;
            else 
                this.tabs[0].selected = true;
        }
    }
            
    open(event: Event, tab: TabPanel) {
        if(tab.disabled) {
            event.preventDefault();
            return;
        }
        
        if(!tab.selected) {
            let selectedTab: TabPanel = this.findSelectedTab();
            if(selectedTab) {
                selectedTab.selected = false
            }
            tab.selected = true;
            this.onChange.emit({originalEvent: event, index: this.findTabIndex(tab)});
        }
        event.preventDefault();
    }
    
    close(event: Event, tab: TabPanel) {  
        if(this.controlClose) {
            this.onClose.emit({
                originalEvent: event, 
                index: this.findTabIndex(tab),
                close: () => {
                    this.closeTab(tab);
                }}
            );
        }
        else {
            this.closeTab(tab);
            this.onClose.emit({
                originalEvent: event, 
                index: this.findTabIndex(tab)
            });
        }
        
        event.stopPropagation();
    }
    
    closeTab(tab: TabPanel) {
        if(tab.selected) {
            tab.selected = false;
            for(let i = 0; i < this.tabs.length; i++) {
                let tabPanel = this.tabs[i];
                if(!tabPanel.closed&&!tab.disabled) {
                    tabPanel.selected = true;
                    break;
                }
            }
        }
        
        tab.closed = true;
    }
    
    findSelectedTab() {
        for(let i = 0; i < this.tabs.length; i++) {
            if(this.tabs[i].selected) {
                return this.tabs[i];
            }
        }
        return null;
    }
    
    findTabIndex(tab: TabPanel) {
        let index = -1;
        for(let i = 0; i < this.tabs.length; i++) {
            if(this.tabs[i] == tab) {
                index = i;
                break;
            }
        }
        return index;
    }
    
    getBlockableElement(): HTMLElement {
        return this.el.nativeElement.children[0];
    }
    
    @Input() get activeIndex(): number {
        return this._activeIndex;
    }

    set activeIndex(val:number) {
        this._activeIndex = val;
        
        if(this.tabs && this.tabs.length && this._activeIndex != null) {
            this.findSelectedTab().selected = false;
            this.tabs[this._activeIndex].selected = true;
        }        
    }
}

export class TabViewModule { }