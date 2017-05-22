import { Component, Input } from '@angular/core';
import { TabViewNav } from '../../../vendor/primeface/components/tabview/tabview';
@Component({
	selector: '[sto-tabview-nav]',
	host:{
		'[class.ui-tabview-nav]': 'true',
		'[class.ui-helper-reset]': 'true',
		'[class.ui-helper-clearfix]': 'true',
		'[class.ui-widget-header]': 'true',
		'[class.ui-corner-all]': 'true'
	},
	templateUrl: 'sto-tabview-nav.component.html',
})
export class StoTabViewNav extends TabViewNav {


}