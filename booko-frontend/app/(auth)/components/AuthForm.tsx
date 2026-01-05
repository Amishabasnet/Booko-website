"use client";

import { useState } from "react";
import { loginUser, registerUser } from "../../services/auth.service";
import { useRouter } from "next/navigation";

interface Props {
  type: "login" | "register";
}

export default function AuthForm({ type }: Props) {
  const router = useRouter();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const submitHandler = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (type === "register") {
        await registerUser(form);
        router.push("/login");
      } else {
        const res = await loginUser(form);
        localStorage.setItem("token", res.data.token);
        router.push("/dashboard");
      }
    } catch (error) {
      alert("Authentication failed");
    }
  };

  return (
    <form onSubmit={submitHandler} className="space-y-4">
      {type === "register" && (
        <input
          placeholder="Name"
          className="border p-2 w-full"
          onChange={(e) =>
            setForm({ ...form, name: e.target.value })
          }
        />
      )}

      <input
        placeholder="Email"
        className="border p-2 w-full"
        onChange={(e) =>
          setForm({ ...form, email: e.target.value })
        }
      />

      <input
        type="password"
        placeholder="Password"
        className="border p-2 w-full"
        onChange={(e) =>
          setForm({ ...form, password: e.target.value })
        }
      />

      <button className="bg-black text-white px-4 py-2 w-full">
        {type === "login" ? "Login" : "Register"}
      </button>
    </form>
  );
}
