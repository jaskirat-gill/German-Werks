'use client';

import { HorizontalChapter } from './horizontal-chapter';
import { Categories } from './categories';

export function CatalogueChapter() {
  return (
    <HorizontalChapter
      index="Chapter 02"
      title="The Catalogue."
      subtitle="Three volumes · 147 pieces · Certified"
    >
      {(progress) => <Categories progress={progress} />}
    </HorizontalChapter>
  );
}
