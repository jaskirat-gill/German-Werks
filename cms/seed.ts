import fs from "fs";
import os from "os";
import path from "path";
import sharp from "sharp";
import { getPayload } from "payload";
import config from "@payload-config";
import { paragraphs } from "./richText";

const payload = await getPayload({ config });

if ((await payload.count({ collection: "products" })).totalDocs > 0) {
  console.log("Products already exist, skipping seed");
  process.exit(0);
}

const tmp = fs.mkdtempSync(path.join(os.tmpdir(), "gw-seed-"));

async function placeholder(label: string, tone: number) {
  const bg = `rgb(${18 + tone}, ${18 + tone}, ${20 + tone})`;
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="1500"><rect width="100%" height="100%" fill="${bg}"/><rect x="60" y="60" width="1080" height="1380" fill="none" stroke="#efeae2" stroke-opacity="0.25"/><text x="600" y="760" font-family="serif" font-size="64" fill="#efeae2" text-anchor="middle">${label}</text></svg>`;
  const file = path.join(tmp, `${label.toLowerCase().replace(/[^a-z0-9]+/g, "-")}-${tone}.png`);
  await sharp(Buffer.from(svg)).png().toFile(file);
  return file;
}

async function upload(filePath: string, alt: string) {
  const doc = await payload.create({ collection: "media", data: { alt }, filePath });
  return doc.id;
}

const collections = Object.fromEntries(
  await Promise.all(
    (
      [
        ["body-aero", "Body & Aero", "Aero-driven body components developed in the wind tunnel and finished by hand."],
        ["carbon-fibre", "Carbon Fibre", "Pre-preg carbon fibre pieces, autoclave cured and clear coated."],
        ["performance", "Performance", "Engine, intake and exhaust upgrades for road and track."],
      ] as const
    ).map(async ([handle, title, description]) => {
      const doc = await payload.create({ collection: "collections", data: { handle, title, description, seo: { title, description } } });
      return [handle, doc.id] as const;
    }),
  ),
);

type SeedProduct = {
  title: string;
  collection: string;
  description: string;
  tags: string[];
  featured?: boolean;
  options: { name: string; values: string[] }[];
  base: number;
  variants: { values: string[]; price?: number; stock: number }[];
  heroImage?: string;
};

const products: SeedProduct[] = [
  {
    title: "Carbon Front Splitter",
    collection: "carbon-fibre",
    description: "Dry carbon front splitter with a molded lip and integrated brake ducts.",
    tags: ["Carbon Fibre", "Aero"],
    featured: true,
    options: [{ name: "Finish", values: ["Gloss", "Matte"] }],
    base: 129900,
    variants: [
      { values: ["Gloss"], stock: 8 },
      { values: ["Matte"], price: 134900, stock: 5 },
    ],
    heroImage: path.join(process.cwd(), "public", "hero-car.png"),
  },
  {
    title: "Carbon Rear Diffuser",
    collection: "carbon-fibre",
    description: "Pre-preg rear diffuser tuned for stability above 160 km/h.",
    tags: ["Carbon Fibre", "Aero"],
    featured: true,
    options: [{ name: "Finish", values: ["Gloss", "Matte"] }],
    base: 189900,
    variants: [
      { values: ["Gloss"], stock: 4 },
      { values: ["Matte"], stock: 0 },
    ],
  },
  {
    title: "Wide Body Fender Set",
    collection: "body-aero",
    description: "Four-piece widebody fender set, +45 mm per corner, supplied primed.",
    tags: ["Body & Aero"],
    options: [{ name: "Fitment", values: ["Coupe", "Sedan"] }],
    base: 349900,
    variants: [
      { values: ["Coupe"], stock: 3 },
      { values: ["Sedan"], price: 369900, stock: 2 },
    ],
  },
  {
    title: "Adjustable Rear Wing",
    collection: "body-aero",
    description: "Two-position adjustable wing with machined aluminium swan-neck mounts.",
    tags: ["Body & Aero", "Aero"],
    options: [{ name: "Finish", values: ["Gloss", "Matte"] }],
    base: 219900,
    variants: [
      { values: ["Gloss"], stock: 6 },
      { values: ["Matte"], stock: 6 },
    ],
  },
  {
    title: "Titanium Cat-Back Exhaust",
    collection: "performance",
    description: "Titanium cat-back with valved tips and a measured 4 dB gain in the upper range.",
    tags: ["Performance", "Exhaust"],
    options: [{ name: "Tips", values: ["Titanium", "Black Ceramic"] }],
    base: 289900,
    variants: [
      { values: ["Titanium"], stock: 5 },
      { values: ["Black Ceramic"], price: 299900, stock: 3 },
    ],
  },
  {
    title: "Carbon Intake System",
    collection: "performance",
    description: "Closed-airbox carbon intake with a high-flow washable filter.",
    tags: ["Performance", "Carbon Fibre"],
    options: [],
    base: 99900,
    variants: [{ values: [], stock: 12 }],
  },
];

for (const [index, p] of products.entries()) {
  const images = [await upload(await placeholder(p.title, index * 6), `${p.title} - front`), await upload(await placeholder(`${p.title} detail`, index * 6 + 3), `${p.title} - detail`)];
  if (p.heroImage) images.unshift(await upload(p.heroImage, `${p.title} - studio`));
  await payload.create({
    collection: "products",
    data: {
      title: p.title,
      description: paragraphs(p.description),
      images: images.map((image) => ({ image })),
      tags: p.tags,
      featured: p.featured ?? false,
      collections: [collections[p.collection]!],
      seo: { title: p.title, description: p.description },
      options: p.options,
      variants: p.variants.map((v, i) => ({
        title: v.values.length ? v.values.join(" / ") : "Default Title",
        selectedOptions: v.values.length
          ? v.values.map((value, j) => ({ name: p.options[j]!.name, value }))
          : [{ name: "Title", value: "Default Title" }],
        priceCents: v.price ?? p.base,
        sku: `GW-${index + 1}-${i + 1}`,
        stock: v.stock,
      })),
    },
  });
}

await payload.create({
  collection: "pages",
  data: { title: "About", handle: "about", body: paragraphs("German Werks builds aftermarket carbon fibre and performance parts in Vancouver, BC.") },
});
await payload.create({
  collection: "pages",
  data: { title: "Shipping & Returns", handle: "shipping-returns", body: paragraphs("Orders ship within 5 business days. Unused parts may be returned within 30 days.") },
});

await payload.updateGlobal({
  slug: "site-settings",
  data: {
    contactEmail: "germanwerks604@gmail.com",
    navbarMenu: [{ title: "About", path: "/about" }],
    footerMenu: [{ title: "Shipping & Returns", path: "/shipping-returns" }],
  },
});

await payload.updateGlobal({
  slug: "shipping-settings",
  data: {
    options: [
      { label: "Standard (5-7 business days)", amountCents: 1500 },
      { label: "Express (2-3 business days)", amountCents: 3500 },
    ],
  },
});

if (process.env.SEED_ADMIN_EMAIL && process.env.SEED_ADMIN_PASSWORD) {
  await payload.create({ collection: "users", data: { email: process.env.SEED_ADMIN_EMAIL, password: process.env.SEED_ADMIN_PASSWORD } });
}

console.log("Seeded");
process.exit(0);
