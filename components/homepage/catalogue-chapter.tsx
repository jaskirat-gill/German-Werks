'use client';

import { HorizontalChapter } from './horizontal-chapter';
import { Categories } from './categories';
import { ChapterIntroMobile } from './chapter-intro-mobile';
import { CategoriesMobile } from './categories-mobile';

export function CatalogueChapter() {
  return (
    <>
      {/* Desktop ≥ md: horizontal cinematic chapter */}
      <div className="hidden md:block">
        <HorizontalChapter
          index="Chapter 02"
          title="The Catalogue."
          subtitle="Three volumes · 147 pieces · Certified"
        >
          {(progress) => <Categories progress={progress} />}
        </HorizontalChapter>
      </div>

      {/* Mobile < md: stacked vertical chapter */}
      <div className="md:hidden">
        <ChapterIntroMobile
          index="Chapter 02"
          title="The Catalogue."
          subtitle="Three volumes · 147 pieces · Certified"
        />
        <CategoriesMobile />
      </div>
    </>
  );
}
