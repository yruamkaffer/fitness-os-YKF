import { NavLink, Outlet } from "react-router-dom";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { CheckCircle2, Dumbbell, Menu, Moon, Search, Sun, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { navigation } from "@/constants/navigation";
import { useFitnessOverview } from "@/hooks/useFitnessOverview";
import { cn } from "@/utils/cn";
import { isWorkoutDay } from "@/utils/stats";

export function AppLayout() {
  const { data, today, markTodayTrained } = useFitnessOverview();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [theme, setTheme] = useState<"dark" | "light">(() => {
    if (typeof window === "undefined") return "dark";
    return window.localStorage.getItem("fitness-os:theme") === "light" ? "light" : "dark";
  });
  const trainedToday = data.entries.some((entry) => entry.date === today && isWorkoutDay(entry));

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
    window.localStorage.setItem("fitness-os:theme", theme);
  }, [theme]);

  function toggleTheme() {
    setTheme((current) => (current === "dark" ? "light" : "dark"));
  }

  function markTodayAndCloseMenu() {
    markTodayTrained();
    setMobileMenuOpen(false);
  }

  return (
    <div className="min-h-screen text-foreground">
      <div className="pointer-events-none fixed inset-x-0 top-0 z-[60] h-px bg-gradient-to-r from-transparent via-primary/80 to-secondary/80" />
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 border-r border-white/10 bg-[#09090d]/95 backdrop-blur-xl lg:block">
        <div className="flex h-full flex-col">
          <div className="border-b p-5">
            <div className="group flex items-center gap-3">
              <img className="h-11 w-11 rounded-lg border border-white/10 object-cover shadow-primary-glow transition duration-300 group-hover:scale-105 group-hover:border-primary/50" src="/fitness-os-logo.png" alt="Logo do Fitness OS" />
              <div>
                <p className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-lg font-black tracking-normal text-transparent">FITNESS OS</p>
                <p className="text-xs text-muted-foreground">Treino e evolução</p>
              </div>
            </div>
          </div>
          <nav className="flex-1 space-y-1 overflow-y-auto p-3">
            {navigation.map((item) => (
              <NavLink
                key={item.href}
                to={item.href}
                end={item.href === "/"}
                className={({ isActive }) =>
                  cn(
                    "flex h-10 items-center gap-3 rounded-md px-3 text-sm font-medium text-muted-foreground transition duration-200 hover:translate-x-0.5 hover:bg-muted hover:text-foreground",
                    isActive && "bg-primary/10 text-primary shadow-[inset_3px_0_0_hsl(var(--primary))]"
                  )
                }
              >
                <item.icon className="h-4 w-4" />
                {item.label}
              </NavLink>
            ))}
          </nav>
          <div className="border-t p-3">
            <Button className={cn("w-full", trainedToday && "motion-safe:animate-pulse")} onClick={markTodayTrained} type="button">
              {trainedToday ? <CheckCircle2 className="h-4 w-4" /> : <Dumbbell className="h-4 w-4" />}
              {trainedToday ? "Treino salvo" : "Treinei hoje"}
            </Button>
          </div>
        </div>
      </aside>

      <div className="lg:pl-64">
        <header className="sticky top-0 z-20 border-b border-white/10 bg-background/80 px-4 py-3 backdrop-blur-xl sm:px-6">
          <div className="flex items-center gap-3">
            <Button aria-label="Menu" variant="ghost" size="icon" className="lg:hidden" onClick={() => setMobileMenuOpen(true)} type="button">
              <Menu className="h-5 w-5" />
            </Button>
            <div className="hidden min-w-0 flex-1 items-center gap-3 rounded-md border bg-card/70 px-3 py-2 text-sm text-muted-foreground transition hover:border-secondary/35 md:flex">
              <Search className="h-4 w-4" />
              Buscar treino, peso ou cardio
            </div>
            <div className="ml-auto flex items-center gap-2">
              <Button aria-label="Alternar tema" variant="ghost" size="icon" onClick={toggleTheme} type="button">
                {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
              </Button>
              <Button className={cn("hidden sm:inline-flex", trainedToday && "motion-safe:animate-pulse")} onClick={markTodayTrained} type="button">
                {trainedToday ? <CheckCircle2 className="h-4 w-4" /> : <Dumbbell className="h-4 w-4" />}
                {trainedToday ? "Salvo" : "Treinei hoje"}
              </Button>
            </div>
          </div>
        </header>

        <motion.main
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          className="mx-auto w-full max-w-[1400px] px-4 pb-28 pt-6 sm:px-6 lg:py-8"
        >
          <Outlet />
        </motion.main>
      </div>

      {mobileMenuOpen && (
        <motion.div initial={{ opacity: 0, x: -18 }} animate={{ opacity: 1, x: 0 }} className="fixed inset-0 z-50 bg-background/95 backdrop-blur-xl lg:hidden">
          <div className="flex items-center justify-between border-b px-4 py-3">
            <div className="flex items-center gap-3">
              <img className="h-10 w-10 rounded-lg border border-white/10 object-cover shadow-primary-glow" src="/fitness-os-logo.png" alt="Logo do Fitness OS" />
              <div>
                <p className="bg-gradient-to-r from-primary to-secondary bg-clip-text font-black tracking-normal text-transparent">FITNESS OS</p>
                <p className="text-xs text-muted-foreground">Treino e evolução</p>
              </div>
            </div>
            <Button aria-label="Fechar menu" variant="ghost" size="icon" onClick={() => setMobileMenuOpen(false)} type="button">
              <X className="h-5 w-5" />
            </Button>
          </div>
          <nav className="space-y-1 p-3">
            {navigation.map((item) => (
              <NavLink
                key={item.href}
                to={item.href}
                end={item.href === "/"}
                onClick={() => setMobileMenuOpen(false)}
                className={({ isActive }) =>
                  cn(
                    "flex h-12 items-center gap-3 rounded-md px-3 text-sm font-medium text-muted-foreground transition hover:bg-muted hover:text-foreground",
                    isActive && "bg-primary/10 text-primary shadow-[inset_3px_0_0_hsl(var(--primary))]"
                  )
                }
              >
                <item.icon className="h-4 w-4" />
                {item.label}
              </NavLink>
            ))}
          </nav>
          <div className="border-t p-3">
            <Button className={cn("w-full", trainedToday && "motion-safe:animate-pulse")} onClick={markTodayAndCloseMenu} type="button">
              {trainedToday ? <CheckCircle2 className="h-4 w-4" /> : <Dumbbell className="h-4 w-4" />}
              {trainedToday ? "Treino salvo" : "Treinei hoje"}
            </Button>
          </div>
        </motion.div>
      )}

      <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-white/10 bg-background/95 px-2 py-2 backdrop-blur-xl lg:hidden">
        <div className="grid grid-cols-5 gap-1">
          {navigation.slice(0, 5).map((item) => (
            <NavLink
              key={item.href}
              to={item.href}
              end={item.href === "/"}
              className={({ isActive }) =>
                cn(
                  "flex min-h-14 flex-col items-center justify-center gap-1 rounded-md text-[11px] font-medium text-muted-foreground transition active:scale-95",
                  isActive && "bg-primary/10 text-primary shadow-[inset_0_2px_0_hsl(var(--primary))]"
                )
              }
            >
              <item.icon className="h-4 w-4" />
              <span>{item.label}</span>
            </NavLink>
          ))}
        </div>
      </nav>
    </div>
  );
}
