import type { CollectionConfig } from "payload";

const denied = () => false;

export const Carts: CollectionConfig = {
  slug: "carts",
  admin: { hidden: true },
  access: { create: denied, read: denied, update: denied, delete: denied },
  fields: [
    {
      name: "lines",
      type: "array",
      fields: [
        { name: "product", type: "relationship", relationTo: "products", required: true },
        { name: "variantId", type: "text", required: true },
        { name: "quantity", type: "number", required: true, min: 1 },
      ],
    },
  ],
};
