"use client";

import { useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Zap, Mail, Phone, ArrowRight, Loader2, Eye, EyeOff, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { ThemeToggle } from "@/components/ThemeToggle";

/* ─── Schemas ─── */
const emailSchema = z.object({
  email: z.string().email("Enter a valid email"),
  password: z.string().min(8, "Min 8 characters"),
});
const signupSchema = z.object({
  name: z.string().min(2, "At least 2 characters"),
  email: z.string().email("Enter a valid email"),
  password: z.string().min(8, "Min 8 characters"),
});
const otpSchema = z.object({
  phone: z.string().regex(/^[6-9]\d{9}$/, "Valid 10-digit Indian number"),
});

type EmailValues = z.infer<typeof emailSchema>;
type SignupValues = z.infer<typeof signupSchema>;
type OtpValues = z.infer<typeof otpSchema>;

function FieldError({ msg }: { msg?: string }) {
  if (!msg) return null;
  return <p className="text-[11px] font-medium text-red-500 mt-1">{msg}</p>;
}

function SuccessState({ title, desc }: { title: string; desc: string }) {
  return (
    <div className="py-8 text-center">
      <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-100 dark:bg-emerald-950/50 ring-4 ring-emerald-50 dark:ring-emerald-950/30">
        <CheckCircle2 className="h-7 w-7 text-emerald-600 dark:text-emerald-400" />
      </div>
      <h3 className="font-bold text-slate-900 dark:text-white text-lg">{title}</h3>
      <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">{desc}</p>
      <Link href="/dashboard">
        <Button className="mt-5 w-full shadow-lg shadow-violet-500/20" id="goto-dashboard-btn">
          Open Dashboard <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </Link>
    </div>
  );
}

/* ─── Login ─── */
function LoginForm() {
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const { register, handleSubmit, formState: { errors } } =
    useForm<EmailValues>({ resolver: zodResolver(emailSchema) });

  if (done) return <SuccessState title="Welcome back!" desc="Taking you to your dashboard…" />;

  return (
    <form onSubmit={handleSubmit(async () => { setLoading(true); await new Promise(r => setTimeout(r, 700)); setLoading(false); setDone(true); })} className="space-y-4" id="login-form">
      <div>
        <Label htmlFor="login-email" className="mb-1.5 block">Email</Label>
        <Input id="login-email" type="email" placeholder="you@example.com" {...register("email")} className={errors.email ? "border-red-400" : ""} />
        <FieldError msg={errors.email?.message} />
      </div>
      <div>
        <Label htmlFor="login-password" className="mb-1.5 block">Password</Label>
        <div className="relative">
          <Input id="login-password" type={showPw ? "text" : "password"} placeholder="••••••••" className={`pr-11 ${errors.password ? "border-red-400" : ""}`} {...register("password")} />
          <button type="button" onClick={() => setShowPw(v => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300" aria-label="Toggle password">
            {showPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        </div>
        <FieldError msg={errors.password?.message} />
        <div className="text-right mt-1.5">
          <button type="button" className="text-xs text-violet-600 hover:underline dark:text-violet-400">Forgot password?</button>
        </div>
      </div>
      <Button type="submit" size="lg" className="w-full shadow-lg shadow-violet-500/20" disabled={loading} id="login-submit-btn">
        {loading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Signing in…</> : <>Sign in <ArrowRight className="ml-2 h-4 w-4" /></>}
      </Button>
    </form>
  );
}

/* ─── Signup ─── */
function SignupForm() {
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const { register, handleSubmit, formState: { errors } } =
    useForm<SignupValues>({ resolver: zodResolver(signupSchema) });

  if (done) return <SuccessState title="Account created!" desc="Welcome to RefineSplit 🎉" />;

  return (
    <form onSubmit={handleSubmit(async () => { setLoading(true); await new Promise(r => setTimeout(r, 700)); setLoading(false); setDone(true); })} className="space-y-4" id="signup-form">
      <div>
        <Label htmlFor="signup-name" className="mb-1.5 block">Full name</Label>
        <Input id="signup-name" placeholder="Rahul Sharma" {...register("name")} className={errors.name ? "border-red-400" : ""} />
        <FieldError msg={errors.name?.message} />
      </div>
      <div>
        <Label htmlFor="signup-email" className="mb-1.5 block">Email</Label>
        <Input id="signup-email" type="email" placeholder="you@example.com" {...register("email")} className={errors.email ? "border-red-400" : ""} />
        <FieldError msg={errors.email?.message} />
      </div>
      <div>
        <Label htmlFor="signup-password" className="mb-1.5 block">Password</Label>
        <div className="relative">
          <Input id="signup-password" type={showPw ? "text" : "password"} placeholder="Min. 8 characters" className={`pr-11 ${errors.password ? "border-red-400" : ""}`} {...register("password")} />
          <button type="button" onClick={() => setShowPw(v => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300" aria-label="Toggle password">
            {showPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        </div>
        <FieldError msg={errors.password?.message} />
      </div>
      <Button type="submit" size="lg" className="w-full shadow-lg shadow-violet-500/20" disabled={loading} id="signup-submit-btn">
        {loading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Creating account…</> : <>Create free account <ArrowRight className="ml-2 h-4 w-4" /></>}
      </Button>
      <p className="text-center text-[11px] text-slate-400 dark:text-slate-500">
        By signing up you agree to our{" "}
        <button type="button" className="text-violet-600 dark:text-violet-400 hover:underline">Terms</button> &amp;{" "}
        <button type="button" className="text-violet-600 dark:text-violet-400 hover:underline">Privacy Policy</button>
      </p>
    </form>
  );
}

/* ─── OTP ─── */
function OtpForm() {
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const { register, handleSubmit, formState: { errors } } =
    useForm<OtpValues>({ resolver: zodResolver(otpSchema) });

  const handleOtpChange = (i: number, v: string) => {
    if (!/^\d*$/.test(v)) return;
    const next = [...otp]; next[i] = v.slice(-1); setOtp(next);
    if (v && i < 5) document.getElementById(`otp-${i + 1}`)?.focus();
  };

  if (done) return <SuccessState title="Verified!" desc="Welcome to RefineSplit 🎉" />;

  return (
    <div id="otp-form" className="space-y-4">
      {!otpSent ? (
        <form onSubmit={handleSubmit(async () => { setLoading(true); await new Promise(r => setTimeout(r, 600)); setLoading(false); setOtpSent(true); })} className="space-y-4">
          <div>
            <Label htmlFor="otp-phone" className="mb-1.5 block">Mobile number</Label>
            <div className="flex gap-2">
              <div className="flex h-12 w-20 shrink-0 items-center justify-center rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 text-sm font-semibold text-slate-600 dark:text-slate-300">🇮🇳 +91</div>
              <Input id="otp-phone" placeholder="10-digit number" maxLength={10} className={`flex-1 ${errors.phone ? "border-red-400" : ""}`} {...register("phone")} />
            </div>
            <FieldError msg={errors.phone?.message} />
          </div>
          <Button type="submit" size="lg" className="w-full shadow-lg shadow-violet-500/20" disabled={loading} id="send-otp-btn">
            {loading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Sending OTP…</> : <>Send OTP <Phone className="ml-2 h-4 w-4" /></>}
          </Button>
        </form>
      ) : (
        <div className="space-y-5">
          <div className="rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-100 dark:border-emerald-900/30 p-3 text-center">
            <p className="text-xs font-semibold text-emerald-700 dark:text-emerald-400">OTP sent! Use <strong>123456</strong> to verify (demo)</p>
          </div>
          <div className="text-center">
            <Label className="mb-3 block text-sm">Enter 6-digit OTP</Label>
            <div className="flex justify-center gap-2">
              {otp.map((digit, i) => (
                <input
                  key={i} id={`otp-${i}`} type="text" inputMode="numeric" maxLength={1} value={digit}
                  onChange={(e) => handleOtpChange(i, e.target.value)}
                  className="h-12 w-10 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-center text-lg font-bold text-slate-900 dark:text-white shadow-sm focus:border-violet-500 focus:outline-none focus:ring-2 focus:ring-violet-400/20 transition-all"
                  aria-label={`OTP digit ${i + 1}`}
                />
              ))}
            </div>
          </div>
          <Button size="lg" className="w-full" disabled={loading || otp.join("").length < 6} onClick={async () => { setLoading(true); await new Promise(r => setTimeout(r, 700)); setLoading(false); setDone(true); }} id="verify-otp-btn">
            {loading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Verifying…</> : <>Verify &amp; Continue <ArrowRight className="ml-2 h-4 w-4" /></>}
          </Button>
          <button type="button" onClick={() => setOtpSent(false)} className="w-full text-center text-xs text-slate-400 hover:text-violet-600 dark:hover:text-violet-400 transition-colors">← Change number</button>
        </div>
      )}
    </div>
  );
}

/* ─── Page ─── */
export default function LoginPage() {
  return (
    <div className="relative min-h-screen bg-slate-50 dark:bg-[#0a0f1e] flex items-center justify-center px-4 py-12 overflow-hidden">
      {/* Ambient glow */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 h-[500px] w-[600px] rounded-full bg-gradient-to-b from-violet-400/15 to-transparent blur-[100px] dark:from-violet-700/20" />
      </div>

      {/* Theme toggle — top right */}
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>

      <div className="relative w-full max-w-[400px]">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2.5 group">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-violet-600 to-indigo-600 shadow-lg shadow-violet-500/30 transition-transform group-hover:scale-105">
              <Zap className="h-5 w-5 text-white fill-white" />
            </div>
            <span className="text-xl font-bold text-slate-900 dark:text-white">
              Refine<span className="text-violet-600">Split</span>
            </span>
          </Link>
          <p className="mt-2.5 text-sm text-slate-500 dark:text-slate-400">Your invoicing super-power</p>
        </div>

        {/* Auth card */}
        <div className="rounded-2xl border border-slate-200/60 bg-white dark:border-white/[0.06] dark:bg-slate-900 p-6 shadow-xl shadow-slate-900/8 dark:shadow-black/40">
          <Tabs defaultValue="login" id="auth-tabs">
            <TabsList className="w-full mb-6">
              <TabsTrigger value="login" className="flex-1 text-xs" id="login-tab">
                <Mail className="h-3.5 w-3.5 mr-1.5" />Login
              </TabsTrigger>
              <TabsTrigger value="signup" className="flex-1 text-xs" id="signup-tab">Sign up</TabsTrigger>
              <TabsTrigger value="otp" className="flex-1 text-xs" id="otp-tab">
                <Phone className="h-3.5 w-3.5 mr-1.5" />OTP
              </TabsTrigger>
            </TabsList>
            <TabsContent value="login">
              <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">Welcome back 👋</p>
              <LoginForm />
            </TabsContent>
            <TabsContent value="signup">
              <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">Create your free account in seconds.</p>
              <SignupForm />
            </TabsContent>
            <TabsContent value="otp">
              <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">Login with mobile — no password needed.</p>
              <OtpForm />
            </TabsContent>
          </Tabs>
        </div>

        <p className="mt-5 text-center text-sm text-slate-500 dark:text-slate-400">
          Just want to invoice?{" "}
          <Link href="/invoice" className="font-semibold text-violet-600 dark:text-violet-400 hover:underline" id="skip-to-invoice">
            Skip signup →
          </Link>
        </p>
      </div>
    </div>
  );
}
