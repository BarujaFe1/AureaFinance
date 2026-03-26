"use client";

export default function GlobalError({ error, reset }: { error: Error; reset: () => void }) {
  return (
    <div className="space-y-4 rounded-3xl border border-red-500/30 bg-red-500/10 p-8 text-red-200">
      <div>
        <h2 className="text-xl font-semibold">Algo saiu do esperado</h2>
        <p className="mt-2 text-sm text-red-100/80">{error.message || "Falha inesperada ao renderizar a pÃ¡gina."}</p>
      </div>
      <button
        type="button"
        onClick={reset}
        className="inline-flex h-10 items-center justify-center rounded-2xl bg-white/10 px-4 text-sm font-medium text-white"
      >
        Tentar novamente
      </button>
    </div>
  );
}
