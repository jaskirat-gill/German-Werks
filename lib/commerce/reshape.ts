import { HIDDEN_PRODUCT_TAG } from "lib/constants";
import type { Collection as PayloadCollection, Media, Page as PayloadPage, Product as PayloadProduct } from "cms/payload-types";
import { defaultHTMLConverters, convertLexicalToHTML } from "@payloadcms/richtext-lexical/html";
import { convertLexicalToPlaintext } from "@payloadcms/richtext-lexical/plaintext";
import { toMoney } from "./money";
import type { Collection, Image, Page, Product } from "./types";

type LexicalData = NonNullable<PayloadPage["body"]>;

const isDoc = <T extends object>(value: unknown): value is T =>
  typeof value === "object" && value !== null;

const toHtml = (data?: LexicalData | null) =>
  data ? convertLexicalToHTML({ data, converters: defaultHTMLConverters, disableContainer: true }) : "";

const toPlain = (data?: LexicalData | null) => (data ? convertLexicalToPlaintext({ data }) : "");

export const emptyImage = (altText = ""): Image => ({ url: "", altText, width: 0, height: 0 });

export function reshapeImage(media: unknown, fallbackAlt: string): Image {
  if (!isDoc<Media>(media)) return emptyImage(fallbackAlt);
  return {
    url: media.url ?? "",
    altText: media.alt || fallbackAlt,
    width: media.width ?? 0,
    height: media.height ?? 0,
  };
}

export function reshapeProduct(doc: PayloadProduct, filterHidden = true): Product | undefined {
  const tags = doc.tags ?? [];
  if (filterHidden && tags.includes(HIDDEN_PRODUCT_TAG)) return undefined;

  const images = (doc.images ?? []).map((row) => reshapeImage(row.image, doc.title));
  const variants = (doc.variants ?? []).map((variant) => ({
    id: variant.id!,
    title: variant.title,
    availableForSale: (variant.stock ?? 0) > 0,
    selectedOptions: (variant.selectedOptions ?? []).map(({ name, value }) => ({ name, value })),
    price: toMoney(variant.priceCents),
  }));

  return {
    id: doc.id,
    handle: doc.handle ?? "",
    availableForSale: doc.availableForSale ?? false,
    title: doc.title,
    description: toPlain(doc.description),
    descriptionHtml: toHtml(doc.description),
    options: (doc.options ?? []).map((option) => ({
      id: option.id!,
      name: option.name,
      values: option.values,
    })),
    priceRange: {
      minVariantPrice: toMoney(doc.minPriceCents ?? 0),
      maxVariantPrice: toMoney(doc.maxPriceCents ?? 0),
    },
    variants,
    featuredImage: images[0] ?? emptyImage(doc.title),
    images,
    seo: { title: doc.seo?.title ?? "", description: doc.seo?.description ?? "" },
    tags,
    updatedAt: doc.updatedAt,
  };
}

export const reshapeProducts = (docs: PayloadProduct[]) =>
  docs.flatMap((doc) => reshapeProduct(doc) ?? []);

export function reshapeCollection(doc: PayloadCollection): Collection {
  return {
    handle: doc.handle ?? "",
    title: doc.title,
    description: doc.description ?? "",
    seo: { title: doc.seo?.title ?? "", description: doc.seo?.description ?? "" },
    updatedAt: doc.updatedAt,
    path: `/search/${doc.handle}`,
  };
}

export function reshapePage(doc: PayloadPage): Page {
  return {
    id: doc.id,
    title: doc.title,
    handle: doc.handle ?? "",
    body: toHtml(doc.body),
    bodySummary: toPlain(doc.body).slice(0, 160),
    seo: doc.seo ? { title: doc.seo.title ?? "", description: doc.seo.description ?? "" } : undefined,
    createdAt: doc.createdAt,
    updatedAt: doc.updatedAt,
  };
}
