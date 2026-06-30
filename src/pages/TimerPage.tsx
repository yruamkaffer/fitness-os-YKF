import { useEffect, useMemo, useState } from "react";
import { Maximize2, Pause, Play, RotateCcw, TimerReset } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs } from "@/components/ui/tabs";

type Mode = "rest" | "free" | "pomodoro";

const presets = [30, 45, 60, 90, 120, 180];

export function TimerPage() {
  const [mode, setMode] = useState<Mode>("rest");
  const [seconds, setSeconds] = useState(90);
  const [running, setRunning] = useState(false);

  useEffect(() => {
    if (!running) return;
    const id = window.setInterval(() => {
      setSeconds((value) => (mode === "free" ? value + 1 : Math.max(0, value - 1)));
    }, 1000);
    return () => window.clearInterval(id);
  }, [mode, running]);

  const label = useMemo(() => {
    const minutes = Math.floor(seconds / 60).toString().padStart(2, "0");
    const rest = (seconds % 60).toString().padStart(2, "0");
    return `${minutes}:${rest}`;
  }, [seconds]);

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm font-semibold text-primary">Cronômetro</p>
        <h1 className="text-3xl font-black tracking-normal">Timer de treino</h1>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Descanso, livre e Pomodoro</CardTitle>
          <Tabs
            value={mode}
            onChange={(value) => {
              setMode(value);
              setSeconds(value === "pomodoro" ? 25 * 60 : value === "free" ? 0 : 90);
            }}
            items={[
              { value: "rest", label: "Descanso" },
              { value: "free", label: "Livre" },
              { value: "pomodoro", label: "Pomodoro" }
            ]}
          />
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex aspect-[16/7] min-h-64 items-center justify-center rounded-lg border bg-muted/20">
            <span className="text-7xl font-black tracking-normal sm:text-8xl">{label}</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {presets.map((preset) => (
              <Button key={preset} variant="outline" onClick={() => setSeconds(preset)}>
                {preset}s
              </Button>
            ))}
          </div>
          <div className="flex flex-wrap gap-2">
            <Button onClick={() => setRunning((value) => !value)}>
              {running ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
              {running ? "Pausar" : "Iniciar"}
            </Button>
            <Button variant="outline" onClick={() => setSeconds(mode === "pomodoro" ? 25 * 60 : mode === "free" ? 0 : 90)}>
              <RotateCcw className="h-4 w-4" />
              Resetar
            </Button>
            <Button variant="secondary">
              <TimerReset className="h-4 w-4" />
              Alarme
            </Button>
            <Button variant="ghost">
              <Maximize2 className="h-4 w-4" />
              Tela cheia
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
