type DirtyCheck = () => boolean;

const checks = new Set<DirtyCheck>();

export function registerDirtyCheck(check: DirtyCheck): () => void {
  checks.add(check);
  return () => {
    checks.delete(check);
  };
}

export function isAnyFormDirty(): boolean {
  for (const check of checks) {
    if (check()) return true;
  }
  return false;
}
