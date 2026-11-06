import type { CollectionConfig } from "payload";
import { revalidateStorefront } from "../hooks/revalidate";
import { slugify } from "../slugify";

export const Pages: CollectionConfig = {
  slug: "pages",
  admin: { useAsTitle: "title" },
  access: { read: () => true },
  hooks: {
    beforeValidate: [
      ({ data }) => {
        if (data && !data.handle && data.title) data.handle = slugify(data.title);
        return data;
      },
    ],
    afterChange: [
      ({ doc }) => {
        revalidateStorefront("pages");
        return doc;
      },
    ],
    afterDelete: [
      ({ doc }) => {
        revalidateStorefront("pages");
        return doc;
      },
    ],
  },
  fields: [
    { name: "title", type: "text", required: true },
    { name: "handle", type: "text", unique: true, index: true },
    { name: "body", type: "richText" },
    {
      name: "seo",
      type: "group",
      fields: [
        { name: "title", type: "text" },
        { name: "description", type: "textarea" },
      ],
    },
  ],
};
