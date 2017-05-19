import { StoDatatableComponent } from '../sto-datatable.component';
import { Component, forwardRef, Inject, Input } from '@angular/core';
import { Column } from '../../../vendor/primeface/components/common/shared';

@Component({
	selector: '[stoColumnHeaders]',
	templateUrl: 'sto-datatable-header.component.html'
})
export class StoColumnHeadersComponent {
	constructor(@Inject(forwardRef(() => StoDatatableComponent)) public dt: StoDatatableComponent) {
	}

	@Input('stoColumnHeaders') columns: Column[];
}