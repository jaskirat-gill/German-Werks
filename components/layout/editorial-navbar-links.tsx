'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import type { Menu } from 'lib/shopify/types';

type Item = { title: string; path: string };

export function EditorialNavbarLinks({ menu }: { menu: Menu[] }) {
  const pathname = usePathname();

  const items: Item[] = [
    { title: 'Index', path: '/' },
    ...menu,
    { title: 'Catalog', path: '/search' },
  ];

  const isActive = (path: string) => {
    if (path === '/') return pathname === '/';
    if (path === '/search') return pathname === '/search' || pathname.startsWith('/search/');
    return pathname === path;
  };

  return (
    <div className="pointer-events-auto hidden items-center gap-8 md:flex">
      {items.map((item) => (
        <Link
          key={item.path}
          href={item.path}
          prefetch
          className={`nav-link relative px-0 py-1 opacity-85 transition-opacity hover:opacity-100 ${
            isActive(item.path) ? 'active' : ''
          }`}
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '10.5px',
            letterSpacing: '0.18em',
            textTransform: 'uppercase',
          }}
        >
          {item.title}
        </Link>
      ))}
    </div>
  );
}
