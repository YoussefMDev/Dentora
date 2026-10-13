import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', loadComponent: () => import('./features/home/home').then((module) => module.Home), title: 'Dentora — Modern Dental Care' },
  { path: 'about', loadComponent: () => import('./features/about/about').then((module) => module.About), title: 'About — Dentora' },
  { path: 'services', loadComponent: () => import('./features/services/services').then((module) => module.Services), title: 'Services — Dentora' },
  { path: 'services/:slug', loadComponent: () => import('./features/service-detail/service-detail').then((module) => module.ServiceDetail), title: 'Service details — Dentora' },
  { path: 'gallery', loadComponent: () => import('./features/gallery/gallery').then((module) => module.Gallery), title: 'Gallery — Dentora' },
  { path: 'book', loadComponent: () => import('./features/booking/booking').then((module) => module.Booking), title: 'Book a visit — Dentora' },
  { path: 'booking-status', loadComponent: () => import('./features/booking-status/booking-status').then((module) => module.BookingStatus), title: 'Booking status — Dentora' },
  { path: 'contact', loadComponent: () => import('./features/contact/contact').then((module) => module.Contact), title: 'Contact — Dentora' },
  { path: '**', redirectTo: '' },
];
