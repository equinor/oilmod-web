"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var common_1 = require("@angular/common");
var fileupload_1 = require("../../vendor/primeface/components/fileupload/fileupload");
var sto_messages_component_1 = require("../sto-messages/sto-messages.component");
var sto_button_directive_1 = require("../sto-button/sto-button.directive");
var sto_shared_1 = require("../sto-shared/sto-shared");
var sto_progressbar_component_1 = require("../sto-progressbar/sto-progressbar.component");
var StoFileUploadComponent = (function (_super) {
    __extends(StoFileUploadComponent, _super);
    function StoFileUploadComponent(sanitizer) {
        var _this = _super.call(this, sanitizer) || this;
        _this.sanitizer = sanitizer;
        return _this;
    }
    StoFileUploadComponent.prototype.upload = function () {
        var _this = this;
        if (!this.multiple && this.files.length > 1) {
            this.onError.emit({
                files: [],
                xhr: {
                    statusText: 'Max 1 file',
                    responseText: 'Max 1 file'
                }
            });
            this.files = [];
            return;
        }
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
        console.log(this.url);
        xhr.open('POST', this.url, true);
        this.onBeforeSend.emit({
            'xhr': xhr,
            'formData': formData
        });
        xhr.send(formData);
    };
    return StoFileUploadComponent;
}(fileupload_1.FileUpload));
StoFileUploadComponent = __decorate([
    core_1.Component({
        selector: 'sto-fileUpload',
        templateUrl: './sto-fileupload.component.html',
        styleUrls: ['./sto-fileupload.component.scss']
    })
], StoFileUploadComponent);
exports.StoFileUploadComponent = StoFileUploadComponent;
var StoFileUploadModule = (function () {
    function StoFileUploadModule() {
    }
    return StoFileUploadModule;
}());
StoFileUploadModule = __decorate([
    core_1.NgModule({
        imports: [common_1.CommonModule, sto_button_directive_1.StoButtonModule, sto_messages_component_1.StoMessagesModule, sto_progressbar_component_1.StoProgressBarModule, sto_shared_1.StoSharedModule, sto_shared_1.StoSharedModule],
        exports: [StoFileUploadComponent],
        declarations: [StoFileUploadComponent]
    })
], StoFileUploadModule);
exports.StoFileUploadModule = StoFileUploadModule;
