"use client";

import clsx from "clsx";
import { addItem } from "components/cart/actions";
import { Product, ProductVariant } from "lib/shopify/types";
import { useSearchParams } from "next/navigation";
import { useActionState } from "react";
import { useCart } from "./cart-context";

function SubmitButton({
  availableForSale,
  selectedVariantId,
}: {
  availableForSale: boolean;
  selectedVariantId: string | undefined;
}) {
  const base =
    'group relative flex w-full items-center justify-between rounded-md px-5 py-4 transition-all';
  const enabled =
    'bg-gw-bone text-gw-ink hover:bg-gw-accent hover:text-gw-bone';
  const disabled = 'bg-gw-bone/20 text-gw-bone/40 cursor-not-allowed';

  if (!availableForSale) {
    return (
      <button
        disabled
        className={clsx(base, disabled)}
        style={{
          fontFamily: 'var(--font-mono)',
          fontSize: '11.5px',
          letterSpacing: '0.18em',
          textTransform: 'uppercase',
        }}
      >
        Out of stock
      </button>
    );
  }

  if (!selectedVariantId) {
    return (
      <button
        aria-label="Please select an option"
        disabled
        className={clsx(base, disabled)}
        style={{
          fontFamily: 'var(--font-mono)',
          fontSize: '11.5px',
          letterSpacing: '0.18em',
          textTransform: 'uppercase',
        }}
      >
        Select an option
      </button>
    );
  }

  return (
    <button
      aria-label="Add to cart"
      className={clsx(base, enabled)}
      style={{
        fontFamily: 'var(--font-mono)',
        fontSize: '11.5px',
        letterSpacing: '0.18em',
        textTransform: 'uppercase',
      }}
    >
      <span>Add to cart</span>
      <span aria-hidden className="transition-transform group-hover:translate-x-1">→</span>
    </button>
  );
}

export function AddToCart({ product }: { product: Product }) {
  const { variants, availableForSale } = product;
  const { addCartItem } = useCart();
  const searchParams = useSearchParams();
  const [message, formAction] = useActionState(addItem, null);

  const variant = variants.find((variant: ProductVariant) =>
    variant.selectedOptions.every(
      (option) => option.value === searchParams.get(option.name.toLowerCase()),
    ),
  );
  const defaultVariantId = variants.length === 1 ? variants[0]?.id : undefined;
  const selectedVariantId = variant?.id || defaultVariantId;
  const addItemAction = formAction.bind(null, selectedVariantId);
  const finalVariant = variants.find(
    (variant) => variant.id === selectedVariantId,
  )!;

  return (
    <form
      action={async () => {
        addCartItem(finalVariant, product);
        addItemAction();
      }}
    >
      <SubmitButton
        availableForSale={availableForSale}
        selectedVariantId={selectedVariantId}
      />
      <p aria-live="polite" className="sr-only" role="status">
        {message}
      </p>
    </form>
  );
}
