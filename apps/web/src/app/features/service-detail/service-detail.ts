import { Component, computed, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { demoServices } from '../content/demo-content';

@Component({
  selector: 'app-service-detail-page',
  imports: [RouterLink],
  templateUrl: './service-detail.html',
  styleUrl: './service-detail.scss',
})
export class ServiceDetail {
  private readonly route = inject(ActivatedRoute);
  private readonly routeParams = toSignal(this.route.paramMap, { initialValue: this.route.snapshot.paramMap });
  protected readonly service = computed(() => {
    const slug = this.routeParams().get('slug');
    return demoServices.find((item) => item.slug === slug) ?? null;
  });
}
