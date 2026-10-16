import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { demoServiceCategories, demoServices } from '../content/demo-content';

@Component({
  selector: 'app-services-page',
  imports: [RouterLink],
  templateUrl: './services.html',
  styleUrls: ['./services.scss', './services-content.scss'],
})
export class Services {
  protected readonly services = demoServices;
  protected readonly categories = demoServiceCategories.map((category) => ({
    ...category,
    services: demoServices.filter((service) => service.categoryId === category.id),
  }));
}
