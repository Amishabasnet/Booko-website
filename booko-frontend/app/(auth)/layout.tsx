import type { ReactNode } from "react";

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen grid place-items-center p-6 bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] from-primary/20 via-transparent to-transparent bg-[#0a0a0a] text-white overflow-x-hidden">
      <div className="w-full max-w-md animate-in fade-in zoom-in-95 duration-700">
        {/* Brand Header */}
        <div className="mb-8 flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-primary flex items-center justify-center text-xl font-black shadow-lg shadow-primary/20">
            B
          </div>
          <div>
            <div className="text-2xl font-black tracking-tighter">BOOKO<span className="text-primary">.</span></div>
            <div className="text-xs text-white/50 font-bold uppercase tracking-widest mt-0.5">
              Experience Cinema
            </div>
          </div>
        </div>

        {/* Card */}
        <div className="bg-white/5 border border-white/10 rounded-[32px] p-8 md:p-10 shadow-2xl backdrop-blur-md">
          {children}
        </div>

        <p className="mt-8 text-[10px] text-white/30 text-center uppercase font-bold tracking-widest leading-relaxed">
          By continuing, you agree to Booko's<br />
          <span className="text-white/50">Terms of Service & Privacy Policy</span>
        </p>
      </div>
    </div>
  );
}
