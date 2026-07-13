import type { ReactNode } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/utils/cn";

interface DialogProps {
  open: boolean;
  title: string;
  children: ReactNode;
  onClose: () => void;
  className?: string;
}

export function Dialog({ open, title, children, onClose, className }: DialogProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm">
      <div className={cn("max-h-[88vh] w-full max-w-2xl overflow-auto rounded-lg border border-primary/20 bg-card shadow-[0_22px_80px_rgba(0,0,0,0.55),0_0_45px_hsl(var(--primary)/0.1)]", className)}>
        <div className="sticky top-0 z-10 flex items-center justify-between border-b bg-card/95 p-4 backdrop-blur">
          <h2 className="text-lg font-semibold">{title}</h2>
          <Button aria-label="Fechar" variant="ghost" size="icon" onClick={onClose} type="button">
            <X className="h-4 w-4" />
          </Button>
        </div>
        <div className="p-5">{children}</div>
      </div>
    </div>
  );
}
