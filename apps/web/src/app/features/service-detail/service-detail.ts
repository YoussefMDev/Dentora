import { Component, computed, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { demoServices } from '../content/demo-content';

@Component({
  selector: 'app-service-detail-page',
  imports: [RouterLink],
  templateUrl: './service-detail.html',
  styleUrl: './service-detail.scss',
})
export class ServiceDetail {
  private readonly route = inject(ActivatedRoute);
  protected readonly service = computed(() => {
    const slug = this.route.snapshot.paramMap.get('slug');
    return demoServices.find((item) => item.slug === slug) ?? null;
  });
}
