import { Navigate, Route, Routes } from "react-router-dom";
import { AppLayout } from "@/layouts/AppLayout";
import { DashboardPage } from "@/pages/DashboardPage";
import { CalendarPage } from "@/pages/CalendarPage";
import { WorkoutsPage } from "@/pages/WorkoutsPage";
import { TimerPage } from "@/pages/TimerPage";
import { WeightPage } from "@/pages/WeightPage";
import { SettingsPage } from "@/pages/SettingsPage";

export function App() {
  return (
    <div className="dark min-h-screen bg-background">
      <Routes>
        <Route element={<AppLayout />}>
          <Route index element={<DashboardPage />} />
          <Route path="calendar" element={<CalendarPage />} />
          <Route path="workouts" element={<WorkoutsPage />} />
          <Route path="weight" element={<WeightPage />} />
          <Route path="timer" element={<TimerPage />} />
          <Route path="settings" element={<SettingsPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </div>
  );
}
