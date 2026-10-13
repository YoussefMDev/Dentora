import { Component, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { demoServices } from '../content/demo-content';

@Component({
  selector: 'app-booking-page',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './booking.html',
  styleUrl: './booking.scss',
})
export class Booking {
  private readonly fb = new FormBuilder();
  protected readonly services = demoServices;
  protected readonly step = signal(0);
  protected readonly confirmed = signal(false);
  protected readonly form = this.fb.nonNullable.group({
    service: ['', Validators.required],
    date: ['', Validators.required],
    time: ['', Validators.required],
    name: ['', [Validators.required, Validators.maxLength(100)]],
    email: ['', [Validators.required, Validators.email, Validators.maxLength(254)]],
    notes: ['', Validators.maxLength(500)],
  });
  protected readonly steps = ['Service', 'Date & time', 'Your details', 'Review'];
  protected readonly times = ['09:00', '10:30', '13:00', '14:30'];

  protected next(): void {
    const fieldsByStep: ReadonlyArray<ReadonlyArray<keyof typeof this.form.controls>> = [
      ['service'],
      ['date', 'time'],
      ['name', 'email', 'notes'],
    ];
    const fields = fieldsByStep[this.step()];
    if (fields) {
      fields.forEach((field) => this.form.controls[field].markAsTouched());
      const invalid = fields.some((field) => this.form.controls[field].invalid);
      if (invalid) return;
    }
    this.step.update((value) => Math.min(value + 1, 3));
  }

  protected back(): void {
    this.step.update((value) => Math.max(value - 1, 0));
  }

  protected completeDemo(): void {
    if (this.form.valid) this.confirmed.set(true);
  }

  protected selectedService(): string {
    return this.services.find((service) => service.slug === this.form.controls.service.value)?.title ?? '';
  }
}
