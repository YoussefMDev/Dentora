import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { demoServices } from '../content/demo-content';
import { PageIntro } from '../../shared/page-intro/page-intro';
import { SectionCta } from '../../shared/section-cta/section-cta';

@Component({
  selector: 'app-services-page',
  imports: [PageIntro, SectionCta, RouterLink],
  templateUrl: './services.html',
  styleUrl: './services.scss',
})
export class Services {
  protected readonly services = demoServices;
}
