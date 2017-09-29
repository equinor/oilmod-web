"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
function convertTsickleDecoratorIntoMetadata(decoratorInvocations) {
    if (!decoratorInvocations) {
        return [];
    }
    return decoratorInvocations.map(function (decoratorInvocation) {
        var decoratorType = decoratorInvocation.type;
        var annotationCls = decoratorType.annotationCls;
        var annotationArgs = decoratorInvocation.args ? decoratorInvocation.args : [];
        return new (annotationCls.bind.apply(annotationCls, [void 0].concat(annotationArgs)))();
    });
}
function isPresent(obj) {
    return obj !== undefined && obj !== null;
}
function CustomComponent(annotation) {
    return function (target) {
        var _this = this;
        var parentTarget = Object.getPrototypeOf(target.prototype).constructor;
        var parentAnnotations = Reflect.getMetadata('annotations', parentTarget); //Reflect.getMetadata('annotations',
        // parentTarget);
        if (!parentAnnotations) {
            parentAnnotations = convertTsickleDecoratorIntoMetadata(parentTarget.decorators);
        }
        var parentAnnotation = parentAnnotations[0];
        Object.keys(parentAnnotation).forEach(function (key) {
            if (isPresent(parentAnnotation[key])) {
                // verify is annotation typeof function
                if (typeof annotation[key] === 'function') {
                    annotation[key] = annotation[key].call(_this, parentAnnotation[key]);
                }
                else if (
                // force override in annotation base
                !isPresent(annotation[key])) {
                    annotation[key] = parentAnnotation[key];
                }
            }
        });
        var metadata = new core_1.Component(annotation);
        Reflect.defineMetadata('annotations', [metadata], target);
    };
}
exports.CustomComponent = CustomComponent;
