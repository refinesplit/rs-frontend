import { cn } from "@/lib/utils";

/**
 * RefineSplit / Refine* Brand Logo
 *
 * A custom-drawn geometric "R" mark built entirely from SVG paths.
 * No font assets used — this is a fully original vector mark.
 *
 * The design:
 *   - Rounded-square container in deep navy (#0f2d5a)
 *   - White "R" with a custom geometric spine, bowl, and an
 *     angled leg that kicks upward — a subtle nod to growth/analytics
 *   - Works at any size from 16px favicon to full billboard
 *
 * Usage:
 *   <Logo />                    — icon only (32px default)
 *   <Logo size={48} />          — icon only, custom size
 *   <Logo wordmark />           — icon + "RefineSplit" text
 *   <Logo wordmark="Refine" />  — icon + custom wordmark text
 *   <Logo variant="light" />    — white container (for dark bgs)
 *   <Logo variant="mono" />     — single-color (no fill bg)
 */

interface LogoProps {
  /** Size of the icon in px (default: 32) */
  size?: number;
  /** Show a wordmark next to the icon */
  wordmark?: boolean | string;
  /** Colour variant */
  variant?: "default" | "light" | "mono";
  className?: string;
}

export function Logo({
  size = 32,
  wordmark = false,
  variant = "default",
  className,
}: LogoProps) {
  const bgFill =
    variant === "light" ? "#ffffff"
    : variant === "mono"  ? "currentColor"
    : "#0f2d5a";

  const markFill =
    variant === "light" ? "#0f2d5a"
    : variant === "mono"  ? "white"
    : "#ffffff";

  const fontSize = Math.round(size * 0.58);
  const gap = Math.round(size * 0.35);

  const wordmarkText =
    typeof wordmark === "string" ? wordmark : "RefineSplit";

  return (
    <span
      className={cn("inline-flex items-center select-none", className)}
      style={{ gap: wordmark ? gap : 0 }}
      role="img"
      aria-label="Refine logo"
    >
      {/* ── Icon mark ── */}
      <svg
        width={size}
        height={size}
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ flexShrink: 0 }}
      >
        {/* Rounded-square container */}
        <rect
          width="100"
          height="100"
          rx="22"
          fill={bgFill}
        />

        {/*
          Custom geometric "R" — original SVG path, no font used.

          Construction:
            • Vertical spine: left column from top to bottom
            • Bowl: a D-shaped arch on the upper right (closes at midline)
            • Leg: drops from midline, kicks at ~40° upward to the right
              (the angled terminal evokes an upward trend/arrow)
        */}
        <path
          d={`
            M 28 20
            L 28 80
            L 40 80
            L 40 56
            L 56.5 56
            L 69 78
            L 82 78
            L 68 54
            C 74 51 78 44 78 36
            C 78 26 70 20 59 20
            Z
            M 40 30
            L 57 30
            C 63 30 67 33 67 37
            C 67 42 63 46 57 46
            L 40 46
            Z
          `}
          fill={markFill}
          fillRule="evenodd"
        />
      </svg>

      {/* ── Optional wordmark ── */}
      {wordmark && (
        <span
          style={{
            fontSize,
            fontFamily: "var(--font-inter), system-ui, sans-serif",
            fontWeight: 500,
            letterSpacing: "-0.3px",
            color: "inherit",
            lineHeight: 1,
          }}
        >
          {wordmarkText}
        </span>
      )}
    </span>
  );
}

/**
 * A standalone SVG string you can embed in HTML, emails, etc.
 * Paste this anywhere — no React required.
 */
export const LOGO_SVG = `<svg width="100" height="100" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
  <rect width="100" height="100" rx="22" fill="#0f2d5a"/>
  <path fill-rule="evenodd" d="M28 20L28 80L40 80L40 56L56.5 56L69 78L82 78L68 54C74 51 78 44 78 36C78 26 70 20 59 20ZM40 30L57 30C63 30 67 33 67 37C67 42 63 46 57 46L40 46Z" fill="white"/>
</svg>`;
