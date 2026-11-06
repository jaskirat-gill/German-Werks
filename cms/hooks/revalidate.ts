import { revalidatePath, revalidateTag } from "next/cache";

export function revalidateStorefront(tag: "products" | "collections" | "pages" | "site") {
  try {
    revalidateTag(tag);
    revalidatePath("/", "layout");
  } catch {}
}
