"use client";

import { useActionState } from "react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { loginAdmin } from "@/lib/actions/admin-auth";

export default function AdminLoginPage() {
  const router = useRouter();
  const [state, formAction, pending] = useActionState(loginAdmin, null);

  useEffect(() => {
    if (state?.success) router.push("/admin/dashboard");
  }, [state, router]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-[var(--color-ink)] px-6">
      <div className="w-full max-w-sm rounded-2xl bg-[var(--color-ink-soft)] p-8">
        <p className="font-display text-2xl text-white">FashunSënze</p>
        <p className="mt-1 text-xs tracking-wide text-white/50 uppercase">Admin Dashboard</p>

        <form action={formAction} className="mt-8 flex flex-col gap-4">
          <div>
            <label className="mb-1.5 block text-xs font-medium text-white/60">Email</label>
            <input
              name="email"
              type="email"
              required
              defaultValue="admin@fashunsenze.com"
              className="w-full rounded-lg border border-white/15 bg-white/5 px-4 py-3 text-sm text-white outline-none focus:border-white/40"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-medium text-white/60">Password</label>
            <input
              name="password"
              type="password"
              required
              placeholder="fashun2024"
              className="w-full rounded-lg border border-white/15 bg-white/5 px-4 py-3 text-sm text-white outline-none focus:border-white/40"
            />
          </div>

          {state?.error && <p className="rounded-lg bg-red-500/10 px-3 py-2 text-sm text-red-300">{state.error}</p>}

          <button
            disabled={pending}
            className="mt-2 rounded-full bg-white py-3 text-sm font-semibold text-[var(--color-ink)] transition hover:opacity-90 disabled:opacity-50"
          >
            {pending ? "Signing in…" : "Sign In"}
          </button>
        </form>

        <p className="mt-6 text-center text-[11px] text-white/40">
          Demo mode · default password: fashun2024
        </p>
      </div>
    </div>
  );
}
