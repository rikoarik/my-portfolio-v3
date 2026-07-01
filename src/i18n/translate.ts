type MessageTree = string | { [key: string]: MessageTree };

function getNestedValue(tree: MessageTree, key: string): string | undefined {
  const parts = key.split(".");
  let current: MessageTree = tree;
  for (const part of parts) {
    if (typeof current !== "object" || current === null || !(part in current)) {
      return undefined;
    }
    current = current[part];
  }
  return typeof current === "string" ? current : undefined;
}

function interpolate(template: string, vars?: Record<string, string | number>): string {
  if (!vars) return template;
  return template.replace(/\{(\w+)\}/g, (_, name: string) => {
    const value = vars[name];
    return value === undefined ? `{${name}}` : String(value);
  });
}

export function createTranslator(messages: MessageTree) {
  return function t(key: string, vars?: Record<string, string | number>): string {
    const value = getNestedValue(messages, key);
    if (value === undefined) return key;
    return interpolate(value, vars);
  };
}

export function flattenMessageKeys(tree: MessageTree, prefix = ""): string[] {
  if (typeof tree === "string") return prefix ? [prefix] : [];
  const keys: string[] = [];
  for (const [key, value] of Object.entries(tree)) {
    const path = prefix ? `${prefix}.${key}` : key;
    keys.push(...flattenMessageKeys(value, path));
  }
  return keys;
}
