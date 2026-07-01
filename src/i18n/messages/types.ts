export type DeepString<T> = T extends string
  ? string
  : T extends Record<string, unknown>
    ? { [K in keyof T]: DeepString<T[K]> }
    : never;
