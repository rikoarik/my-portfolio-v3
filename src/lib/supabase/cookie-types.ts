/** Shape used by @supabase/ssr setAll callbacks */
export type CookieToSet = {
  name: string;
  value: string;
  options?: Record<string, unknown>;
};
