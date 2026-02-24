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
    <form onSubmit={handleSubmit(onSubmit)} className="grid gap-6">
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
        error={errors.email?.message ? undefined : errors.password?.message}
        {...register("password")}
      />

      {serverError ? <ErrorBox message={serverError} /> : null}

      <button type="submit" disabled={isSubmitting} className="bg-primary hover:bg-primary/90 text-white py-4 px-6 rounded-2xl font-black text-sm shadow-xl shadow-primary/20 transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed mt-2">
        {isSubmitting ? "Authenticating..." : "Login"}
      </button>

      <p className="text-sm text-center text-white/50 m-0">
        New to Booko?{" "}
        <Link href="/register" className="text-white font-black hover:text-primary transition-colors underline decoration-primary/30 underline-offset-4">
          Create account
        </Link>
      </p>
    </form>
  );
}

function ErrorBox({ message }: { message: string }) {
  return (
    <div className="bg-primary/10 border border-primary/30 text-white/90 p-4 rounded-2xl text-xs font-medium animate-in shake-in duration-300">
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
    <div className="grid gap-2">
      <label className="text-[10px] uppercase font-black text-white/40 tracking-[0.2em] ml-1">{label}</label>
      <input
        {...props}
        className={`bg-white/5 border ${error ? "border-primary/50" : "border-white/10"} rounded-2xl p-4 text-white text-sm focus:border-primary/50 focus:outline-none transition-all placeholder:text-white/20`}
      />
      {error && (
        <span className="text-primary text-[10px] font-bold uppercase tracking-wider ml-1 mt-1">
          {error}
        </span>
      )}
    </div>
  );
}
