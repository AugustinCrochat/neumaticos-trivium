import Link from "next/link";
import type { ReactNode } from "react";

export function LegalPage({
  title,
  subtitle,
  updated,
  children,
}: {
  title: string;
  subtitle: string;
  updated: string;
  children: ReactNode;
}) {
  return (
    <div className="min-h-screen bg-slate-50">
      <div className="bg-black py-10">
        <div className="max-w-3xl mx-auto px-4">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-slate-400 hover:text-white text-sm mb-6 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Inicio
          </Link>
          <h1 className="text-2xl md:text-3xl font-black text-white mb-2">{title}</h1>
          <p className="text-slate-400 text-sm">{subtitle}</p>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-10">
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 md:p-8">
          {children}
          <p className="text-xs text-slate-400 pt-4 border-t border-slate-100">
            Última actualización: {updated}.
          </p>
        </div>
      </div>
    </div>
  );
}

export function LegalSection({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="mb-8">
      <h2 className="text-lg font-black text-navy-900 mb-3">{title}</h2>
      <div className="text-slate-700 text-sm leading-relaxed space-y-3">{children}</div>
    </section>
  );
}
