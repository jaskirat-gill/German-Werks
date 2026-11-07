import type { Cart as PayloadCart, Product as PayloadProduct } from "cms/payload-types";
import { cookies } from "next/headers";
import type { Where } from "payload";
import { toMoney } from "./money";
import { getClient } from "./payload";
import { reshapeCollection, reshapePage, reshapeProduct, reshapeProducts } from "./reshape";
import type { Cart, CartItem, Collection, Menu, Page, Product } from "./types";

const ALL_COLLECTION: Collection = {
  handle: "",
  title: "All",
  description: "All products",
  seo: { title: "All", description: "All products" },
  path: "/search",
  updatedAt: new Date(0).toISOString(),
};

function productSort(sortKey?: string, reverse?: boolean): string[] {
  const direction = reverse ? "-" : "";
  switch (sortKey) {
    case "PRICE":
      return [`${direction}minPriceCents`];
    case "CREATED_AT":
    case "CREATED":
      return [`${direction}createdAt`];
    default:
      return ["-featured", "title"];
  }
}

async function findProducts(where: Where, sortKey?: string, reverse?: boolean) {
  const payload = await getClient();
  const { docs } = await payload.find({
    collection: "products",
    where,
    sort: productSort(sortKey, reverse),
    pagination: false,
    depth: 1,
  });
  return reshapeProducts(docs);
}

export async function getProducts({
  query,
  reverse,
  sortKey,
}: {
  query?: string;
  reverse?: boolean;
  sortKey?: string;
}): Promise<Product[]> {
  const where: Where = query
    ? { or: [{ title: { like: query } }, { tags: { like: query } }] }
    : {};
  return findProducts(where, sortKey, reverse);
}

export async function getProduct(handle: string): Promise<Product | undefined> {
  const payload = await getClient();
  const { docs } = await payload.find({
    collection: "products",
    where: { handle: { equals: handle } },
    limit: 1,
    depth: 1,
  });
  return docs[0] ? reshapeProduct(docs[0], false) : undefined;
}

export async function getProductRecommendations(productId: string): Promise<Product[]> {
  const payload = await getClient();
  const current = await payload.findByID({ collection: "products", id: productId, depth: 0 }).catch(() => null);
  if (!current) return [];

  const collectionIds = (current.collections ?? []).map((c) => (typeof c === "string" ? c : c.id));
  const where: Where = { id: { not_equals: productId } };
  if (collectionIds.length) where.collections = { in: collectionIds };

  const related = (await findProducts(where)).slice(0, 4);
  if (related.length) return related;
  return (await findProducts({ id: { not_equals: productId } })).slice(0, 4);
}

export async function getCollections(): Promise<Collection[]> {
  const payload = await getClient();
  const { docs } = await payload.find({
    collection: "collections",
    sort: "title",
    pagination: false,
    depth: 0,
  });
  return [
    ALL_COLLECTION,
    ...docs.map(reshapeCollection).filter((collection) => !collection.handle.startsWith("hidden")),
  ];
}

async function findCollection(handle: string) {
  const payload = await getClient();
  const { docs } = await payload.find({
    collection: "collections",
    where: { handle: { equals: handle } },
    limit: 1,
    depth: 0,
  });
  return docs[0];
}

export async function getCollection(handle: string): Promise<Collection | undefined> {
  const doc = await findCollection(handle);
  return doc ? reshapeCollection(doc) : undefined;
}

export async function getCollectionProducts({
  collection,
  reverse,
  sortKey,
}: {
  collection: string;
  reverse?: boolean;
  sortKey?: string;
}): Promise<Product[]> {
  const doc = await findCollection(collection);
  if (!doc) return [];
  return findProducts({ collections: { equals: doc.id } }, sortKey, reverse);
}

export async function getMenu(handle: "navbar" | "footer"): Promise<Menu[]> {
  const payload = await getClient();
  const settings = await payload.findGlobal({ slug: "site-settings" });
  const items = handle === "footer" ? settings.footerMenu : settings.navbarMenu;
  return (items ?? []).map(({ title, path }) => ({ title, path }));
}

export async function getPage(handle: string): Promise<Page | undefined> {
  const payload = await getClient();
  const { docs } = await payload.find({
    collection: "pages",
    where: { handle: { equals: handle } },
    limit: 1,
  });
  return docs[0] ? reshapePage(docs[0]) : undefined;
}

export async function getPages(): Promise<Page[]> {
  const payload = await getClient();
  const { docs } = await payload.find({ collection: "pages", pagination: false });
  return docs.map(reshapePage);
}

async function readCartId() {
  return (await cookies()).get("cartId")?.value;
}

