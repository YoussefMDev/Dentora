import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { PageIntro } from '../../shared/page-intro/page-intro';
import { SectionCta } from '../../shared/section-cta/section-cta';

@Component({
  selector: 'app-about-page',
  imports: [PageIntro, SectionCta, RouterLink],
  templateUrl: './about.html',
  styleUrl: './about.scss',
})
export class About {}
