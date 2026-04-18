"use client";

import Link from "next/link";
import { Sparkles, UserPlus, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

interface SaveModalProps {
  open: boolean;
  onClose: () => void;
  onContinue: () => void;
}

const savePerks = [
  "Save & access all your invoices",
  "Track payment status (Paid / Unpaid)",
  "Monthly earnings & tax reports",
];

export function SaveModal({ open, onClose, onContinue }: SaveModalProps) {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-sm" id="save-modal">
        <DialogHeader>
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-100 to-indigo-100 dark:from-violet-950/60 dark:to-indigo-950/60 ring-4 ring-violet-50 dark:ring-violet-950/30">
            <Sparkles className="h-6 w-6 text-violet-600 dark:text-violet-400" />
          </div>
          <DialogTitle className="text-center text-lg font-bold">
            Want to save this invoice?
          </DialogTitle>
          <DialogDescription className="text-center text-sm mt-1.5">
            Sign up free to save invoices and track payments.
          </DialogDescription>
        </DialogHeader>

        {/* Perks */}
        <div className="rounded-xl bg-slate-50 dark:bg-white/[0.03] border border-slate-100 dark:border-white/[0.06] p-4 space-y-2.5 my-1">
          {savePerks.map((p) => (
            <div key={p} className="flex items-center gap-2.5 text-sm text-slate-700 dark:text-slate-300">
              <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
              {p}
            </div>
          ))}
        </div>

        <div className="flex flex-col gap-2.5">
          <Link href="/login" className="w-full" id="signup-from-modal-btn">
            <Button size="lg" className="w-full shadow-lg shadow-violet-500/20" onClick={onClose}>
              <UserPlus className="mr-2 h-4 w-4" />
              Sign up to save & manage
            </Button>
          </Link>
          <Button
            variant="ghost"
            size="sm"
            className="w-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
            onClick={onContinue}
            id="continue-without-saving-btn"
          >
            Continue without saving
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
