import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-slate-200/70 dark:border-slate-800/60 bg-white dark:bg-[#0a0f1e]">
      <div className="mx-auto flex max-w-[1100px] items-center justify-between px-6 py-6 lg:px-10">
        <span className="text-[13px] text-slate-400 dark:text-slate-500">
          © {new Date().getFullYear()} RefineSplit. All rights reserved.
        </span>
        <div className="flex items-center gap-5">
          {[
            { label: "Privacy", href: "#" },
            { label: "Terms",   href: "#" },
            { label: "Support", href: "#" },
          ].map((l) => (
            <Link
              key={l.label}
              href={l.href}
              className="text-[13px] text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 transition-colors"
            >
              {l.label}
            </Link>
          ))}
        </div>
      </div>
    </footer>
  );
}
