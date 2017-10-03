import {Component, NgModule, VERSION } from '@angular/core';
import {BrowserModule} from '@angular/platform-browser'

function convertTsickleDecoratorIntoMetadata(decoratorInvocations: any[]): any[] {
  if (!decoratorInvocations) {
    return [];
  }
  return decoratorInvocations.map(decoratorInvocation => {
    const decoratorType = decoratorInvocation.type;
    const annotationCls = decoratorType.annotationCls;
    const annotationArgs = decoratorInvocation.args ? decoratorInvocation.args : [];
    return new annotationCls(...annotationArgs);
  });
}

declare let Reflect: any;

function isPresent(obj: any): boolean {
  return obj !== undefined && obj !== null;
}

export function CustomComponent(annotation: any) {
  return function (target: Function) {
    const parentTarget = Object.getPrototypeOf(target.prototype).constructor;

    let parentAnnotations = Reflect.getMetadata('annotations', parentTarget); //Reflect.getMetadata('annotations',
    // parentTarget);

    if (!parentAnnotations) {
      parentAnnotations = convertTsickleDecoratorIntoMetadata(parentTarget.decorators);
    }

    const parentAnnotation = parentAnnotations[0];
    Object.keys(parentAnnotation).forEach(key => {
      if (isPresent(parentAnnotation[key])) {
        // verify is annotation typeof function
        if (typeof annotation[key] === 'function'){
          annotation[key] = annotation[key].call(this, parentAnnotation[key]);
        }else if (
          // force override in annotation base
          !isPresent(annotation[key])
        ){
          annotation[key] = parentAnnotation[key];
        }
      }
    });

    const metadata = new Component(annotation);

    Reflect.defineMetadata('annotations', [ metadata ], target);
  };
}