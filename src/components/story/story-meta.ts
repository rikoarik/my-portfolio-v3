export const STORY_CHAPTERS = [
  { id: "open", label: "Buka", labelEn: "Open" },
  { id: "path", label: "Jalur", labelEn: "Path" },
  { id: "shipped", label: "Rilis", labelEn: "Shipped" },
  { id: "stack", label: "Stack", labelEn: "Stack" },
  { id: "next", label: "Lanjut", labelEn: "Next" },
] as const;

export type ChapterId = (typeof STORY_CHAPTERS)[number]["id"];
