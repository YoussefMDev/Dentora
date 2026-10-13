import { Component, input } from '@angular/core';

@Component({
  selector: 'app-page-intro',
  template: '<section class="page-intro"><p class="eyebrow">{{ eyebrow() }}</p><h1>{{ title() }}</h1><p class="lead">{{ description() }}</p></section>',
  styleUrl: './page-intro.scss',
})
export class PageIntro {
  readonly eyebrow = input.required<string>();
  readonly title = input.required<string>();
  readonly description = input.required<string>();
}
