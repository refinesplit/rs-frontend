export default function Loading() {
  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-gradient-to-b from-[#f5fbff] via-white to-[#f4f9ff] dark:from-[#08101d] dark:via-[#0a0f1e] dark:to-[#0c1424]">
      <div className="pointer-events-none absolute inset-0">
        <div className="rs-float absolute left-[14%] top-[24%] h-44 w-44 rounded-full bg-[#dceeff] blur-3xl opacity-95 dark:bg-[#103159] dark:opacity-45" />
        <div className="rs-float rs-delay-3 absolute right-[10%] top-[20%] h-36 w-36 rounded-full bg-[#dff6e2] blur-3xl opacity-90 dark:bg-[#204d20] dark:opacity-35" />
        <div className="rs-float rs-delay-2 absolute bottom-[18%] left-[22%] h-40 w-40 rounded-full bg-[#fae3cf] blur-3xl opacity-80 dark:bg-[#5a2f16] dark:opacity-35" />
      </div>

      <div className="relative z-10 flex w-full max-w-[620px] flex-col items-center px-6 text-center">
        <div className="relative mb-7 flex h-44 w-44 items-center justify-center">
          <div className="rs-orbit absolute h-44 w-44 rounded-full border border-[#c6ddf5] dark:border-[#2d4d73]" />
          <div className="rs-orbit absolute h-32 w-32 rounded-full border border-[#d8e9bb] dark:border-[#3e5d2b]" style={{ animationDuration: "13s" }} />
          <div className="rs-glow h-12 w-12 rounded-[14px] bg-gradient-to-br from-[#185FA5] to-[#2e85d8] shadow-[0_0_60px_rgba(24,95,165,0.38)]" />
          <span className="rs-glow absolute -top-1 left-1/2 h-2.5 w-2.5 -translate-x-1/2 rounded-full bg-[#2f7ecb]" />
          <span className="rs-glow absolute -bottom-1 left-[18%] h-2 w-2 rounded-full bg-[#6b9f2d]" />
        </div>

        <h2 className="rs-reveal-up text-[28px] font-medium tracking-[-0.5px] text-slate-900 dark:text-white">
          Preparing your workspace
        </h2>
        <p className="rs-reveal-up rs-delay-2 mt-2 text-[14px] text-slate-500 dark:text-slate-400">
          Optimizing templates, invoices, and pricing data...
        </p>

        <div className="mt-6 h-2 w-full max-w-[340px] overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
          <div className="rs-shimmer h-full w-full" />
        </div>
      </div>
    </main>
  );
}
