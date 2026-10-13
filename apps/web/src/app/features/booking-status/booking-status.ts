import { Component, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { PageIntro } from '../../shared/page-intro/page-intro';

@Component({
  selector: 'app-booking-status-page',
  imports: [PageIntro, ReactiveFormsModule, RouterLink],
  templateUrl: './booking-status.html',
  styleUrl: './booking-status.scss',
})
export class BookingStatus {
  private readonly fb = new FormBuilder();
  protected readonly searched = signal(false);
  protected readonly form = this.fb.nonNullable.group({
    reference: ['', [Validators.required, Validators.maxLength(40)]],
  });

  protected showDemo(): void {
    this.form.controls.reference.markAsTouched();
    if (this.form.valid) this.searched.set(true);
  }
}
