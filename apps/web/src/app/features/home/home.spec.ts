import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { describe, expect, it } from 'vitest';
import { Home } from './home';

describe('Home', () => {
  it('renders the homepage hero and identifies the illustrative stock photo', async () => {
    await TestBed.configureTestingModule({
      imports: [Home],
      providers: [provideRouter([])],
    }).compileComponents();

    const fixture = TestBed.createComponent(Home);
    fixture.detectChanges();
    const page = fixture.nativeElement as HTMLElement;

    expect(page.querySelector('h1')?.textContent).toContain('A healthier smile');
    expect(page.textContent).toContain('Illustrative stock photo');
    expect(page.textContent).toContain('Illustrative demo content only');
    expect(page.querySelectorAll('.service-card')).toHaveLength(6);
    expect(page.querySelector('#technology-title')?.textContent).toContain('Technology');
    expect(page.querySelector('.technology-section a')?.getAttribute('href')).toContain('/services');
  });
});
