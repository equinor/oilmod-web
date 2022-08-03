import { Pipe, PipeTransform } from '@angular/core';
import { Column, Group } from './columns';

@Pipe({
  name: 'getGroupFlex'
})
export class GetGroupFlexPipe implements PipeTransform {

  transform(group: Group, columns: Array<Column>): string {
    const basis = group.props
      .map(g => columns.find(c => c.prop === g))
      .map(c => c?.flexBasis || 80)
      .reduce((a, b) => a + b, 0);
    const fixedWidth = columns.some(c => c.flexShrink === 0 && c.flexGrow === 0);
    const grow = group.props.length;
    return fixedWidth ? `0 0 ${basis}px` : `${grow} 1 ${basis}px`;
  }

}
