import { CalendarDays, Dumbbell, Home, Scale, Settings, Timer } from "lucide-react";

export const navigation = [
  { label: "Home", href: "/", icon: Home },
  { label: "Calendário", href: "/calendar", icon: CalendarDays },
  { label: "Treinos", href: "/workouts", icon: Dumbbell },
  { label: "Peso", href: "/weight", icon: Scale },
  { label: "Timer", href: "/timer", icon: Timer },
  { label: "Configurações", href: "/settings", icon: Settings }
] as const;
