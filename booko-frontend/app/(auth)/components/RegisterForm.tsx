"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { registerUser } from "@/app/services/auth.service";
import { registerSchema, type RegisterSchema } from "../schema";

export default function RegisterForm() {
  const router = useRouter();
  const [serverError, setServerError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterSchema>({
    resolver: zodResolver(registerSchema),
    mode: "onTouched",
    defaultValues: { name: "", email: "", phoneNumber: "", dob: "", gender: "prefer_not_to_say", role: "user", password: "", confirmPassword: "" },
  });

  const onSubmit = async (values: RegisterSchema) => {
    setServerError(null);
    setSuccessMessage(null);

    try {
      await registerUser({
        name: values.name,
        email: values.email,
        phoneNumber: values.phoneNumber,
        dob: values.dob,
        gender: values.gender,
        role: values.role,
        password: values.password,
      });

      setSuccessMessage("Account created successfully! Redirecting to login...");

      setTimeout(() => {
        router.push("/login");
      }, 2000);
    } catch (error: unknown) {
      let message = "An error occurred during registration. Please try again.";
      if (axios.isAxiosError(error)) {
        message = error.response?.data?.message || message;
      }
      setServerError(message);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="grid gap-6">
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
        label="Phone Number"
        placeholder="+1 (555) 000-0000"
        type="tel"
        error={errors.phoneNumber?.message}
        {...register("phoneNumber")}
      />

      <Field
        label="Date of Birth"
        type="date"
        error={errors.dob?.message}
        {...register("dob")}
      />

      <SelectField
        label="Gender"
        error={errors.gender?.message}
        {...register("gender")}
      >
        <option value="male">Male</option>
        <option value="female">Female</option>
        <option value="other">Other</option>
        <option value="prefer_not_to_say">Prefer not to say</option>
      </SelectField>

      <SelectField
        label="Account Role"
        error={errors.role?.message}
        {...register("role")}
      >
        <option value="user">User</option>
        <option value="admin">Admin</option>
      </SelectField>

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

      {successMessage ? <SuccessBox message={successMessage} /> : null}
      {serverError ? <ErrorBox message={serverError} /> : null}

      <button type="submit" disabled={isSubmitting} className="bg-primary hover:bg-primary/90 text-white py-4 px-6 rounded-2xl font-black text-sm shadow-xl shadow-primary/20 transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed mt-2">
        {isSubmitting ? "Generating digital key..." : "Create account"}
      </button>

      <p className="text-sm text-center text-white/50 m-0">
        Already have a Booko account?{" "}
        <Link href="/login" className="text-white font-black hover:text-primary transition-colors underline decoration-primary/30 underline-offset-4">
          Login
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

function SuccessBox({ message }: { message: string }) {
  return (
    <div className="bg-green-500/10 border border-green-500/30 text-green-500 p-4 rounded-2xl text-xs font-medium animate-in zoom-in-95 duration-300">
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
        className={`bg-white/5 border ${error ? "border-primary/50" : "border-white/10"} rounded-2xl p-4 text-white text-sm focus:border-primary/50 focus:outline-none transition-all placeholder:text-white/20 appearance-none`}
      />
      {error && (
        <span className="text-primary text-[10px] font-bold uppercase tracking-wider ml-1 mt-1">
          {error}
        </span>
      )}
    </div>
  );
}

type SelectFieldProps = React.SelectHTMLAttributes<HTMLSelectElement> & {
  label: string;
  error?: string;
};

function SelectField({ label, error, children, ...props }: SelectFieldProps) {
  return (
    <div className="grid gap-2">
      <label className="text-[10px] uppercase font-black text-white/40 tracking-[0.2em] ml-1">{label}</label>
      <select
        {...props}
        className={`bg-[rgba(255,255,255,0.05)] border ${error ? "border-primary/50" : "border-white/10"} rounded-2xl p-4 text-white text-sm focus:border-primary/50 focus:outline-none transition-all appearance-none cursor-pointer`}
      >
        {children}
      </select>
      {error && (
        <span className="text-primary text-[10px] font-bold uppercase tracking-wider ml-1 mt-1">
          {error}
        </span>
      )}
    </div>
  );
}
