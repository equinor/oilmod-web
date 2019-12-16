import { ChangeDetectionStrategy, Component, HostBinding, Input, ViewEncapsulation } from '@angular/core';
import { animate, state, style, transition, trigger } from '@angular/animations';

export type PaneType = 'left' | 'right';

@Component({
  selector: 'sto-slide-panel',
  styleUrls: ['./navigation-part.component.scss'],
  templateUrl: './navigation-part.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  animations: [
    trigger('slide', [
      state('left', style({transform: 'translateX(0)'})),
      state('right', style({transform: 'translateX(-50%)'})),
      transition('left <=> right', animate('300ms ease'))
    ])
  ]
})
export class NavigationPartComponent {
  @Input() activePane: PaneType;
  @HostBinding('class.sto-slide-panel')
  baseClass = true;
}
