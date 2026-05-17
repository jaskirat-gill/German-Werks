'use client';

import Link from 'next/link';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { useState } from 'react';
import type { Collection } from 'lib/shopify/types';
import { sorting, defaultSort } from 'lib/constants';

export function FilterBar({
  collections,
  activeCollectionHandle,
}: {
  collections: Collection[];
  activeCollectionHandle: string | null;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [sortOpen, setSortOpen] = useState(false);

  const currentSort =
    sorting.find((s) => s.slug === searchParams.get('sort')) || defaultSort;

  const setSort = (slug: string | null) => {
    const params = new URLSearchParams(searchParams.toString());
    if (slug) params.set('sort', slug);
    else params.delete('sort');
    const qs = params.toString();
    router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
    setSortOpen(false);
  };

  const chipClass = (active: boolean) =>
    `whitespace-nowrap rounded-full border px-4 py-2 transition-colors ${
      active ? 'bg-gw-bone text-gw-ink' : 'border-gw-bone/40 text-gw-bone hover:border-gw-bone'
    }`;

  return (
    <div
      className="flex flex-col gap-4 border-y py-5 md:flex-row md:items-center md:justify-between"
      style={{ borderColor: 'rgba(239, 234, 226, 0.14)' }}
    >
      <div
        className="-mx-5 flex gap-2 overflow-x-auto px-5 sm:-mx-7 sm:px-7 lg:mx-0 lg:px-0"
        style={{
          fontFamily: 'var(--font-mono)',
          fontSize: '10.5px',
          letterSpacing: '0.16em',
          textTransform: 'uppercase',
        }}
      >
        <Link
          href="/search"
          className={chipClass(activeCollectionHandle === null)}
          style={{ borderColor: activeCollectionHandle === null ? 'transparent' : undefined }}
        >
          All
        </Link>
        {collections.map((c) => (
          <Link
            key={c.handle}
            href={c.path}
            className={chipClass(activeCollectionHandle === c.handle)}
            style={{ borderColor: activeCollectionHandle === c.handle ? 'transparent' : undefined }}
          >
            {c.title}
          </Link>
        ))}
      </div>

      <div className="relative md:ml-4">
        <button
          type="button"
          onClick={() => setSortOpen((v) => !v)}
          className="inline-flex items-center gap-2 rounded-full border px-4 py-2 transition-colors hover:border-gw-bone"
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '10.5px',
            letterSpacing: '0.16em',
            textTransform: 'uppercase',
            borderColor: 'rgba(239, 234, 226, 0.4)',
            color: 'var(--color-gw-bone)',
          }}
          aria-haspopup="listbox"
          aria-expanded={sortOpen}
        >
          Sort: {currentSort.title}
          <span aria-hidden>▾</span>
        </button>
        {sortOpen ? (
          <ul
            role="listbox"
            className="absolute right-0 top-full z-20 mt-2 min-w-[200px] rounded-md border py-1"
            style={{
              background: 'var(--color-gw-ink)',
              borderColor: 'rgba(239, 234, 226, 0.14)',
              color: 'var(--color-gw-bone)',
            }}
          >
            {sorting.map((s) => (
              <li key={s.slug ?? 'default'}>
                <button
                  type="button"
                  onClick={() => setSort(s.slug)}
                  className="block w-full px-4 py-2 text-left transition-colors hover:bg-gw-bone/10"
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '10.5px',
                    letterSpacing: '0.16em',
                    textTransform: 'uppercase',
                    opacity: s.slug === currentSort.slug ? 1 : 0.7,
                  }}
                >
                  {s.title}
                </button>
              </li>
            ))}
          </ul>
        ) : null}
      </div>
    </div>
  );
}
