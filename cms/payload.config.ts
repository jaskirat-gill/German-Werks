import { mongooseAdapter } from "@payloadcms/db-mongodb";
import { resendAdapter } from "@payloadcms/email-resend";
import { lexicalEditor } from "@payloadcms/richtext-lexical";
import path from "path";
import { buildConfig } from "payload";
import sharp from "sharp";
import { fileURLToPath } from "url";
import "dotenv/config";

import { Carts } from "./collections/Carts";
import { Collections } from "./collections/Collections";
import { Media } from "./collections/Media";
import { Orders } from "./collections/Orders";
import { Pages } from "./collections/Pages";
import { Products } from "./collections/Products";
import { Users } from "./collections/Users";
import { ShippingSettings } from "./globals/ShippingSettings";
import { SiteSettings } from "./globals/SiteSettings";

const dirname = path.dirname(fileURLToPath(import.meta.url));

export default buildConfig({
  admin: {
    user: Users.slug,
    importMap: { baseDir: path.resolve(dirname, "..") },
  },
  serverURL: process.env.PAYLOAD_PUBLIC_SERVER_URL || undefined,
  collections: [Users, Media, Products, Collections, Pages, Carts, Orders],
  globals: [SiteSettings, ShippingSettings],
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || "",
  typescript: { outputFile: path.resolve(dirname, "payload-types.ts") },
  db: mongooseAdapter({ url: process.env.DATABASE_URL || "" }),
  email: process.env.RESEND_API_KEY
    ? resendAdapter({
        defaultFromAddress: process.env.EMAIL_FROM_ADDRESS || "onboarding@resend.dev",
        defaultFromName: process.env.EMAIL_FROM_NAME || process.env.SITE_NAME || "German Werks",
        apiKey: process.env.RESEND_API_KEY,
      })
    : undefined,
  sharp,
});
