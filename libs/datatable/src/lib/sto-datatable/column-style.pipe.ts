import { Pipe, PipeTransform } from '@angular/core';
import { Column, ColumnDisplay } from './columns';

@Pipe({
  name: 'columnStyle'
})
export class ColumnStylePipe implements PipeTransform {

  transform(column: Column, displayMode: ColumnDisplay, width?: number | null): {[klass: string]: unknown;} {
    switch ( displayMode ) {
      case ColumnDisplay.Force:
        return {
          'width.px': width || ( column.flexBasis || 80 ),
          'maxWidth.px': width || ( column.flexBasis || 80 ),
          float: 'left'
        };
      case ColumnDisplay.Flex:
      default:
        return {
          flexGrow: ( column.flexGrow || column.flexGrow === 0 ) ? column.flexGrow : 1,
          flexShrink: ( column.flexShrink || column.flexShrink === 0 ) ? column.flexShrink : 1,
          'flexBasis.px': width || ( column.flexBasis || 80 ),
        };
    }
  }

}

/*         [style.flex-grow]="(column.flexGrow || column.flexGrow === 0) ? column.flexGrow : 1"
         [style.flex-shrink]="(column.flexShrink || column.flexShrink === 0) ? column.flexShrink : 1"
         [style.flex-basis.px]="headerWidthMap[i] || (column.flexBasis || 80)"*/
