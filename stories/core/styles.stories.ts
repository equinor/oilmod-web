import { Meta, Story } from '@storybook/angular/types-6-0';
import { moduleMetadata } from '@storybook/angular';
import { MatCardModule } from '@angular/material/card';

export default {
  title: 'core/Styles',
  decorators: [
    moduleMetadata({
      imports: [ MatCardModule ],
    })
  ],
  argTypes: {
    template: { control: { disable: true } }
  }
} as Meta;

export const StoCard: Story<{ withStyles: boolean }> = (args) => ( {
  props: { ...args },
  template: `<mat-card [class.sto-card]="withStyles">
<mat-card-title [class.sto-card__title]="withStyles">Card Title</mat-card-title>
<mat-card-subtitle [class.sto-card__subtitle]="withStyles">Card Subtitle</mat-card-subtitle>
<mat-card-content [class.sto-card__content]="withStyles">Card Content In Here</mat-card-content>
</mat-card>`
} );
StoCard.args = {
  withStyles: true
};

export const StoGrid: Story<{}> = (args) => ( {
  template: `
<div class="sto-grid sto-grid--2" style="margin-bottom: 8px;">
  <div class="sto-grid__column" style="border: 1px solid blue">sto-grid--2</div>
  <div class="sto-grid__column" style="border: 1px solid blue">sto-grid--2</div>
</div>
<div class="sto-grid sto-grid--3" style="margin-bottom: 8px;">
  <div class="sto-grid__column" style="border: 1px solid blue">sto-grid--3</div>
  <div class="sto-grid__column" style="border: 1px solid blue">sto-grid--3</div>
  <div class="sto-grid__column" style="border: 1px solid blue">sto-grid--3</div>
</div>
<div class="sto-grid sto-grid--4" style="margin-bottom: 8px;">
  <div class="sto-grid__column" style="border: 1px solid blue">sto-grid--4</div>
  <div class="sto-grid__column" style="border: 1px solid blue">sto-grid--4</div>
  <div class="sto-grid__column" style="border: 1px solid blue">sto-grid--4</div>
  <div class="sto-grid__column" style="border: 1px solid blue">sto-grid--4</div>
</div>
<div class="sto-grid sto-grid--6" style="margin-bottom: 8px;">
  <div class="sto-grid__column" style="border: 1px solid blue">sto-grid--6</div>
  <div class="sto-grid__column" style="border: 1px solid blue">sto-grid--6</div>
  <div class="sto-grid__column" style="border: 1px solid blue">sto-grid--6</div>
  <div class="sto-grid__column" style="border: 1px solid blue">sto-grid--6</div>
  <div class="sto-grid__column" style="border: 1px solid blue">sto-grid--6</div>
  <div class="sto-grid__column" style="border: 1px solid blue">sto-grid--6</div>
</div>
  `,
} );
