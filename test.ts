import { Component } from '@angular/core';

@Component({
  selector: 'sto-card',
  template: `<div class="mdc-card">
	  <section class="mdc-card__primary">
		  <h1 class="mdc-card__title mdc-card__title--large">Title goes here</h1>
		  <h2 class="mdc-card__subtitle">Subtitle here</h2>
	  </section>
	  <section class="mdc-card__supporting-text">
		  {{ content }}
	  </section>
	  <section class="mdc-card__actions">
		  <button class="mdc-button mdc-button--compact mdc-card__action">Action 1</button>
		  <button class="mdc-button mdc-button--compact mdc-card__action">Action 2</button>
	  </section>
  </div>`
})
export class StoCardComponent {
}