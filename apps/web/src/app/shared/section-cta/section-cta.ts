import { Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-section-cta',
  imports: [RouterLink],
  template: '<section class="section-cta"><div><p>{{ eyebrow() }}</p><h2>{{ title() }}</h2></div><a class="button button-primary" [routerLink]="target()">{{ action() }} <span aria-hidden="true">↗</span></a></section>',
  styleUrl: './section-cta.scss',
})
export class SectionCta {
  readonly eyebrow = input('A demo clinic concept');
  readonly title = input('Your next step starts with a conversation.');
  readonly action = input('Explore the demo booking');
  readonly target = input('/book');
}
