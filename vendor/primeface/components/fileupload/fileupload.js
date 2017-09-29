"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var shared_1 = require("../common/shared");
var FileUpload = (function () {
    function FileUpload(sanitizer) {
        this.sanitizer = sanitizer;
        this.invalidFileSizeMessageSummary = '{0}: Invalid file size, ';
        this.invalidFileSizeMessageDetail = 'maximum upload size is {0}.';
        this.invalidFileTypeMessageSummary = '{0}: Invalid file type, ';
        this.invalidFileTypeMessageDetail = 'allowed file types: {0}.';
        this.previewWidth = 50;
        this.chooseLabel = 'Choose';
        this.uploadLabel = 'Upload';
        this.cancelLabel = 'Cancel';
        this.onBeforeUpload = new core_1.EventEmitter();
        this.onBeforeSend = new core_1.EventEmitter();
        this.onUpload = new core_1.EventEmitter();
        this.onError = new core_1.EventEmitter();
        this.onClear = new core_1.EventEmitter();
        this.onSelect = new core_1.EventEmitter();
        this.progress = 0;
    }
    FileUpload.prototype.ngOnInit = function () {
        this.files = [];
    };
    FileUpload.prototype.ngAfterContentInit = function () {
        var _this = this;
        this.templates.forEach(function (item) {
            switch (item.getType()) {
                case 'file':
                    _this.fileTemplate = item.template;
                    break;
                case 'content':
                    _this.contentTemplate = item.template;
                    break;
                case 'toolbar':
                    _this.toolbarTemplate = item.template;
                    break;
                default:
                    _this.fileTemplate = item.template;
                    break;
            }
        });
    };
    FileUpload.prototype.onChooseClick = function (event, fileInput) {
        fileInput.value = null;
        fileInput.click();
    };
    FileUpload.prototype.onFileSelect = function (event) {
        this.msgs = [];
        if (!this.multiple) {
            this.files = [];
        }
        var files = event.dataTransfer ? event.dataTransfer.files : event.target.files;
        for (var i = 0; i < files.length; i++) {
            var file = files[i];
            if (this.validate(file)) {
                if (this.isImage(file)) {
                    file.objectURL = this.sanitizer.bypassSecurityTrustUrl((window.URL.createObjectURL(files[i])));
                }
                this.files.push(files[i]);
            }
        }
        this.onSelect.emit({ originalEvent: event, files: files });
        if (this.hasFiles() && this.auto) {
            this.upload();
        }
    };
    FileUpload.prototype.validate = function (file) {
        if (this.accept && !this.isFileTypeValid(file)) {
            this.msgs.push({
                severity: 'error',
                summary: this.invalidFileTypeMessageSummary.replace('{0}', file.name),
                detail: this.invalidFileTypeMessageDetail.replace('{0}', this.accept)
            });
            return false;
        }
        if (this.maxFileSize && file.size > this.maxFileSize) {
            this.msgs.push({
                severity: 'error',
                summary: this.invalidFileSizeMessageSummary.replace('{0}', file.name),
                detail: this.invalidFileSizeMessageDetail.replace('{0}', this.formatSize(this.maxFileSize))
            });
            return false;
        }
        return true;
    };
    FileUpload.prototype.isFileTypeValid = function (file) {
        var acceptableTypes = this.accept.split(',');
        for (var _i = 0, acceptableTypes_1 = acceptableTypes; _i < acceptableTypes_1.length; _i++) {
            var type = acceptableTypes_1[_i];
            var acceptable = this.isWildcard(type) ? this.getTypeClass(file.type) === this.getTypeClass(type)
                : this.getFileExtension(file) === type;
            if (acceptable) {
                return true;
            }
        }
        return false;
    };
    FileUpload.prototype.getTypeClass = function (fileType) {
        return fileType.substring(0, fileType.indexOf('/'));
    };
    FileUpload.prototype.isWildcard = function (fileType) {
        return fileType.indexOf('*') !== -1;
    };
    FileUpload.prototype.getFileExtension = function (file) {
        return '.' + file.name.split('.').pop();
    };
    FileUpload.prototype.isImage = function (file) {
        return /^image\//.test(file.type);
    };
    FileUpload.prototype.onImageLoad = function (img) {
        window.URL.revokeObjectURL(img.src);
    };
    FileUpload.prototype.upload = function () {
        var _this = this;
        this.msgs = [];
        var xhr = new XMLHttpRequest(), formData = new FormData();
        this.onBeforeUpload.emit({
            'xhr': xhr,
            'formData': formData
        });
        for (var i = 0; i < this.files.length; i++) {
            formData.append(this.name, this.files[i], this.files[i].name);
        }
        xhr.upload.addEventListener('progress', function (e) {
            if (e.lengthComputable) {
                _this.progress = Math.round((e.loaded * 100) / e.total);
            }
        }, false);
        xhr.onreadystatechange = function () {
            if (xhr.readyState == 4) {
                _this.progress = 0;
                if (xhr.status >= 200 && xhr.status < 300)
                    _this.onUpload.emit({ xhr: xhr, files: _this.files });
                else
                    _this.onError.emit({ xhr: xhr, files: _this.files });
                _this.clear();
            }
        };
        xhr.open('POST', this.url, true);
        this.onBeforeSend.emit({
            'xhr': xhr,
            'formData': formData
        });
        xhr.send(formData);
    };
    FileUpload.prototype.clear = function () {
        this.files = [];
        this.onClear.emit();
    };
    FileUpload.prototype.remove = function (index) {
        this.files.splice(index, 1);
    };
    FileUpload.prototype.hasFiles = function () {
        return this.files && this.files.length > 0;
    };
    FileUpload.prototype.onDragEnter = function (e) {
        if (!this.disabled) {
            e.stopPropagation();
            e.preventDefault();
        }
    };
    FileUpload.prototype.onDragOver = function (e) {
        if (!this.disabled) {
            this.dragHighlight = true;
            e.stopPropagation();
            e.preventDefault();
        }
    };
    FileUpload.prototype.onDragLeave = function (e) {
        if (!this.disabled) {
            this.dragHighlight = false;
        }
    };
    FileUpload.prototype.onDrop = function (e) {
        if (!this.disabled) {
            this.dragHighlight = false;
            e.stopPropagation();
            e.preventDefault();
            this.onFileSelect(e);
        }
    };
    FileUpload.prototype.formatSize = function (bytes) {
        if (bytes == 0) {
            return '0 B';
        }
        var k = 1000, dm = 3, sizes = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'], i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
    };
    return FileUpload;
}());
__decorate([
    core_1.Input()
], FileUpload.prototype, "name", void 0);
__decorate([
    core_1.Input()
], FileUpload.prototype, "url", void 0);
__decorate([
    core_1.Input()
], FileUpload.prototype, "multiple", void 0);
__decorate([
    core_1.Input()
], FileUpload.prototype, "accept", void 0);
__decorate([
    core_1.Input()
], FileUpload.prototype, "disabled", void 0);
__decorate([
    core_1.Input()
], FileUpload.prototype, "auto", void 0);
__decorate([
    core_1.Input()
], FileUpload.prototype, "maxFileSize", void 0);
__decorate([
    core_1.Input()
], FileUpload.prototype, "invalidFileSizeMessageSummary", void 0);
__decorate([
    core_1.Input()
], FileUpload.prototype, "invalidFileSizeMessageDetail", void 0);
__decorate([
    core_1.Input()
], FileUpload.prototype, "invalidFileTypeMessageSummary", void 0);
__decorate([
    core_1.Input()
], FileUpload.prototype, "invalidFileTypeMessageDetail", void 0);
__decorate([
    core_1.Input()
], FileUpload.prototype, "style", void 0);
__decorate([
    core_1.Input()
], FileUpload.prototype, "styleClass", void 0);
__decorate([
    core_1.Input()
], FileUpload.prototype, "previewWidth", void 0);
__decorate([
    core_1.Input()
], FileUpload.prototype, "chooseLabel", void 0);
__decorate([
    core_1.Input()
], FileUpload.prototype, "uploadLabel", void 0);
__decorate([
    core_1.Input()
], FileUpload.prototype, "cancelLabel", void 0);
__decorate([
    core_1.Output()
], FileUpload.prototype, "onBeforeUpload", void 0);
__decorate([
    core_1.Output()
], FileUpload.prototype, "onBeforeSend", void 0);
__decorate([
    core_1.Output()
], FileUpload.prototype, "onUpload", void 0);
__decorate([
    core_1.Output()
], FileUpload.prototype, "onError", void 0);
__decorate([
    core_1.Output()
], FileUpload.prototype, "onClear", void 0);
__decorate([
    core_1.Output()
], FileUpload.prototype, "onSelect", void 0);
__decorate([
    core_1.ContentChildren(shared_1.PrimeTemplate)
], FileUpload.prototype, "templates", void 0);
exports.FileUpload = FileUpload;
var FileUploadModule = (function () {
    function FileUploadModule() {
    }
    return FileUploadModule;
}());
exports.FileUploadModule = FileUploadModule;
