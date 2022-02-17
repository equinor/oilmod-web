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
    const grow = group.props.length;
    return `${grow} 1 ${basis}px`;
  }

}
