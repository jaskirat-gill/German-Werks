import type { CollectionConfig } from "payload";
import { revalidateStorefront } from "../hooks/revalidate";
import { slugify } from "../slugify";

export const Collections: CollectionConfig = {
  slug: "collections",
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
        revalidateStorefront("collections");
        return doc;
      },
    ],
    afterDelete: [
      ({ doc }) => {
        revalidateStorefront("collections");
        return doc;
      },
    ],
  },
  fields: [
    { name: "title", type: "text", required: true },
    { name: "handle", type: "text", unique: true, index: true },
    { name: "description", type: "textarea" },
    { name: "image", type: "upload", relationTo: "media" },
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
