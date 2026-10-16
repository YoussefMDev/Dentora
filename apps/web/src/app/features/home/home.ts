import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { demoServiceCategories, demoServices } from '../content/demo-content';

@Component({
  selector: 'app-home',
  imports: [RouterLink],
  styleUrls: ['./home.scss', './home-media.scss'],
  templateUrl: './home.html',
})
export class Home {
  protected readonly serviceCategories = demoServiceCategories;
  protected readonly services = demoServices;
}
