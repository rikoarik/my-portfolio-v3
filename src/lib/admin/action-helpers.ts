import type { z } from "zod";

import {
  type ActionResult,
  errorResult,
  successResult,
  zodValidationResult,
} from "./action-result";
import { checkJsonField } from "./json-field";

export function resolveFormData(
  prevOrFormData: ActionResult | null | FormData,
  maybeFormData?: FormData,
): FormData {
  if (maybeFormData) return maybeFormData;
  return prevOrFormData as FormData;
}

export async function runAction(
  fn: () => Promise<ActionResult>,
): Promise<ActionResult> {
  try {
    return await fn();
  } catch {
    return errorResult("Terjadi kesalahan. Coba lagi.");
  }
}

export function parseForm<T extends z.ZodType>(
  schema: T,
  formData: FormData,
  raw: Record<string, unknown>,
): { ok: true; data: z.infer<T> } | { ok: false; result: ActionResult } {
  const parsed = schema.safeParse(raw);
  if (!parsed.success) {
    return {
      ok: false,
      result: zodValidationResult(parsed.error.flatten().fieldErrors, formData),
    };
  }
  return { ok: true, data: parsed.data };
}

export function validateJsonFields(
  formData: FormData,
  fields: { name: string; label: string }[],
): ActionResult | null {
  for (const field of fields) {
    const raw = String(formData.get(field.name) ?? "");
    const check = checkJsonField(raw);
    if (!check.ok) {
      const message =
        check.reason === "too-long"
          ? `${field.label}: panjang maksimum JSON terlampaui`
          : `${field.label}: JSON tidak valid`;
      return zodValidationResult({ [field.name]: [message] }, formData);
    }
  }
  return null;
}

export function readBoolean(formData: FormData, name: string): boolean {
  const value = formData.get(name);
  return value === "on" || value === "true" || value === "1";
}

export function buildDeleteSuccess(
  module: string,
  record: string,
): ActionResult {
  return successResult(`Menghapus ${record} dari ${module}`, module, record);
}

export function buildSaveSuccess(
  action: "Membuat" | "Memperbarui",
  module: string,
  record: string,
): ActionResult {
  return successResult(`${action} ${record} di ${module}`, module, record);
}

export function buildReorderSuccess(module: string): ActionResult {
  return successResult(`Mengubah urutan di ${module}`, module);
}

export function buildStatusSuccess(
  module: string,
  record: string,
  status: string,
): ActionResult {
  return successResult(
    `Mengubah status ${record} menjadi ${status} di ${module}`,
    module,
    record,
  );
}

export function buildBulkSuccess(
  module: string,
  op: string,
  succeeded: number,
  failed: number,
): ActionResult {
  if (failed > 0) {
    return successResult(
      `${op} di ${module}: ${succeeded} berhasil, ${failed} gagal`,
      module,
    );
  }
  return successResult(`${op} ${succeeded} item di ${module}`, module);
}
