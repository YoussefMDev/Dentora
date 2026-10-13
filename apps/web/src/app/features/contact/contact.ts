import { Component, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { PageIntro } from '../../shared/page-intro/page-intro';

@Component({
  selector: 'app-contact-page',
  imports: [PageIntro, ReactiveFormsModule],
  templateUrl: './contact.html',
  styleUrl: './contact.scss',
})
export class Contact {
  private readonly fb = new FormBuilder();
  protected readonly submitted = signal(false);
  protected readonly form = this.fb.nonNullable.group({
    name: ['', [Validators.required, Validators.maxLength(100)]],
    email: ['', [Validators.required, Validators.email, Validators.maxLength(254)]],
    message: ['', [Validators.required, Validators.maxLength(1000)]],
  });

  protected submitDemo(): void {
    this.form.markAllAsTouched();
    if (this.form.valid) this.submitted.set(true);
  }
}
