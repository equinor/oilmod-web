import { Breadcrumb } from './lib/sto-breadcrumbs/breadcrumb';

export const breadCrumbs: Breadcrumb[] = [
  {
    label: 'One',
    command: () => {
      console.log('Wat?');
    },
  },
  {
    label: 'Two',
    command: () => {
      console.log('Two');
    },
    segment: '2',
  },
];
