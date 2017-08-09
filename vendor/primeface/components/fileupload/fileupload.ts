import {NgModule,Component,OnInit,Input,Output,EventEmitter,TemplateRef,AfterContentInit,ContentChildren,QueryList} from '@angular/core';
import {CommonModule} from '@angular/common';
import {DomSanitizer} from '@angular/platform-browser';
import {ButtonModule} from '../button/button';
import {MessagesModule} from '../messages/messages';
import {ProgressBarModule} from '../progressbar/progressbar';
import {Message} from '../common/api';
import {PrimeTemplate,SharedModule} from '../common/shared';

export class FileUpload implements OnInit,AfterContentInit {
    
    @Input() name: string;
    
    @Input() url: string;
    
    @Input() multiple: boolean;
    
    @Input() accept: string;
    
    @Input() disabled: boolean;
    
    @Input() auto: boolean;
        
    @Input() maxFileSize: number;
    
    @Input() invalidFileSizeMessageSummary: string = '{0}: Invalid file size, ';
    
    @Input() invalidFileSizeMessageDetail: string = 'maximum upload size is {0}.';

    @Input() invalidFileTypeMessageSummary: string = '{0}: Invalid file type, ';

    @Input() invalidFileTypeMessageDetail: string = 'allowed file types: {0}.';
    
    @Input() style: string;
    
    @Input() styleClass: string;
    
    @Input() previewWidth: number = 50;
    
    @Input() chooseLabel: string = 'Choose';
    
    @Input() uploadLabel: string = 'Upload';
    
    @Input() cancelLabel: string = 'Cancel';
        
    @Output() onBeforeUpload: EventEmitter<any> = new EventEmitter();
	
	  @Output() onBeforeSend: EventEmitter<any> = new EventEmitter();
        
    @Output() onUpload: EventEmitter<any> = new EventEmitter();
    
    @Output() onError: EventEmitter<any> = new EventEmitter();
    
    @Output() onClear: EventEmitter<any> = new EventEmitter();
    
    @Output() onSelect: EventEmitter<any> = new EventEmitter();
    
    @ContentChildren(PrimeTemplate) templates: QueryList<any>;
     
    public files: File[];
    
    public progress: number = 0;
    
    public dragHighlight: boolean;
    
    public msgs: Message[];
    
    public fileTemplate: TemplateRef<any>;
    
    public contentTemplate: TemplateRef<any>; 
    
    public toolbarTemplate: TemplateRef<any>; 
        
    constructor(protected sanitizer: DomSanitizer){}
    
    ngOnInit() {
        this.files = [];
    }
    
    ngAfterContentInit():void {
        this.templates.forEach((item) => {
            switch(item.getType()) {
                case 'file':
                    this.fileTemplate = item.template;
                break;
                
                case 'content':
                    this.contentTemplate = item.template;
                break;
                
                case 'toolbar':
                    this.toolbarTemplate = item.template;
                break;
                
                default:
                    this.fileTemplate = item.template;
                break;
            }
        });
    }
    
    onChooseClick(event, fileInput) {
        fileInput.value = null;
        fileInput.click();
    }
    
    onFileSelect(event) {
        this.msgs = [];
        if(!this.multiple) {
            this.files = [];
        }
        
        let files = event.dataTransfer ? event.dataTransfer.files : event.target.files;
        for(let i = 0; i < files.length; i++) {
            let file = files[i];
            if(this.validate(file)) {
                if(this.isImage(file)) {
                    file.objectURL = this.sanitizer.bypassSecurityTrustUrl((window.URL.createObjectURL(files[i])));
                }
                
                this.files.push(files[i]);
            }
        }
        
        this.onSelect.emit({originalEvent: event, files: files});
        
        if(this.hasFiles() && this.auto) {
            this.upload();
        }
    }
    
    validate(file: File): boolean {
        if(this.accept && !this.isFileTypeValid(file)) {
            this.msgs.push({
                severity: 'error',
                summary: this.invalidFileTypeMessageSummary.replace('{0}', file.name),
                detail: this.invalidFileTypeMessageDetail.replace('{0}', this.accept)
            });
            return false;
        }

        if(this.maxFileSize  && file.size > this.maxFileSize) {
            this.msgs.push({
                severity: 'error', 
                summary: this.invalidFileSizeMessageSummary.replace('{0}', file.name), 
                detail: this.invalidFileSizeMessageDetail.replace('{0}', this.formatSize(this.maxFileSize))
            });
            return false;
        }

        return true;
    }

    private isFileTypeValid(file: File): boolean {
        let acceptableTypes = this.accept.split(',');
        for(let type of acceptableTypes) {
            let acceptable = this.isWildcard(type) ? this.getTypeClass(file.type) === this.getTypeClass(type) 
                                                    : this.getFileExtension(file) === type;

            if(acceptable) {
                return true;
            }
        }

        return false;
    }

    getTypeClass(fileType: string): string {
        return fileType.substring(0, fileType.indexOf('/'));
    }

    isWildcard(fileType: string): boolean {
        return fileType.indexOf('*') !== -1;
    }
    
    getFileExtension(file: File): string {
        return '.' + file.name.split('.').pop();
    }
    
    isImage(file: File): boolean {
        return /^image\//.test(file.type);
    }
    
    onImageLoad(img: any) {
        window.URL.revokeObjectURL(img.src);
    }

    upload() {
        this.msgs = [];
        let xhr = new XMLHttpRequest(),
        formData = new FormData();

		this.onBeforeUpload.emit({
            'xhr': xhr,
            'formData': formData 
        });

        for(let i = 0; i < this.files.length; i++) {
            formData.append(this.name, this.files[i], this.files[i].name);
        }

        xhr.upload.addEventListener('progress', (e: ProgressEvent) => {
            if(e.lengthComputable) {
              this.progress = Math.round((e.loaded * 100) / e.total);
            }
          }, false);

        xhr.onreadystatechange = () => {
            if(xhr.readyState == 4) {
                this.progress = 0;
                
                if(xhr.status >= 200 && xhr.status < 300)
                    this.onUpload.emit({xhr: xhr, files: this.files});
                else
                    this.onError.emit({xhr: xhr, files: this.files});
                
                this.clear();
            }
        };
        
        xhr.open('POST', this.url, true);
		
		this.onBeforeSend.emit({
			'xhr': xhr,
            'formData': formData 
		});
        
        xhr.send(formData);
    }

    clear() {
        this.files = [];
        this.onClear.emit();
    }
    
    remove(index: number) {
        this.files.splice(index, 1);
    }
    
    hasFiles(): boolean {
        return this.files && this.files.length > 0;
    }
    
    onDragEnter(e) {
        if(!this.disabled) {
            e.stopPropagation();
            e.preventDefault();
        }
    }
    
    onDragOver(e) {
        if(!this.disabled) {
            this.dragHighlight = true;
            e.stopPropagation();
            e.preventDefault();
        }
    }
    
    onDragLeave(e) {
        if(!this.disabled) {
            this.dragHighlight = false;
        }
    }
    
    onDrop(e) {
        if(!this.disabled) {
            this.dragHighlight = false;
            e.stopPropagation();
            e.preventDefault();
            
            this.onFileSelect(e);
        }
    }
    
    formatSize(bytes) {
        if(bytes == 0) {
            return '0 B';
        }
        let k = 1000,
        dm = 3,
        sizes = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'],
        i = Math.floor(Math.log(bytes) / Math.log(k));
        
        return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
    }
}

export class FileUploadModule { }