"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { registerSchema, type RegisterSchema } from "../schema";

export default function RegisterForm() {
  const router = useRouter();
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterSchema>({
    resolver: zodResolver(registerSchema),
    mode: "onTouched",
    defaultValues: { name: "", email: "", password: "", confirmPassword: "" },
  });

  const onSubmit = async (values: RegisterSchema) => {
    setServerError(null);

    // ✅ MERN-ready: replace with backend API call later
    await new Promise((r) => setTimeout(r, 600));

    if (values.email.toLowerCase().includes("exists")) {
      setServerError("Email already exists (demo). Try another email.");
      return;
    }

    localStorage.setItem("booko_token", "demo_token");
    router.push("/auth/dashboard");
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} style={{ display: "grid", gap: 12 }}>
      <Field
        label="Full name"
        placeholder="Your name"
        error={errors.name?.message}
        {...register("name")}
      />

      <Field
        label="Email"
        placeholder="you@booko.com"
        type="email"
        error={errors.email?.message}
        {...register("email")}
      />

      <Field
        label="Password"
        placeholder="••••••••"
        type="password"
        error={errors.password?.message}
        {...register("password")}
      />

      <Field
        label="Confirm password"
        placeholder="••••••••"
        type="password"
        error={errors.confirmPassword?.message}
        {...register("confirmPassword")}
      />

      {serverError ? <ErrorBox message={serverError} /> : null}

      <button type="submit" disabled={isSubmitting} style={primaryBtn}>
        {isSubmitting ? "Creating..." : "Create account"}
      </button>

      <p style={{ margin: 0, fontSize: 13, color: "rgba(255,255,255,0.75)" }}>
        Already have a Booko account?{" "}
        <Link href="/login" style={linkStyle}>
          Login
        </Link>
      </p>
    </form>
  );
}

const primaryBtn: React.CSSProperties = {
  padding: "11px 14px",
  borderRadius: 12,
  border: "1px solid rgba(255,255,255,0.12)",
  background: "rgba(229,9,20,0.95)",
  color: "white",
  fontWeight: 800,
  cursor: "pointer",
};

const linkStyle: React.CSSProperties = {
  fontWeight: 800,
  color: "white",
  textDecoration: "underline",
};

function ErrorBox({ message }: { message: string }) {
  return (
    <div
      style={{
        padding: 10,
        borderRadius: 12,
        background: "rgba(255,77,79,0.12)",
        border: "1px solid rgba(255,77,79,0.35)",
        color: "rgba(255,255,255,0.92)",
        fontSize: 13,
      }}
    >
      {message}
    </div>
  );
}

type FieldProps = React.InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  error?: string;
};

function Field({ label, error, ...props }: FieldProps) {
  return (
    <div style={{ display: "grid", gap: 6 }}>
      <label style={{ fontSize: 13, fontWeight: 700 }}>{label}</label>
      <input
        {...props}
        style={{
          padding: "11px 12px",
          borderRadius: 12,
          border: `1px solid ${error ? "rgba(255,77,79,0.7)" : "rgba(255,255,255,0.14)"}`,
          background: "rgba(255,255,255,0.06)",
          color: "white",
          outline: "none",
        }}
      />
      {error ? (
        <span style={{ color: "rgba(255,120,120,1)", fontSize: 12 }}>
          {error}
        </span>
      ) : null}
    </div>
  );
}
