import type { GlobalConfig } from "payload";

export const ShippingSettings: GlobalConfig = {
  slug: "shipping-settings",
  label: "Shipping Settings",
  fields: [
    {
      name: "options",
      type: "array",
      fields: [
        { name: "label", type: "text", required: true },
        { name: "amountCents", type: "number", required: true, min: 0 },
      ],
    },
  ],
};
