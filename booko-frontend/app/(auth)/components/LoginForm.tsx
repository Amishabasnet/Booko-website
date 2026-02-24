"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { loginUser } from "@/app/services/auth.service";
import { useAuth } from "@/app/context/AuthContext";
import { loginSchema, type LoginSchema } from "../schema";

export default function LoginForm() {
  const router = useRouter();
  const { login } = useAuth();
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginSchema>({
    resolver: zodResolver(loginSchema),
    mode: "onTouched",
    defaultValues: { email: "", password: "" },
  });

  const onSubmit = async (values: LoginSchema) => {
    setServerError(null);

    try {
      const response = await loginUser({
        email: values.email,
        password: values.password,
      });

      const { token, user } = response.data;
      login(token, user);

      router.push("/");
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 401) {
          setServerError("Invalid email or password.");
        } else {
          setServerError(
            error.response?.data?.message || "An error occurred. Please try again."
          );
        }
      } else {
        setServerError("A network error occurred.");
      }
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} style={{ display: "grid", gap: 12 }}>
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

      {serverError ? <ErrorBox message={serverError} /> : null}

      <button type="submit" disabled={isSubmitting} style={primaryBtn}>
        {isSubmitting ? "Logging in..." : "Login"}
      </button>

      <p style={{ margin: 0, fontSize: 13, color: "rgba(255,255,255,0.75)" }}>
        New to Booko?{" "}
        <Link href="/register" style={linkStyle}>
          Create account
        </Link>
      </p>
    </form>
  );
}

/** Small UI components inside same file (still separated logically) */
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
