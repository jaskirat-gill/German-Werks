export function paragraphs(...texts: string[]) {
  return {
    root: {
      type: "root",
      version: 1,
      direction: "ltr" as const,
      format: "" as const,
      indent: 0,
      children: texts.map((text) => ({
        type: "paragraph",
        version: 1,
        direction: "ltr" as const,
        format: "" as const,
        indent: 0,
        textFormat: 0,
        children: [{ type: "text", version: 1, text, detail: 0, format: 0, mode: "normal", style: "" }],
      })),
    },
  };
}
