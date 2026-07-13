export const theme = {
  chart: {
    primary: "#ff3d9f",
    teal: "#7ddcff",
    coral: "#9d6cff",
    muted: "#71717a"
  },
  heatmap: {
    none: "bg-zinc-800/90",
    workout: "bg-primary shadow-[0_0_10px_hsl(var(--primary)/0.35)]",
    cardio: "bg-secondary shadow-[0_0_10px_hsl(var(--secondary)/0.3)]",
    both: "bg-accent shadow-[0_0_10px_hsl(var(--accent)/0.35)]",
    rest: "bg-zinc-500"
  }
} as const;
