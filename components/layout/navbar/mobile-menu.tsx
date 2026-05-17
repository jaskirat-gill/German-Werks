"use client";

import { Dialog, Transition } from "@headlessui/react";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { Fragment, Suspense, useEffect, useState } from "react";

import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import { Menu } from "lib/shopify/types";
import Search, { SearchSkeleton } from "./search";

export default function MobileMenu({ menu }: { menu: Menu[] }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isOpen, setIsOpen] = useState(false);
  const openMobileMenu = () => setIsOpen(true);
  const closeMobileMenu = () => setIsOpen(false);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 768) {
        setIsOpen(false);
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [isOpen]);

  useEffect(() => {
    setIsOpen(false);
  }, [pathname, searchParams]);

  return (
    <>
      <button
        onClick={openMobileMenu}
        aria-label="Open mobile menu"
        className="flex h-10 w-10 items-center justify-center rounded-md md:hidden"
        style={{ border: '1px solid currentColor', color: 'var(--color-gw-bone)' }}
      >
        <Bars3Icon className="h-4 w-4" />
      </button>
      <Transition show={isOpen}>
        <Dialog onClose={closeMobileMenu} className="relative z-50">
          <Transition.Child
            as={Fragment}
            enter="transition-all ease-in-out duration-300"
            enterFrom="opacity-0 backdrop-blur-none"
            enterTo="opacity-100 backdrop-blur-[.5px]"
            leave="transition-all ease-in-out duration-200"
            leaveFrom="opacity-100 backdrop-blur-[.5px]"
            leaveTo="opacity-0 backdrop-blur-none"
          >
            <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
          </Transition.Child>
          <Transition.Child
            as={Fragment}
            enter="transition-all ease-in-out duration-300"
            enterFrom="translate-x-full"
            enterTo="translate-x-0"
            leave="transition-all ease-in-out duration-200"
            leaveFrom="translate-x-0"
            leaveTo="translate-x-full"
          >
            <Dialog.Panel
              className="fixed inset-0 flex h-full w-full flex-col"
              style={{
                background: 'var(--color-gw-ink)',
                color: 'var(--color-gw-bone)',
              }}
            >
              {/* Top row: close button */}
              <div className="flex items-center justify-between px-5 py-4">
                <span
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '10.5px',
                    letterSpacing: '0.22em',
                    textTransform: 'uppercase',
                    opacity: 0.55,
                  }}
                >
                  Menu
                </span>
                <button
                  onClick={closeMobileMenu}
                  aria-label="Close mobile menu"
                  className="flex h-11 w-11 items-center justify-center rounded-md"
                  style={{ border: '1px solid rgba(239, 234, 226, 0.18)' }}
                >
                  <XMarkIcon className="h-5 w-5" />
                </button>
              </div>

              {/* Search */}
              <div className="px-5 pb-6">
                <Suspense fallback={<SearchSkeleton />}>
                  <Search />
                </Suspense>
              </div>

              {/* Links */}
              <nav className="flex flex-1 flex-col gap-1 px-5">
                {[
                  { title: 'Index', path: '/' },
                  ...menu,
                  { title: 'Catalog', path: '/search' },
                ].map((item) => (
                  <Link
                    key={`${item.path}-${item.title}`}
                    href={item.path}
                    onClick={closeMobileMenu}
                    className="block py-3"
                    style={{
                      fontFamily: 'var(--font-serif)',
                      fontStyle: 'italic',
                      fontWeight: 400,
                      fontSize: 'clamp(34px, 9vw, 52px)',
                      lineHeight: 1.05,
                      letterSpacing: '-0.02em',
                      borderBottom: '1px solid rgba(239, 234, 226, 0.08)',
                    }}
                  >
                    {item.title}
                  </Link>
                ))}
              </nav>

              {/* Bottom rail: location */}
              <div
                className="flex items-center justify-between px-5 py-6"
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '10.5px',
                  letterSpacing: '0.16em',
                  textTransform: 'uppercase',
                  opacity: 0.55,
                }}
              >
                <span>Vancouver · BC</span>
                <span>49.18°N · 122.92°W</span>
              </div>
            </Dialog.Panel>
          </Transition.Child>
        </Dialog>
      </Transition>
    </>
  );
}
