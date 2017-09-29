"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var Messages = (function () {
    function Messages() {
        this.closable = true;
    }
    Messages.prototype.hasMessages = function () {
        return this.value && this.value.length > 0;
    };
    Messages.prototype.getSeverityClass = function () {
        return this.value[0].severity;
    };
    Messages.prototype.clear = function (event) {
        this.value.splice(0, this.value.length);
        event.preventDefault();
    };
    Object.defineProperty(Messages.prototype, "icon", {
        get: function () {
            var icon = null;
            if (this.hasMessages()) {
                var msg = this.value[0];
                switch (msg.severity) {
                    case 'success':
                        icon = 'fa-check';
                        break;
                    case 'info':
                        icon = 'fa-info-circle';
                        break;
                    case 'error':
                        icon = 'fa-close';
                        break;
                    case 'warn':
                        icon = 'fa-warning';
                        break;
                    case 'success':
                        icon = 'fa-check';
                        break;
                    default:
                        icon = 'fa-info-circle';
                        break;
                }
            }
            return icon;
        },
        enumerable: true,
        configurable: true
    });
    return Messages;
}());
__decorate([
    core_1.Input()
], Messages.prototype, "value", void 0);
__decorate([
    core_1.Input()
], Messages.prototype, "closable", void 0);
exports.Messages = Messages;
var MessagesModule = (function () {
    function MessagesModule() {
    }
    return MessagesModule;
}());
exports.MessagesModule = MessagesModule;
