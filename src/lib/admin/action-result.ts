export type FieldErrors = Record<string, string[]>;

export type ActionResult =
  | { ok: true; message: string; module: string; record?: string; data?: unknown }
  | { ok: false; kind: "validation"; fieldErrors: FieldErrors; values: Record<string, string> }
  | { ok: false; kind: "error"; message: string };

export function successResult(
  message: string,
  module: string,
  record?: string,
  data?: unknown,
): ActionResult {
  return { ok: true, message, module, record, data };
}

export function errorResult(message: string): ActionResult {
  return { ok: false, kind: "error", message };
}

export function formDataToValues(formData: FormData): Record<string, string> {
  const values: Record<string, string> = {};
  for (const [key, value] of formData.entries()) {
    if (typeof value === "string") {
      values[key] = value;
    }
  }
  return values;
}

export function validationResult(
  fieldErrors: FieldErrors,
  formData: FormData,
): ActionResult {
  return {
    ok: false,
    kind: "validation",
    fieldErrors,
    values: formDataToValues(formData),
  };
}

export function zodValidationResult(
  fieldErrors: Record<string, string[] | undefined>,
  formData: FormData,
): ActionResult {
  const normalized: FieldErrors = {};
  for (const [key, messages] of Object.entries(fieldErrors)) {
    if (messages && messages.length > 0) {
      normalized[key] = messages;
    }
  }
  return validationResult(normalized, formData);
}
