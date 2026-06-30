import { Navigate, Route, Routes } from "react-router-dom";
import { AppLayout } from "@/layouts/AppLayout";
import { DashboardPage } from "@/pages/DashboardPage";
import { CoachPage } from "@/pages/CoachPage";
import { CalendarPage } from "@/pages/CalendarPage";
import { WorkoutsPage } from "@/pages/WorkoutsPage";
import { TimerPage } from "@/pages/TimerPage";
import { WeightPage } from "@/pages/WeightPage";
import { AnalyticsPage } from "@/pages/AnalyticsPage";
import { ModulePage } from "@/pages/ModulePage";

export function App() {
  return (
    <div className="dark min-h-screen bg-background">
      <Routes>
        <Route element={<AppLayout />}>
          <Route index element={<DashboardPage />} />
          <Route path="coach" element={<CoachPage />} />
          <Route path="calendar" element={<CalendarPage />} />
          <Route path="workouts" element={<WorkoutsPage />} />
          <Route path="timer" element={<TimerPage />} />
          <Route path="weight" element={<WeightPage />} />
          <Route path="analytics" element={<AnalyticsPage />} />
          <Route path="assessments" element={<ModulePage module="Avaliações" />} />
          <Route path="cardio" element={<ModulePage module="Cardio" />} />
          <Route path="achievements" element={<ModulePage module="Conquistas" />} />
          <Route path="goals" element={<ModulePage module="Metas" />} />
          <Route path="notifications" element={<ModulePage module="Notificações" />} />
          <Route path="settings" element={<ModulePage module="Configurações" />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </div>
  );
}