type CartLine = NonNullable<PayloadCart["lines"]>[number];

export function reshapeCart(cart: PayloadCart): Cart {
  const lines: CartItem[] = [];
  let subtotal = 0;

  for (const line of cart.lines ?? []) {
    if (typeof line.product === "string") continue;
    const product = reshapeProduct(line.product, false);
    const variant = line.product.variants?.find((v) => v.id === line.variantId);
    if (!product || !variant) continue;

    const total = variant.priceCents * line.quantity;
    subtotal += total;
    lines.push({
      id: line.id ?? undefined,
      quantity: line.quantity,
      cost: { totalAmount: toMoney(total) },
      merchandise: {
        id: variant.id!,
        title: variant.title,
        selectedOptions: (variant.selectedOptions ?? []).map(({ name, value }) => ({ name, value })),
        product: {
          id: product.id,
          handle: product.handle,
          title: product.title,
          featuredImage: product.featuredImage,
        },
      },
    });
  }

  return {
    id: cart.id,
    totalQuantity: lines.reduce((sum, line) => sum + line.quantity, 0),
    lines,
    cost: {
      subtotalAmount: toMoney(subtotal),
      totalAmount: toMoney(subtotal),
      totalTaxAmount: toMoney(0),
    },
  };
}

async function loadCart(depth: 0 | 2) {
  const cartId = await readCartId();
  if (!cartId) return undefined;
  const payload = await getClient();
  return payload.findByID({ collection: "carts", id: cartId, depth }).catch(() => undefined);
}

async function requireCart() {
  const cart = await loadCart(0);
  if (!cart) throw new Error("Cart not found");
  return cart;
}

const toRow = (line: CartLine) => ({
  id: line.id ?? undefined,
  product: typeof line.product === "string" ? line.product : line.product.id,
  variantId: line.variantId,
  quantity: line.quantity,
});

async function saveLines(cartId: string, lines: ReturnType<typeof toRow>[]): Promise<Cart> {
  const payload = await getClient();
  await payload.update({ collection: "carts", id: cartId, data: { lines }, depth: 0 });
  const saved = await payload.findByID({ collection: "carts", id: cartId, depth: 1 });
  return reshapeCart(saved);
}

async function findVariantProduct(variantId: string): Promise<PayloadProduct | undefined> {
  const payload = await getClient();
  const { docs } = await payload.find({
    collection: "products",
    where: { "variants.id": { equals: variantId } },
    limit: 1,
    depth: 0,
  });
  return docs[0];
}

export async function createCart(): Promise<Cart> {
  const payload = await getClient();
  const cart = await payload.create({ collection: "carts", data: { lines: [] }, depth: 0 });
  return reshapeCart(cart);
}

export async function addToCart(
  lines: { merchandiseId: string; quantity: number }[],
): Promise<Cart> {
  const cart = await requireCart();
  const rows = (cart.lines ?? []).map(toRow);

  for (const { merchandiseId, quantity } of lines) {
    const product = await findVariantProduct(merchandiseId);
    const variant = product?.variants?.find((v) => v.id === merchandiseId);
    if (!product || !variant) throw new Error("Variant not found");

    const existing = rows.find((row) => row.variantId === merchandiseId);
    const nextQuantity = Math.min((existing?.quantity ?? 0) + quantity, variant.stock ?? 0);
    if (nextQuantity < 1) throw new Error("Out of stock");

    if (existing) existing.quantity = nextQuantity;
    else rows.push({ id: undefined, product: product.id, variantId: merchandiseId, quantity: nextQuantity });
  }

  return saveLines(cart.id, rows);
}

export async function removeFromCart(lineIds: string[]): Promise<Cart> {
  const cart = await requireCart();
  const rows = (cart.lines ?? []).map(toRow).filter((row) => !lineIds.includes(row.id!));
  return saveLines(cart.id, rows);
}

export async function updateCart(
  lines: { id: string; merchandiseId: string; quantity: number }[],
): Promise<Cart> {
  const cart = await requireCart();
  const rows = (cart.lines ?? []).map(toRow);

  for (const { id, quantity } of lines) {
    const row = rows.find((r) => r.id === id);
    if (!row) continue;
    const product = await findVariantProduct(row.variantId);
    const variant = product?.variants?.find((v) => v.id === row.variantId);
    row.quantity = Math.min(quantity, variant?.stock ?? 0);
  }

  return saveLines(cart.id, rows.filter((row) => row.quantity > 0));
}

export async function getCart(): Promise<Cart | undefined> {
  const cart = await loadCart(2);
  return cart ? reshapeCart(cart) : undefined;
}
