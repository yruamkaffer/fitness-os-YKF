import { cn } from "@/utils/cn";

interface PageLoadingStateProps {
  cards?: number;
  className?: string;
}

export function PageLoadingState({ cards = 4, className }: PageLoadingStateProps) {
  return (
    <div className={cn("space-y-6", className)} role="status" aria-live="polite" aria-label="Carregando seus dados">
      <div className="space-y-3">
        <div className="skeleton h-4 w-24 rounded-md" />
        <div className="skeleton h-10 w-full max-w-sm rounded-md" />
        <div className="skeleton h-4 w-full max-w-xl rounded-md" />
      </div>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: cards }, (_, index) => (
          <div key={index} className="rounded-lg border border-border/70 bg-card/80 p-5 shadow-glow">
            <div className="skeleton h-4 w-24 rounded-md" />
            <div className="skeleton mt-5 h-8 w-20 rounded-md" />
            <div className="skeleton mt-3 h-3 w-32 rounded-md" />
          </div>
        ))}
      </div>
      <div className="rounded-lg border border-border/70 bg-card/80 p-5 shadow-glow">
        <div className="skeleton h-5 w-40 rounded-md" />
        <div className="skeleton mt-5 h-56 w-full rounded-md" />
      </div>
      <span className="sr-only">Carregando seus registros...</span>
    </div>
  );
}
