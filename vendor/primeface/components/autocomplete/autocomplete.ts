import {NgModule,Component,ViewChild,ElementRef,AfterViewInit,AfterContentInit,AfterViewChecked,Input,Output,EventEmitter,ContentChildren,QueryList,TemplateRef,Renderer,forwardRef,ChangeDetectorRef} from '@angular/core';
import {CommonModule} from '@angular/common';
import {InputTextModule} from '../inputtext/inputtext';
import {ButtonModule} from '../button/button';
import {SharedModule,PrimeTemplate} from '../common/shared';
import {DomHandler} from '../dom/domhandler';
import {ObjectUtils} from '../utils/ObjectUtils';
import {NG_VALUE_ACCESSOR, ControlValueAccessor} from '@angular/forms';

export const AUTOCOMPLETE_VALUE_ACCESSOR: any = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => AutoComplete),
  multi: true
};

export class AutoComplete implements AfterViewInit,AfterViewChecked,ControlValueAccessor {
    
    @Input() minLength: number = 1;
    
    @Input() delay: number = 300;
    
    @Input() style: any;
    
    @Input() styleClass: string;
    
    @Input() inputStyle: any;

    @Input() inputId: string;
    
    @Input() inputStyleClass: string;
    
    @Input() placeholder: string;
    
    @Input() readonly: boolean;
        
    @Input() disabled: boolean;
    
    @Input() maxlength: number;
    
    @Input() size: number;
    
    @Input() appendTo: any;
    
    @Input() autoHighlight: boolean;
    
    @Input() type: string = 'text';

    @Output() completeMethod: EventEmitter<any> = new EventEmitter();
    
    @Output() onSelect: EventEmitter<any> = new EventEmitter();
    
    @Output() onUnselect: EventEmitter<any> = new EventEmitter();

    @Output() onFocus: EventEmitter<any> = new EventEmitter();
    
    @Output() onBlur: EventEmitter<any> = new EventEmitter();
    
    @Output() onDropdownClick: EventEmitter<any> = new EventEmitter();
    
    @Input() field: string;
    
    @Input() scrollHeight: string = '200px';
    
    @Input() dropdown: boolean;
    
    @Input() multiple: boolean;

    @Input() tabindex: number;
    
    @Input() dataKey: string;
    
    @ViewChild('in') inputEL: ElementRef;
    
    @ViewChild('multiIn') multiInputEL: ElementRef;
    
    @ViewChild('panel') panelEL: ElementRef;
    
    @ViewChild('multiContainer') multiContainerEL: ElementRef;
        
    @ContentChildren(PrimeTemplate) templates: QueryList<any>;
    
    public itemTemplate: TemplateRef<any>;
    
    public selectedItemTemplate: TemplateRef<any>;
    
    value: any;
    
    _suggestions: any[];
    
    onModelChange: Function = () => {};
    
    onModelTouched: Function = () => {};
    
    timeout: any;
    
    differ: any;
        
    panelVisible: boolean = false;
    
    documentClickListener: any;
    
    suggestionsUpdated: boolean;
    
    highlightOption: any;
    
    highlightOptionChanged: boolean;
    
    focus: boolean = false;
        
    filled: boolean;
    
    inputClick: boolean;
        
    constructor(public el: ElementRef, public domHandler: DomHandler, public renderer: Renderer, public objectUtils: ObjectUtils, public cd: ChangeDetectorRef) {}
    
    @Input() get suggestions(): any[] {
        return this._suggestions;
    }

    set suggestions(val:any[]) {
        this._suggestions = val;
        
        if(this.panelEL && this.panelEL.nativeElement) {
            if(this._suggestions && this._suggestions.length) {
                this.show();
                this.suggestionsUpdated = true;
                
                if(this.autoHighlight) {
                    this.highlightOption = this._suggestions[0];
                }
            }
            else {
                this.hide();
            }
        }
    }
        
