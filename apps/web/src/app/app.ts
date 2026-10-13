import { HttpClient } from '@angular/common/http';
import { Component, OnInit, inject, signal } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import type { HealthResponse } from '@dentora/contracts';
import { SiteHeader } from './shared/site-header/site-header';

@Component({
  selector: 'app-root',
  imports: [RouterLink, RouterOutlet, SiteHeader],
  styleUrl: './app.scss',
  templateUrl: './app.html',
})
export class App implements OnInit {
  private readonly http = inject(HttpClient);
  protected readonly health = signal<'loading' | 'ok' | 'unavailable'>('loading');

  ngOnInit(): void {
    this.http.get<HealthResponse>('/api/health').subscribe({
      next: (response) => this.health.set(response.status === 'ok' ? 'ok' : 'unavailable'),
      error: () => this.health.set('unavailable'),
    });
  }
}
