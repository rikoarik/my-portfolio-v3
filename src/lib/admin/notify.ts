"use client";

import { toast } from "sonner";

import type { ActionResult } from "./action-result";

export const notify = {
  success(message: string) {
    toast.success(message, { duration: 5000, closeButton: true });
  },
  error(message: string) {
    toast.error(message, { duration: Infinity, closeButton: true });
  },
  fromResult(result: ActionResult) {
    if (result.ok) {
      notify.success(result.message);
    } else if (result.kind === "error") {
      notify.error(result.message);
    }
  },
};
