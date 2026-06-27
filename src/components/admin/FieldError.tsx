export function FieldError({ errors }: { errors?: string[] }) {
  if (!errors?.length) return null;
  return (
    <p className="mt-1 text-sm text-red-600" role="alert">
      {errors.join(" ")}
    </p>
  );
}
