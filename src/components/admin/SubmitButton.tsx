"use client";

import { useFormStatus } from "react-dom";
import { Button, type ButtonProps } from "@/components/ui/button";

type SubmitButtonProps = Omit<ButtonProps, "type"> & {
  pendingText?: string;
};

export function SubmitButton({
  children,
  pendingText = "Menyimpan...",
  disabled,
  ...props
}: SubmitButtonProps) {
  const { pending } = useFormStatus();

  return (
    <Button type="submit" disabled={disabled || pending} aria-busy={pending} {...props}>
      {pending ? pendingText : children}
    </Button>
  );
}

