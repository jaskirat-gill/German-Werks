import CartModal from 'components/cart/modal';
import { GWCrest } from 'components/layout/gw-crest';
import { getMenu } from 'lib/shopify';
import type { Menu } from 'lib/shopify/types';
import Link from 'next/link';
import { Suspense } from 'react';
import MobileMenu from './navbar/mobile-menu';
import Search, { SearchSkeleton } from './navbar/search';

export async function EditorialNavbar() {
  const menu = await getMenu('next-js-frontend-header-menu');

  return (
    <nav
      className="pointer-events-none fixed inset-x-0 top-0 z-50 flex items-center justify-between px-9 py-[22px]"
      style={{ color: 'var(--color-gw-bone)', mixBlendMode: 'difference' }}
    >
      {/* Brand */}
      <Link href="/" prefetch={true} className="pointer-events-auto flex items-center gap-3" style={{ cursor: 'pointer' }}>
        <GWCrest size={38} />
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10.5px', letterSpacing: '0.22em', textTransform: 'uppercase' }}>
          German Werks <span style={{ opacity: 0.55 }}>— Manufaktur &apos;23</span>
        </div>
      </Link>

      {/* Links */}
      <div className="pointer-events-auto hidden items-center gap-8 md:flex">
        <Link
          href="/"
          className="nav-link active relative px-0 py-1 opacity-85 transition-opacity hover:opacity-100"
          style={{ fontFamily: 'var(--font-mono)', fontSize: '10.5px', letterSpacing: '0.18em', textTransform: 'uppercase' }}
        >
          Index
        </Link>
        {menu.length > 0 &&
          menu.map((item: Menu) => (
            <Link
              key={item.title}
              href={item.path}
              prefetch={true}
              className="nav-link relative px-0 py-1 opacity-85 transition-opacity hover:opacity-100"
              style={{ fontFamily: 'var(--font-mono)', fontSize: '10.5px', letterSpacing: '0.18em', textTransform: 'uppercase' }}
            >
              {item.title}
            </Link>
          ))}
        <span
          className="nav-link relative cursor-pointer px-0 py-1 opacity-85 transition-opacity hover:opacity-100"
          style={{ fontFamily: 'var(--font-mono)', fontSize: '10.5px', letterSpacing: '0.18em', textTransform: 'uppercase' }}
        >
          Journal
        </span>
        <span
          className="nav-link relative cursor-pointer px-0 py-1 opacity-85 transition-opacity hover:opacity-100"
          style={{ fontFamily: 'var(--font-mono)', fontSize: '10.5px', letterSpacing: '0.18em', textTransform: 'uppercase' }}
        >
          Contact
        </span>
      </div>

      {/* Right side */}
      <div className="pointer-events-auto flex items-center gap-4">
        <div className="hidden md:block">
          <Suspense fallback={<SearchSkeleton />}>
            <Search />
          </Suspense>
        </div>
        <div className="block md:hidden">
          <Suspense fallback={null}>
            <MobileMenu menu={menu} />
          </Suspense>
        </div>
        <CartModal />
      </div>
    </nav>
  );
}
