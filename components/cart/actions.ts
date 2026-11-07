"use server";

import {
  addToCart,
  createCart,
  getCart,
  removeFromCart,
  updateCart,
} from "lib/commerce";
import { createCheckoutSession } from "lib/commerce/create-session";
import { findProvince } from "lib/commerce/provinces";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

const CART_COOKIE = "cartId";

function refreshCart() {
  revalidatePath("/", "layout");
}

export async function addItem(
  prevState: any,
  selectedVariantId: string | undefined
) {
  if (!selectedVariantId) {
    return "Error adding item to cart";
  }

  try {
    if (!(await getCart())) await createCartAndSetCookie();
    await addToCart([{ merchandiseId: selectedVariantId, quantity: 1 }]);
    refreshCart();
  } catch (e) {
    return "Error adding item to cart";
  }
}

export async function removeItem(prevState: any, merchandiseId: string) {
  try {
    const cart = await getCart();

    if (!cart) {
      return "Error fetching cart";
    }

    const lineItem = cart.lines.find(
      (line) => line.merchandise.id === merchandiseId
    );

    if (lineItem && lineItem.id) {
      await removeFromCart([lineItem.id]);
      refreshCart();
    } else {
      return "Item not found in cart";
    }
  } catch (e) {
    return "Error removing item from cart";
  }
}

export async function updateItemQuantity(
  prevState: any,
  payload: {
    merchandiseId: string;
    quantity: number;
  }
) {
  const { merchandiseId, quantity } = payload;

  try {
    const cart = await getCart();

    if (!cart) {
      return "Error fetching cart";
    }

    const lineItem = cart.lines.find(
      (line) => line.merchandise.id === merchandiseId
    );

    if (lineItem && lineItem.id) {
      if (quantity === 0) {
        await removeFromCart([lineItem.id]);
      } else {
        await updateCart([
          {
            id: lineItem.id,
            merchandiseId,
            quantity,
          },
        ]);
      }
    } else if (quantity > 0) {
      // If the item doesn't exist in the cart and quantity > 0, add it
      await addToCart([{ merchandiseId, quantity }]);
    }

    refreshCart();
  } catch (e) {
    console.error(e);
    return "Error updating item quantity";
  }
}

export async function createCartAndSetCookie() {
  const cart = await createCart();
  (await cookies()).set(CART_COOKIE, cart.id!, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
  });
}

export async function redirectToCheckout(
  prevState: string | null,
  formData: FormData
): Promise<string | null> {
  const province = findProvince(formData.get("province"));
  if (!province) return "Select the province you are shipping to.";

  const cartId = (await cookies()).get(CART_COOKIE)?.value;
  let url: string;

  try {
    if (!cartId) throw new Error("Cart is empty");
    url = await createCheckoutSession(cartId, province.code);
  } catch (e) {
    console.error("Checkout failed:", e);
    return "Checkout is unavailable right now. Please try again shortly.";
  }

  redirect(url);
}

export async function clearCartCookie() {
  (await cookies()).delete(CART_COOKIE);
  refreshCart();
}
