import {NgModule,Component,ElementRef,Input,Output,SimpleChange,EventEmitter} from '@angular/core';
import {CommonModule} from '@angular/common';

export class Paginator {

    @Input() pageLinkSize: number = 5;

    @Output() onPageChange: EventEmitter<any> = new EventEmitter();

    @Input() style: any;

    @Input() styleClass: string;
    
    @Input() rowsPerPageOptions: number[];

    public pageLinks: number[];

    public _totalRecords: number = 0;
    
    public _first: number = 0;
    
    public _rows: number = 0;
    
    @Input() get totalRecords(): number {
        return this._totalRecords;
    }

    set totalRecords(val:number) {
        this._totalRecords = val;
        this.updatePageLinks();
    }
    
    @Input() get first(): number {
        return this._first;
    }

    set first(val:number) {
        this._first = val;
        this.updatePageLinks();
    }
    
    @Input() get rows(): number {
        return this._rows;
    }

    set rows(val:number) {
        this._rows = val;
        this.updatePageLinks();
    }

    isFirstPage() {
        return this.getPage() === 0;
    }

    isLastPage() {
        return this.getPage() === this.getPageCount() - 1;
    }

    getPageCount() {
        return Math.ceil(this.totalRecords/this.rows)||1;
    }

    calculatePageLinkBoundaries() {
        let numberOfPages = this.getPageCount(),
        visiblePages = Math.min(this.pageLinkSize, numberOfPages);

        //calculate range, keep current in middle if necessary
        let start = Math.max(0, Math.ceil(this.getPage() - ((visiblePages) / 2))),
        end = Math.min(numberOfPages - 1, start + visiblePages - 1);

        //check when approaching to last page
        var delta = this.pageLinkSize - (end - start + 1);
        start = Math.max(0, start - delta);

        return [start, end];
    }

    updatePageLinks() {
        this.pageLinks = [];
        let boundaries = this.calculatePageLinkBoundaries(),
        start = boundaries[0],
        end = boundaries[1];

        for(let i = start; i <= end; i++) {
            this.pageLinks.push(i + 1);
        }
    }

    changePage(p :number, event) {
        var pc = this.getPageCount();

        if(p >= 0 && p < pc) {
            this.first = this.rows * p;
            var state = {
                page: p,
                first: this.first,
                rows: this.rows,
                pageCount: pc
            };
            this.updatePageLinks();

            this.onPageChange.emit(state);
        }
        
        if(event) {
            event.preventDefault();
        }
    }
    
    getPage(): number {
        return Math.floor(this.first / this.rows);
    }

    changePageToFirst(event) {
        this.changePage(0, event);
    }

    changePageToPrev(event) {
        this.changePage(this.getPage() - 1, event);
    }

    changePageToNext(event) {
        this.changePage(this.getPage()  + 1, event);
    }

    changePageToLast(event) {
        this.changePage(this.getPageCount() - 1, event);
    }
    
    onRppChange(event) {
        this.rows = this.rowsPerPageOptions[event.target.selectedIndex];
        this.changePageToFirst(event);
    }
}

export class PaginatorModule { }
