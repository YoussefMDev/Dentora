import { HttpClient } from '@angular/common/http';
import { Component, OnInit, inject, signal } from '@angular/core';
import type { HealthResponse } from '@dentora/contracts';

@Component({
  selector: 'app-root',
  styleUrl: './app.scss',
  templateUrl: './app.html',
})
export class App implements OnInit {
  private readonly http = inject(HttpClient);
  protected readonly health = signal('Loading…');

  ngOnInit(): void {
    this.http.get<HealthResponse>('/api/health').subscribe({
      next: (response) => this.health.set(response.status),
      error: () => this.health.set('unavailable'),
    });
  }
}
