import CartModal from "components/cart/modal";
import LogoSquare from "components/logo-square";
import { getMenu } from "lib/shopify";
import { Menu } from "lib/shopify/types";
import Link from "next/link";
import { Suspense } from "react";
import MobileMenu from "./mobile-menu";
import Search, { SearchSkeleton } from "./search";

const { SITE_NAME } = process.env;

export async function Navbar() {
  const menu = await getMenu("next-js-frontend-header-menu");

  return (
    <nav className="fixed top-4 left-1/2 z-50 w-[calc(100%-2rem)] max-w-screen-xl -translate-x-1/2 rounded-xl border border-[#22222266] bg-[#111111cc] px-4 py-3 backdrop-blur-xl lg:px-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="block md:hidden">
            <Suspense fallback={null}>
              <MobileMenu menu={menu} />
            </Suspense>
          </div>
          <Link
            href="/"
            prefetch={true}
            className="flex items-center gap-2"
          >
            <LogoSquare />
            <span className="hidden text-sm font-bold uppercase tracking-[3px] font-heading text-gw-text lg:block">
              {SITE_NAME}
            </span>
          </Link>
        </div>

        {menu.length ? (
          <ul className="hidden gap-6 text-xs uppercase tracking-wider md:flex md:items-center">
            {menu.map((item: Menu) => (
              <li key={item.title}>
                <Link
                  href={item.path}
                  prefetch={true}
                  className="text-gw-muted transition-colors hover:text-gw-text"
                >
                  {item.title}
                </Link>
              </li>
            ))}
          </ul>
        ) : null}

        <div className="flex items-center gap-4">
          <div className="hidden md:block">
            <Suspense fallback={<SearchSkeleton />}>
              <Search />
            </Suspense>
          </div>
          <CartModal />
        </div>
      </div>
    </nav>
  );
}
