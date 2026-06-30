import { NavLink, Outlet } from "react-router-dom";
import { motion } from "framer-motion";
import { Bell, CheckCircle2, Dumbbell, Menu, Moon, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { navigation } from "@/constants/navigation";
import { useFitnessOverview } from "@/hooks/useFitnessOverview";
import { cn } from "@/utils/cn";
import { isWorkoutDay } from "@/utils/stats";

export function AppLayout() {
  const { data, today, markTodayTrained } = useFitnessOverview();
  const trainedToday = data.entries.some((entry) => entry.date === today && isWorkoutDay(entry));

  return (
    <div className="min-h-screen text-foreground">
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-72 border-r bg-background/88 backdrop-blur-xl lg:block">
        <div className="flex h-full flex-col">
          <div className="border-b p-5">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                <Dumbbell className="h-5 w-5" />
              </div>
              <div>
                <p className="text-lg font-black tracking-normal">FITNESS OS</p>
                <p className="text-xs text-muted-foreground">Personal evolution system</p>
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
                    "flex h-10 items-center gap-3 rounded-md px-3 text-sm font-medium text-muted-foreground transition hover:bg-muted hover:text-foreground",
                    isActive && "bg-muted text-foreground"
                  )
                }
              >
                <item.icon className="h-4 w-4" />
                {item.label}
              </NavLink>
            ))}
          </nav>
          <div className="border-t p-3">
            <Button className="w-full" onClick={markTodayTrained}>
              {trainedToday ? <CheckCircle2 className="h-4 w-4" /> : <Dumbbell className="h-4 w-4" />}
              {trainedToday ? "Treino salvo" : "Treinei hoje"}
            </Button>
          </div>
        </div>
      </aside>

      <div className="lg:pl-72">
        <header className="sticky top-0 z-20 border-b bg-background/80 px-4 py-3 backdrop-blur-xl sm:px-6">
          <div className="flex items-center gap-3">
            <Button aria-label="Menu" variant="ghost" size="icon" className="lg:hidden">
              <Menu className="h-5 w-5" />
            </Button>
            <div className="hidden min-w-0 flex-1 items-center gap-3 rounded-md border bg-card px-3 py-2 text-sm text-muted-foreground md:flex">
              <Search className="h-4 w-4" />
              Buscar treino, peso, cardio ou meta
            </div>
            <div className="ml-auto flex items-center gap-2">
              <Button aria-label="Alternar tema" variant="ghost" size="icon">
                <Moon className="h-4 w-4" />
              </Button>
              <Button aria-label="Notificações" variant="ghost" size="icon">
                <Bell className="h-4 w-4" />
              </Button>
              <Button className="hidden sm:inline-flex" onClick={markTodayTrained}>
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
          className="mx-auto w-full max-w-[1500px] px-4 py-6 sm:px-6 lg:py-8"
        >
          <Outlet />
        </motion.main>
      </div>
    </div>
  );
}
