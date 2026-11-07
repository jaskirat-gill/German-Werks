import type { GlobalConfig } from "payload";
import { revalidateStorefront } from "../hooks/revalidate";

const menuFields = [
  { name: "title", type: "text", required: true },
  { name: "path", type: "text", required: true },
] as const;

export const SiteSettings: GlobalConfig = {
  slug: "site-settings",
  label: "Site Settings",
  hooks: {
    afterChange: [
      ({ doc }) => {
        revalidateStorefront("site");
        return doc;
      },
    ],
  },
  fields: [
    { name: "contactEmail", type: "email", admin: { description: "Receives new-order notifications" } },
    { name: "navbarMenu", type: "array", fields: [...menuFields] },
    { name: "footerMenu", type: "array", fields: [...menuFields] },
  ],
};
