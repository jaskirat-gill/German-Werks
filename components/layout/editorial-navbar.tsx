import CartModal from 'components/cart/modal';
import { GWCrest } from 'components/layout/gw-crest';
import { getMenu } from 'lib/shopify';
import Link from 'next/link';
import { Suspense } from 'react';
import { EditorialNavbarLinks } from './editorial-navbar-links';
import MobileMenu from './navbar/mobile-menu';
import Search, { SearchSkeleton } from './navbar/search';

export async function EditorialNavbar() {
  const menu = await getMenu('next-js-frontend-header-menu');

  return (
    <nav
      className="pointer-events-none fixed inset-x-0 top-0 z-50 flex items-center justify-between px-5 py-4 sm:px-7 sm:py-[18px] lg:px-9 lg:py-[22px]"
      style={{ color: 'var(--color-gw-bone)', mixBlendMode: 'difference' }}
    >
      {/* Brand */}
      <Link href="/" prefetch={true} className="pointer-events-auto flex items-center gap-3" style={{ cursor: 'pointer' }}>
        <GWCrest size={38} />
        <div className="hidden sm:block" style={{ fontFamily: 'var(--font-mono)', fontSize: '10.5px', letterSpacing: '0.22em', textTransform: 'uppercase' }}>
          German Werks <span style={{ opacity: 0.55 }}>— Manufaktur &apos;23</span>
        </div>
      </Link>

      {/* Links */}
      <EditorialNavbarLinks menu={menu} />

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
