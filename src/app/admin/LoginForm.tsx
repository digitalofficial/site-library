"use client";

import { useFormState, useFormStatus } from "react-dom";
import { login } from "./actions";

function Submit() {
  const { pending } = useFormStatus();
  return (
    <button type="submit" disabled={pending} className="w-full py-2.5 rounded-xl bg-[#D77E00] text-[#08080C] font-bold text-sm hover:bg-[#e58a0a] disabled:cursor-wait">
      {pending ? "Checking…" : "Sign in"}
    </button>
  );
}

export default function LoginForm() {
  const [state, action] = useFormState(login, null);
  return (
    <main className="min-h-[100dvh] bg-[#08080C] text-[#F0F0F2] flex items-center justify-center px-4">
      <form action={action} className="w-full max-w-xs space-y-4 p-6 rounded-2xl border border-white/[.08] bg-[#111116]">
        <h1 className="font-bold text-lg"><span className="text-[#D77E00]">Digital Official</span> <span className="text-[#9a9aa3] font-normal text-sm">Portfolio admin</span></h1>
        <label className="block text-xs text-[#9a9aa3]">
          Password
          <input name="password" type="password" autoFocus autoComplete="current-password" required className="mt-1 w-full px-3 py-2 rounded-lg bg-white/[.04] border border-white/[.1] text-[16px] text-white focus:outline-none focus:border-[#D77E00]/60" />
        </label>
        {state && !state.ok && <p role="alert" className="text-sm text-[#ff8a8a]">{state.error}</p>}
        <Submit />
        <p className="text-[11px] text-[#8a8a92]">Set as <code>ADMIN_PASSWORD</code> in the Vercel project.</p>
      </form>
    </main>
  );
}
