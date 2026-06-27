"use client";

import {
  createContext,
  useActionState,
  useCallback,
  useContext,
  useEffect,
  useRef,
  type ReactNode,
} from "react";
import { useRouter } from "next/navigation";

import type { ActionResult } from "@/lib/admin/action-result";
import { notify } from "@/lib/admin/notify";

type GuardContextValue = {
  markSaved: () => void;
  registerDirtyCheck: (check: () => boolean) => void;
  state: ActionResult | null;
  pending: boolean;
};

const GuardContext = createContext<GuardContextValue | null>(null);

export function useEditorFormState() {
  const ctx = useContext(GuardContext);
  return ctx;
}

export function useUnsavedChangesGuard() {
  const ctx = useContext(GuardContext);
  if (!ctx) throw new Error("useUnsavedChangesGuard must be used within EditorForm");
  return ctx;
}

type EditorFormProps = {
  action: (
    prev: ActionResult | null,
    formData: FormData,
  ) => Promise<ActionResult>;
  children: ReactNode;
  onSuccess?: (result: ActionResult) => void;
  navigateOnCreate?: string;
  className?: string;
  formId?: string;
};

export function EditorForm({
  action,
  children,
  onSuccess,
  navigateOnCreate,
  className,
  formId = "editor-form",
}: EditorFormProps) {
  const router = useRouter();
  const [state, formAction, pending] = useActionState(action, null);
  const baselineRef = useRef<Record<string, string>>({});
  const dirtyCheckRef = useRef<(() => boolean) | null>(null);

  const markSaved = useCallback(() => {
    const form = document.querySelector<HTMLFormElement>(
      formId ? `#${formId}` : "form[data-editor-form]",
    );
    if (form) {
      const values: Record<string, string> = {};
      const data = new FormData(form);
      for (const [key, val] of data.entries()) {
        if (typeof val === "string") values[key] = val;
      }
      baselineRef.current = values;
    }
  }, []);

  useEffect(() => {
    markSaved();
  }, [markSaved]);

  useEffect(() => {
    if (!state) return;
    if (state.ok) {
      notify.success(state.message);
      markSaved();
      onSuccess?.(state);
      if (navigateOnCreate) {
        router.push(navigateOnCreate);
      }
    } else if (state.kind === "error") {
      notify.error(state.message);
    }
  }, [state, markSaved, onSuccess, navigateOnCreate, router]);

  useEffect(() => {
    const handler = (e: BeforeUnloadEvent) => {
      if (dirtyCheckRef.current?.()) {
        e.preventDefault();
        e.returnValue = "";
      }
    };
    window.addEventListener("beforeunload", handler);
    return () => window.removeEventListener("beforeunload", handler);
  }, []);

  const registerDirtyCheck = useCallback((check: () => boolean) => {
    dirtyCheckRef.current = check;
  }, []);

  return (
    <GuardContext.Provider value={{ markSaved, registerDirtyCheck, state, pending }}>
      <form
        id={formId}
        action={formAction}
        data-editor-form
        className={className}
        aria-busy={pending}
      >
        {children}
        {pending ? (
          <p className="sr-only" aria-live="polite">
            Menyimpan...
          </p>
        ) : null}
      </form>
    </GuardContext.Provider>
  );
}

export function getFieldValue(
  state: ActionResult | null,
  name: string,
  fallback: string,
): string {
  if (state && !state.ok && state.kind === "validation") {
    return state.values[name] ?? fallback;
  }
  return fallback;
}

export function getFieldErrors(
  state: ActionResult | null,
  name: string,
): string[] | undefined {
  if (state && !state.ok && state.kind === "validation") {
    return state.fieldErrors[name];
  }
  return undefined;
}
