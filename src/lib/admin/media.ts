export function isImageMime(mime: string | null | undefined): boolean {
  return typeof mime === "string" && mime.startsWith("image/");
}
