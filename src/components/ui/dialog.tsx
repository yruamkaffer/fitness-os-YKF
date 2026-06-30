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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
      <div className={cn("max-h-[88vh] w-full max-w-2xl overflow-auto rounded-lg border bg-card shadow-glow", className)}>
        <div className="sticky top-0 z-10 flex items-center justify-between border-b bg-card/95 p-4 backdrop-blur">
          <h2 className="text-lg font-semibold">{title}</h2>
          <Button aria-label="Fechar" variant="ghost" size="icon" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>
        <div className="p-5">{children}</div>
      </div>
    </div>
  );
}
