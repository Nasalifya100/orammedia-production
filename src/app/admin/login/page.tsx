"use client";

import { useActionState } from "react";
import { loginAction } from "@/pams/auth/actions";

export default function AdminLoginPage() {
  const [state, action, pending] = useActionState(loginAction, null);

  return (
    <div className="flex min-h-screen items-center justify-center px-6">
      <form
        action={action}
        className="w-full max-w-md border border-white/10 bg-[#121216] p-8"
      >
        <p className="text-[10px] uppercase tracking-[0.28em] text-amber-500/90">
          PAMS
        </p>
        <h1 className="mt-3 text-2xl tracking-tight">Archive sign in</h1>
        <p className="mt-2 text-sm text-white/50">
          Production Archive Management System
        </p>

        <label className="mt-8 block text-xs uppercase tracking-[0.16em] text-white/40">
          Email
          <input
            name="email"
            type="email"
            required
            className="mt-2 w-full border border-white/10 bg-black/40 px-3 py-2.5 text-sm text-white outline-none focus:border-amber-500/50"
            defaultValue="admin@orammedia.com"
          />
        </label>

        <label className="mt-5 block text-xs uppercase tracking-[0.16em] text-white/40">
          Password
          <input
            name="password"
            type="password"
            required
            className="mt-2 w-full border border-white/10 bg-black/40 px-3 py-2.5 text-sm text-white outline-none focus:border-amber-500/50"
          />
        </label>

        {state?.error ? (
          <p className="mt-4 text-sm text-red-400">{state.error}</p>
        ) : null}

        <button
          type="submit"
          disabled={pending}
          className="mt-8 w-full bg-amber-600 px-4 py-3 text-sm font-medium text-black transition hover:bg-amber-500 disabled:opacity-60"
        >
          {pending ? "Signing in…" : "Sign in"}
        </button>
      </form>
    </div>
  );
}
