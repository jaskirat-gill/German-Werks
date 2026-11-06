import type { CollectionBeforeValidateHook, CollectionConfig } from "payload";
import { revalidateStorefront } from "../hooks/revalidate";
import { slugify } from "../slugify";

type VariantRow = { priceCents?: number | null; stock?: number | null };

const deriveFields: CollectionBeforeValidateHook = ({ data }) => {
  if (!data) return data;
  if (!data.handle && data.title) data.handle = slugify(data.title);
  const variants: VariantRow[] = data.variants ?? [];
  const prices = variants.map((v) => v.priceCents ?? 0);
  data.minPriceCents = prices.length ? Math.min(...prices) : 0;
  data.maxPriceCents = prices.length ? Math.max(...prices) : 0;
  data.availableForSale = variants.some((v) => (v.stock ?? 0) > 0);
  return data;
};

export const Products: CollectionConfig = {
  slug: "products",
  admin: {
    useAsTitle: "title",
    defaultColumns: ["title", "handle", "availableForSale", "featured"],
  },
  access: { read: () => true },
  hooks: {
    beforeValidate: [deriveFields],
    afterChange: [
      ({ doc }) => {
        revalidateStorefront("products");
        return doc;
      },
    ],
    afterDelete: [
      ({ doc }) => {
        revalidateStorefront("products");
        return doc;
      },
    ],
  },
  fields: [
    { name: "title", type: "text", required: true },
    { name: "handle", type: "text", unique: true, index: true, admin: { description: "URL slug; generated from the title when empty" } },
    { name: "description", type: "richText" },
    {
      name: "images",
      type: "array",
      fields: [{ name: "image", type: "upload", relationTo: "media", required: true }],
    },
    { name: "tags", type: "text", hasMany: true },
    { name: "featured", type: "checkbox", defaultValue: false },
    { name: "collections", type: "relationship", relationTo: "collections", hasMany: true },
    {
      name: "seo",
      type: "group",
      fields: [
        { name: "title", type: "text" },
        { name: "description", type: "textarea" },
      ],
    },
    {
      name: "options",
      type: "array",
      fields: [
        { name: "name", type: "text", required: true },
        { name: "values", type: "text", hasMany: true, required: true },
      ],
    },
    {
      name: "variants",
      type: "array",
      minRows: 1,
      fields: [
        { name: "title", type: "text", required: true },
        {
          name: "selectedOptions",
          type: "array",
          fields: [
            { name: "name", type: "text", required: true },
            { name: "value", type: "text", required: true },
          ],
        },
        { name: "priceCents", type: "number", required: true, min: 0 },
        { name: "compareAtPriceCents", type: "number", min: 0 },
        { name: "sku", type: "text" },
        { name: "stock", type: "number", required: true, defaultValue: 0, min: 0 },
      ],
    },
    { name: "availableForSale", type: "checkbox", admin: { position: "sidebar", readOnly: true } },
    { name: "minPriceCents", type: "number", index: true, admin: { position: "sidebar", readOnly: true } },
    { name: "maxPriceCents", type: "number", admin: { position: "sidebar", readOnly: true } },
  ],
};
