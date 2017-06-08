import { Component, ElementRef, Input } from '@angular/core';
import { DomHandler } from 'ngx-stoui/vendor/primeface/components/dom/domhandler';
import { MenubarSub } from 'ngx-stoui/vendor/primeface/components/menubar/menubar';
import { MenuItem } from 'ngx-stoui/ngx-stoui';

@Component({
    selector: 'sto-navbarSub',
    templateUrl: 'sto-navbar-sub.component.html',
    providers: [DomHandler]
})
export class StoNavbarSubComponent extends MenubarSub {

    private isOpen = false;

    constructor(public domHandler: DomHandler, private eref: ElementRef) {

        super(domHandler);
    }

    listClick(event) {
        if(this.root && !this.isOpen){
            this.isOpen = true;
        }
        else{
            this.isOpen = false;
            super.listClick(event);
        }

    }

    onItemMouseEnter(event, item, menuitem: MenuItem) {
        if (this.root) {
            return;
        }

        super.onItemMouseEnter(event, item, menuitem);
    }

    onItemMouseLeave(event, link) {
        if (this.root) {
            return;
        }
        super.onItemMouseLeave(event, link);
    }

    onItemClick(event, item, menuitem: MenuItem) {
        if (this.root) {
            event.preventDefault();
            this.activeItem = item;
            let nextElement = item.children[0].nextElementSibling;
            let sublist = nextElement.children[0];
            sublist.style.zIndex = ++DomHandler.zindex;
            sublist.style.top = this.domHandler.getOuterHeight(item.children[0]) + 'px';
            sublist.style.left = '0px';

        }
        else {
            super.itemClick(event, menuitem);

        }
    }
}
