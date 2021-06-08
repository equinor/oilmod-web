import { Breadcrumb } from './lib/sto-breadcrumbs/breadcrumb';

export const breadCrumbs: Breadcrumb[] = [
  {
    label: 'One',
    command: () => {
      console.log('Wat?');
    },
    segment: '1',
  }, {
    label: 'Two',
    command: () => {
    },
    segment: '2',
  },
];
