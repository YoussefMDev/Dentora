import { Component, computed, signal } from '@angular/core';
import { demoGallery, type DemoGalleryItem } from '../content/demo-content';
import { PageIntro } from '../../shared/page-intro/page-intro';

@Component({
  selector: 'app-gallery-page',
  imports: [PageIntro],
  templateUrl: './gallery.html',
  styleUrl: './gallery.scss',
})
export class Gallery {
  protected readonly categories = ['All', 'Studio', 'Smile details', 'Care'] as const;
  protected readonly selected = signal<(typeof this.categories)[number]>('All');
  protected readonly items = computed(() => {
    const category = this.selected();
    return category === 'All' ? demoGallery : demoGallery.filter((item) => item.category === category);
  });

  protected choose(category: (typeof this.categories)[number]): void {
    this.selected.set(category);
  }

  protected trackItem(_index: number, item: DemoGalleryItem): string {
    return item.id;
  }
}
