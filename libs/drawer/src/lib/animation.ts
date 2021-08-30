import { animate, group, state, style, transition, trigger } from '@angular/animations';

export const drawerAnimations = [
  trigger('drawerAnimations', [
    state('open-left', style({ transform: 'translateX(0)', opacity: 1 })),
    state('open-right', style({ transform: 'translateX(0)', opacity: 1 })),
    state('openImmediate', style({ transform: 'translateX(0)', opacity: 1 })),
    state('closedImmediate-left', style({ transform: 'translateX(-100%)', opacity: 0 })),
    state('closedImmediate-right', style({ transform: 'translateX(100%)', opacity: 0 })),
    state('closed-left', style({ transform: 'translateX(-100%)', opacity: 0 })),
    state('closed-right', style({ transform: 'translateX(100%)', opacity: 0 })),
    transition('* => closed-left', [
      group([
        animate('400ms ease-in-out', style({ transform: 'translateX(-100%)' })),
        animate('1ms 400ms ease', style({ opacity: 0 }))
      ])
    ]),
    transition('* => closed-right', [
      group([
        animate('400ms ease-in-out', style({ transform: 'translateX(100%)' })),
        animate('1ms 400ms ease', style({ opacity: 0 }))
      ])
    ]),
    transition('* => open-left', [
      style({ transform: 'translateX(-100%)', opacity: 1 }),
      animate('400ms ease-in-out')
    ]),
    transition('* => open-right', [
      style({ transform: 'translateX(100%)', opacity: 1 }),
      animate('400ms ease-in-out')
    ]),
  ]),
  trigger('overlay', [
    transition(':enter', [
      style({ opacity: 0 }),
      animate('400ms', style({ opacity: 0.08 })),
    ]),
    transition(':leave', [
      animate('400ms', style({ opacity: 0 }))
    ])
  ])
]
