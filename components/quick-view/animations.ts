import { animate, state, style, transition, trigger } from '@angular/animations';

export const animations = [
  trigger('transformPanel', [
    state('showing', style({
      opacity: 1
    })),
    transition('void => *', [
      style({
        opacity: 0
      }),
      animate('400ms ease-in')
    ]),
    transition('* => void', [
      animate('400ms ease-out', style({opacity: 0}))
    ])
  ])
];
