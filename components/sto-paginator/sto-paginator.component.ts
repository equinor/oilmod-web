import { Component, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { Paginator } from '../../vendor/primeface/components/paginator/paginator';
@Component({
  selector: 'sto-paginator',
  templateUrl: './sto-paginator.component.html',
  styleUrls: ['./sto-paginator.component.scss']
})
export class StoPaginator extends Paginator {}


@NgModule({
  imports: [CommonModule],
  exports: [StoPaginator],
  declarations: [StoPaginator]
})
export class StoPaginatorModule {}