    ngAfterContentInit() {
        this.templates.forEach((item) => {
            switch(item.getType()) {
                case 'item':
                    this.itemTemplate = item.template;
                break;

                case 'selectedItem':
                    this.selectedItemTemplate = item.template;
                break;
                
                default:
                    this.itemTemplate = item.template;
                break;
            }
        });
    }
    
    ngAfterViewInit() {        
        this.documentClickListener = this.renderer.listenGlobal('document', 'click', () => {
            if(this.inputClick)
                this.inputClick = false;
            else
                this.hide();
                
            this.cd.markForCheck();
        });

        if(this.appendTo) {
            if(this.appendTo === 'body')
                document.body.appendChild(this.panelEL.nativeElement);
            else
                this.domHandler.appendChild(this.panelEL.nativeElement, this.appendTo);
        }
    }
    
    ngAfterViewChecked() {
        if(this.suggestionsUpdated) {
            this.align();
            this.suggestionsUpdated = false;
        }
        
        if(this.highlightOptionChanged) {
            let listItem = this.domHandler.findSingle(this.panelEL.nativeElement, 'li.ui-state-highlight');
            if(listItem) {
                this.domHandler.scrollInView(this.panelEL.nativeElement, listItem);
            }
            this.highlightOptionChanged = false;
        }
    }
    
    writeValue(value: any) : void {
        this.value = value;
        this.filled = this.value && this.value != '';
    }
    
    registerOnChange(fn: Function): void {
        this.onModelChange = fn;
    }

    registerOnTouched(fn: Function): void {
        this.onModelTouched = fn;
    }
    
    setDisabledState(val: boolean): void {
        this.disabled = val;
    }

    onInput(event: KeyboardEvent) {
        let value = (<HTMLInputElement> event.target).value;
        if(!this.multiple) {
            this.onModelChange(value);
        }
        
        if(value.length === 0) {
           this.hide();
        }
        
        if(value.length >= this.minLength) {
            //Cancel the search request if user types within the timeout
            if(this.timeout) {
                clearTimeout(this.timeout);
            }

            this.timeout = setTimeout(() => {
                this.search(event, value);
            }, this.delay);
        }
        else {
            this.suggestions = null;
        }
        this.updateFilledState();
    }
    
    onInputClick(event: MouseEvent) {
        this.inputClick = true;
    }
    
    search(event: any, query: string) {
        //allow empty string but not undefined or null
       if(query === undefined || query === null) {
           return;
       }
       
       this.completeMethod.emit({
           originalEvent: event,
           query: query
       });
    }
            
    selectItem(option: any) {
        if(this.multiple) {
            this.multiInputEL.nativeElement.value = '';
            this.value = this.value||[];
            if(!this.isSelected(option)) {
                this.value = [...this.value,option];
                this.onModelChange(this.value);
            }
        }
        else {
            this.inputEL.nativeElement.value = this.field ? this.objectUtils.resolveFieldData(option, this.field): option;
            this.value = option;
            this.onModelChange(this.value);
        }
        
        this.onSelect.emit(option);
        
        this.focusInput();
    }
    
    show() {
        if(this.multiInputEL || this.inputEL) {
            let hasFocus = this.multiple ? document.activeElement == this.multiInputEL.nativeElement : document.activeElement == this.inputEL.nativeElement ;
            if(!this.panelVisible && hasFocus) {
                this.panelVisible = true;
                this.panelEL.nativeElement.style.zIndex = ++DomHandler.zindex;
                this.domHandler.fadeIn(this.panelEL.nativeElement, 200);
            }   
        }
    }
    
    align() {
        if(this.appendTo)
            this.domHandler.absolutePosition(this.panelEL.nativeElement, (this.multiple ? this.multiContainerEL.nativeElement : this.inputEL.nativeElement));
        else
            this.domHandler.relativePosition(this.panelEL.nativeElement, (this.multiple ? this.multiContainerEL.nativeElement : this.inputEL.nativeElement));
    }
    
    hide() {
        this.panelVisible = false;
    }
    
