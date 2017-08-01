import {NgModule,Component,ElementRef,AfterViewInit,Input,Output,EventEmitter,ContentChild,OnChanges,forwardRef} from '@angular/core';
import {CommonModule} from '@angular/common';
import {SharedModule,Header} from '../common/shared'
import {DomHandler} from '../dom/domhandler';
import {NG_VALUE_ACCESSOR, ControlValueAccessor} from '@angular/forms';

declare var Quill: any;

export const EDITOR_VALUE_ACCESSOR: any = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => Editor),
  multi: true
};

export class Editor implements AfterViewInit,ControlValueAccessor {
        
    @Output() onTextChange: EventEmitter<any> = new EventEmitter();
    
    @Output() onSelectionChange: EventEmitter<any> = new EventEmitter();
    
    @ContentChild(Header) toolbar;
    
    @Input() style: any;
        
    @Input() styleClass: string;
    
    @Input() placeholder: string;
    
    @Input() readonly: boolean;
    
    @Input() formats: string[];
    
    value: string;
    
    onModelChange: Function = () => {};
    
    onModelTouched: Function = () => {};
    
    quill: any;
    
    constructor(public el: ElementRef, public domHandler: DomHandler) {}

    ngAfterViewInit() {
        let editorElement = this.domHandler.findSingle(this.el.nativeElement ,'div.ui-editor-content'); 
        let toolbarElement = this.domHandler.findSingle(this.el.nativeElement ,'div.ui-editor-toolbar'); 
        
        this.quill = new Quill(editorElement, {
          modules: {
              toolbar: toolbarElement
          },
          placeholder: this.placeholder,
          readOnly: this.readonly,
          theme: 'snow',
          formats: this.formats
        });
                
        if(this.value) {
            this.quill.pasteHTML(this.value);
        }
        
        this.quill.on('text-change', (delta, oldContents, source) => {
            let html = editorElement.children[0].innerHTML;
            let text = this.quill.getText();
            if(html == '<p><br></p>') {
                html = null;
            }

            this.onTextChange.emit({
                htmlValue: html,
                textValue: text,
                delta: delta,
                source: source
            });
            
            this.onModelChange(html);

            if(source === 'user') {
                this.onModelTouched();
            }
        });
        
        this.quill.on('selection-change', (range, oldRange, source) => {
            this.onSelectionChange.emit({
                range: range,
                oldRange: oldRange,
                source: source
            });
        });
    }
        
    writeValue(value: any) : void {
        this.value = value;
                
        if(this.quill) {
            if(value)
                this.quill.pasteHTML(value);
            else
                this.quill.setText('');
        }
    }
    
    registerOnChange(fn: Function): void {
        this.onModelChange = fn;
    }

    registerOnTouched(fn: Function): void {
        this.onModelTouched = fn;
    }
}

export class EditorModule { }