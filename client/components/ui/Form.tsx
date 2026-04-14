"use client";

import * as React from "react";
import {
  useForm as useRHF,
  FormProvider,
  useFormContext,
  type FieldValues,
  type DefaultValues,
  type Path,
} from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { ZodSchema } from "zod";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Select } from "@/components/ui/Select";

/**
 * components/ui/Form.tsx
 * Thin wrapper around react-hook-form + zod.
 * Provides <Form>, <Form.Field>, <Form.Error>, <Form.Submit>.
 */

// ─── Root Form ────────────────────────────────────────────────────────────────

interface FormProps<T extends FieldValues> {
  schema: ZodSchema<T>;
  defaultValues?: DefaultValues<T>;
  onSubmit: (data: T) => void | Promise<void>;
  children: React.ReactNode;
  className?: string;
}

function FormRoot<T extends FieldValues>({
  schema,
  defaultValues,
  onSubmit,
  children,
  className,
}: FormProps<T>) {
  const methods = useRHF<T>({
    resolver: zodResolver(schema) as any,
    defaultValues,
  });

  return (
    <FormProvider {...methods}>
      <form
        onSubmit={methods.handleSubmit(onSubmit as any)}
        noValidate
        className={cn("flex flex-col gap-4", className)}
      >
        {children}
      </form>
    </FormProvider>
  );
}

// ─── Form.Field ───────────────────────────────────────────────────────────────

type FieldType = "text" | "email" | "password" | "number" | "url" | "date" | "textarea" | "select";

interface FormFieldProps<T extends FieldValues> {
  name: Path<T>;
  label?: string;
  placeholder?: string;
  type?: FieldType;
  helperText?: string;
  disabled?: boolean;
  options?: { value: string; label: string }[];
  className?: string;
}

function FormField<T extends FieldValues>({
  name,
  label,
  placeholder,
  type = "text",
  helperText,
  disabled,
  options = [],
  className,
}: FormFieldProps<T>) {
  const { register, formState: { errors } } = useFormContext<T>();
  const error = errors[name];
  const errorMessage = typeof error?.message === "string" ? error.message : undefined;

  if (type === "textarea") {
    return (
      <Textarea
        {...register(name)}
        label={label}
        placeholder={placeholder}
        helperText={helperText}
        errorMessage={errorMessage}
        disabled={disabled}
        className={className}
      />
    );
  }

  if (type === "select") {
    return (
      <Select
        {...register(name)}
        label={label}
        placeholder={placeholder}
        helperText={helperText}
        errorMessage={errorMessage}
        disabled={disabled}
        options={options}
        className={className}
      />
    );
  }

  return (
    <Input
      {...register(name, type === "number" ? { valueAsNumber: true } : {})}
      type={type}
      label={label}
      placeholder={placeholder}
      helperText={helperText}
      errorMessage={errorMessage}
      disabled={disabled}
      className={className}
    />
  );
}

// ─── Form.Error ───────────────────────────────────────────────────────────────

function FormError({ message }: { message?: string }) {
  if (!message) return null;
  return (
    <p role="alert" className="text-sm text-[var(--status-error)] bg-[var(--status-error-bg)] border border-[color-mix(in_srgb,var(--status-error)_20%,transparent)] rounded-[var(--radius-md)] px-3 py-2">
      {message}
    </p>
  );
}

// ─── Form.Submit ──────────────────────────────────────────────────────────────

function FormSubmit({ children, className }: { children: React.ReactNode; className?: string }) {
  const { formState: { isSubmitting } } = useFormContext();
  return (
    <button
      type="submit"
      disabled={isSubmitting}
      className={cn(
        "inline-flex items-center justify-center gap-2 h-10 px-4 text-sm font-medium",
        "rounded-[var(--radius-md)] bg-[var(--accent-500)] text-white",
        "hover:bg-[var(--accent-600)] active:bg-[var(--accent-700)]",
        "transition-all duration-150 disabled:opacity-60 disabled:cursor-not-allowed",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-500)]",
        className
      )}
    >
      {isSubmitting ? (
        <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" className="opacity-25" />
          <path d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" fill="currentColor" className="opacity-75" />
        </svg>
      ) : null}
      {children}
    </button>
  );
}

// ─── Exports ──────────────────────────────────────────────────────────────────

export const Form = Object.assign(FormRoot, {
  Field: FormField,
  Error: FormError,
  Submit: FormSubmit,
});

export { useFormContext as useFormCtx };