    handleDropdownClick(event) {
        this.focusInput();
        let queryValue = this.multiple ? this.multiInputEL.nativeElement.value : this.inputEL.nativeElement.value;
        this.onDropdownClick.emit({
            originalEvent: event,
            query: queryValue
        });
    }
    
    focusInput() {
        if(this.multiple)
            this.multiInputEL.nativeElement.focus();
        else
            this.inputEL.nativeElement.focus();
    }
    
    removeItem(item: any) {
        let itemIndex = this.domHandler.index(item);
        let removedValue = this.value[itemIndex];
        this.value = this.value.filter((val, i) => i!=itemIndex);
        this.onUnselect.emit(removedValue);
        this.onModelChange(this.value);
    }
        
    onKeydown(event) {
        if(this.panelVisible) {
            let highlightItemIndex = this.findOptionIndex(this.highlightOption);
            
            switch(event.which) {
                //down
                case 40:
                    if(highlightItemIndex != -1) {
                        var nextItemIndex = highlightItemIndex + 1;
                        if(nextItemIndex != (this.suggestions.length)) {
                            this.highlightOption = this.suggestions[nextItemIndex];
                            this.highlightOptionChanged = true;
                        }
                    }
                    else {
                        this.highlightOption = this.suggestions[0];
                    }
                    
                    event.preventDefault();
                break;
                
                //up
                case 38:
                    if(highlightItemIndex > 0) {
                        let prevItemIndex = highlightItemIndex - 1;
                        this.highlightOption = this.suggestions[prevItemIndex];
                        this.highlightOptionChanged = true;
                    }
                    
                    event.preventDefault();
                break;
                
                //enter
                case 13:
                    if(this.highlightOption) {
                        this.selectItem(this.highlightOption);
                        this.hide();
                    }
                    event.preventDefault();
                break;
                
                //escape
                case 27:
                    this.hide();
                    event.preventDefault();
                break;

                
                //tab
                case 9:
                    if(this.highlightOption) {
                        this.selectItem(this.highlightOption);
                    }
                    this.hide();
                break;
            }
        } else {
            if(event.which === 40 && this.suggestions) {
                this.search(event,event.target.value);
            }
        }
        
        if(this.multiple) {
            switch(event.which) {
                //backspace
                case 8:
                    if(this.value && this.value.length && !this.multiInputEL.nativeElement.value) {
                        this.value = [...this.value];
                        let removedValue = this.value.pop();
                        this.onUnselect.emit(removedValue);
                        this.onModelChange(this.value);
                    }
                break;
            }
        }
    }
    
    onInputFocus(event) {
        this.focus = true;
        this.onFocus.emit(event);
    }
    
    onInputBlur(event) {
        this.focus = false;
        this.onModelTouched();
        this.onBlur.emit(event);
    }
        
    isSelected(val: any): boolean {
        let selected: boolean = false;
        if(this.value && this.value.length) {
            for(let i = 0; i < this.value.length; i++) {
                if(this.objectUtils.equals(this.value[i], val, this.dataKey)) {
                    selected = true;
                    break;
                }
            }
        }
        return selected;
    }
    
    findOptionIndex(option): number {        
        let index: number = -1;
        if(this.suggestions) {
            for(let i = 0; i < this.suggestions.length; i++) {
                if(this.objectUtils.equals(option, this.suggestions[i])) {
                    index = i;
                    break;
                }
            }
        }
                
        return index;
    }
    
    updateFilledState() {
        if(this.multiple)
            this.filled = (this.value && this.value.length) || (this.multiInputEL && this.multiInputEL.nativeElement && this.multiInputEL.nativeElement.value != '');
        else
            this.filled = this.inputEL && this.inputEL.nativeElement && this.inputEL.nativeElement.value != '';
    }
    
    ngOnDestroy() {
        if(this.documentClickListener) {
            this.documentClickListener();
        }

        if(this.appendTo) {
            this.el.nativeElement.appendChild(this.panelEL.nativeElement);
        }
    }
}

export class AutoCompleteModule { }