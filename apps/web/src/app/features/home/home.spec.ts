import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { describe, expect, it } from 'vitest';
import { Home } from './home';

describe('Home', () => {
  it('renders the homepage hero and clearly labels the temporary visual', async () => {
    await TestBed.configureTestingModule({
      imports: [Home],
      providers: [provideRouter([])],
    }).compileComponents();

    const fixture = TestBed.createComponent(Home);
    fixture.detectChanges();
    const page = fixture.nativeElement as HTMLElement;

    expect(page.querySelector('h1')?.textContent).toContain('A healthier smile');
    expect(page.textContent).toContain('Temporary visual placeholder');
    expect(page.textContent).toContain('Demo service descriptions');
  });
});
