import {
  Activity,
  Award,
  BarChart3,
  Bell,
  CalendarDays,
  Dumbbell,
  Goal,
  Home,
  PieChart,
  Scale,
  Settings,
  Timer
} from "lucide-react";

export const navigation = [
  { label: "Home", href: "/", icon: Home },
  { label: "Coach IA", href: "/coach", icon: Activity },
  { label: "Calendário", href: "/calendar", icon: CalendarDays },
  { label: "Treinos", href: "/workouts", icon: Dumbbell },
  { label: "Timer", href: "/timer", icon: Timer },
  { label: "Peso", href: "/weight", icon: Scale },
  { label: "Analytics", href: "/analytics", icon: PieChart },
  { label: "Avaliações", href: "/assessments", icon: BarChart3 },
  { label: "Cardio", href: "/cardio", icon: Activity },
  { label: "Conquistas", href: "/achievements", icon: Award },
  { label: "Metas", href: "/goals", icon: Goal },
  { label: "Notificações", href: "/notifications", icon: Bell },
  { label: "Configurações", href: "/settings", icon: Settings }
] as const;
