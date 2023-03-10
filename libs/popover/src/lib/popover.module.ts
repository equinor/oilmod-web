import { NgModule } from '@angular/core';
import { PopoverDirective } from './popover.directive';
import { PopoverComponent } from './popover.component';
import { PopoverTitleComponent } from './popover-title.component';
import { PopoverFooterComponent } from './popover-footer.component';

@NgModule({
  imports: [ PopoverDirective, PopoverComponent, PopoverTitleComponent, PopoverFooterComponent ],
  exports: [ PopoverDirective, PopoverComponent, PopoverTitleComponent, PopoverFooterComponent ]
})
export class PopoverModule {
}
