import type { CollectionConfig } from "payload";
import { sendOrderShippedEmail } from "../../lib/commerce/order-emails";
import { formatCents } from "../formatMoney";

const authenticated = ({ req }: { req: { user?: unknown } }) => Boolean(req.user);
const denied = () => false;

export const Orders: CollectionConfig = {
  slug: "orders",
  admin: {
    useAsTitle: "email",
    defaultColumns: ["createdAt", "name", "email", "total", "status", "taxMismatch"],
  },
  hooks: {
    beforeChange: [
      ({ data, originalDoc, operation }) => {
        if (operation === "update" && data.status === "shipped" && originalDoc?.status !== "shipped") {
          data.shippedAt = new Date().toISOString();
        }
        return data;
      },
    ],
    afterChange: [
      async ({ doc, previousDoc, operation, req }) => {
        if (operation === "update" && doc.status === "shipped" && previousDoc?.status !== "shipped") {
          try {
            await sendOrderShippedEmail(req.payload, doc);
          } catch (error) {
            req.payload.logger.error({ err: error, msg: "Shipped email failed" });
          }
        }
        return doc;
      },
    ],
  },
  access: { create: denied, read: authenticated, update: authenticated, delete: authenticated },
  fields: [
    { name: "stripeSessionId", type: "text", required: true, unique: true, index: true, admin: { readOnly: true } },
    { name: "stripePaymentIntentId", type: "text", admin: { readOnly: true } },
    { name: "taxProvince", type: "text", admin: { readOnly: true, description: "Province the customer picked; its tax rate was charged" } },
    {
      name: "taxMismatch",
      type: "checkbox",
      defaultValue: false,
      admin: { readOnly: true, description: "Shipped to a different province than the one taxed. Check the tax charged." },
    },
    { name: "email", type: "email", required: true, admin: { readOnly: true } },
    { name: "name", type: "text", admin: { readOnly: true } },
    {
      name: "shippingAddress",
      type: "group",
      admin: { readOnly: true },
      fields: [
        { name: "line1", type: "text" },
        { name: "line2", type: "text" },
        { name: "city", type: "text" },
        { name: "province", type: "text" },
        { name: "postalCode", type: "text" },
        { name: "country", type: "text" },
      ],
    },
    {
      name: "lines",
      type: "array",
      admin: { readOnly: true },
      fields: [
        { name: "productTitle", type: "text", required: true },
        { name: "variantTitle", type: "text" },
        { name: "sku", type: "text" },
        { name: "quantity", type: "number", required: true },
        { name: "unitPriceCents", type: "number", required: true },
      ],
    },
    { name: "subtotalCents", type: "number", required: true, admin: { readOnly: true } },
    { name: "shippingCents", type: "number", required: true, admin: { readOnly: true } },
    { name: "taxCents", type: "number", required: true, admin: { readOnly: true } },
    { name: "totalCents", type: "number", required: true, admin: { readOnly: true } },
    { name: "currency", type: "text", defaultValue: "cad", admin: { readOnly: true } },
    {
      name: "total",
      type: "text",
      virtual: true,
      admin: { readOnly: true, position: "sidebar" },
      hooks: {
        afterRead: [({ siblingData }) => formatCents(siblingData.totalCents ?? 0, (siblingData.currency ?? "cad").toUpperCase())],
      },
    },
    {
      name: "status",
      type: "select",
      required: true,
      defaultValue: "paid",
      options: ["paid", "shipped", "completed", "cancelled"],
      admin: { position: "sidebar" },
    },
    { name: "trackingNumber", type: "text", admin: { position: "sidebar" } },
    { name: "shippedAt", type: "date", admin: { position: "sidebar", readOnly: true, date: { pickerAppearance: "dayAndTime" } } },
  ],
};
