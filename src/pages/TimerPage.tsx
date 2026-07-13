import { useEffect, useMemo, useState } from "react";
import { Bell, Maximize2, Pause, Play, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs } from "@/components/ui/tabs";
import { cn } from "@/utils/cn";

type Mode = "rest" | "free" | "pomodoro" | "rounds";

const presets = [30, 45, 60, 90, 120, 180];

function formatTime(totalSeconds: number) {
  const minutes = Math.floor(totalSeconds / 60).toString().padStart(2, "0");
  const seconds = (totalSeconds % 60).toString().padStart(2, "0");
  return `${minutes}:${seconds}`;
}

function playBeep() {
  const browserWindow = window as Window & { webkitAudioContext?: typeof AudioContext };
  const AudioContextClass = AudioContext || browserWindow.webkitAudioContext;
  if (!AudioContextClass) return;

  const audio = new AudioContextClass();
  const oscillator = audio.createOscillator();
  const gain = audio.createGain();

  oscillator.type = "sine";
  oscillator.frequency.value = 880;
  gain.gain.setValueAtTime(0.001, audio.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.35, audio.currentTime + 0.02);
  gain.gain.exponentialRampToValueAtTime(0.001, audio.currentTime + 0.35);
  oscillator.connect(gain);
  gain.connect(audio.destination);
  oscillator.start();
  oscillator.stop(audio.currentTime + 0.38);
}

export function TimerPage() {
  const [mode, setMode] = useState<Mode>("rest");
  const [seconds, setSeconds] = useState(90);
  const [running, setRunning] = useState(false);
  const [roundTotalMinutes, setRoundTotalMinutes] = useState(10);
  const [roundIntervalSeconds, setRoundIntervalSeconds] = useState(60);

  const roundTotalSeconds = roundTotalMinutes * 60;

  useEffect(() => {
    if (!running) return;

    const id = window.setInterval(() => {
      setSeconds((value) => {
        if (mode === "free") return value + 1;

        if (mode === "rounds") {
          const next = Math.min(value + 1, roundTotalSeconds);
          if (next > 0 && (next % roundIntervalSeconds === 0 || next === roundTotalSeconds)) playBeep();
          if (next >= roundTotalSeconds) setRunning(false);
          return next;
        }

        const next = Math.max(0, value - 1);
        if (next === 0) {
          playBeep();
          setRunning(false);
        }
        return next;
      });
    }, 1000);

    return () => window.clearInterval(id);
  }, [mode, roundIntervalSeconds, roundTotalSeconds, running]);

  const label = useMemo(() => formatTime(seconds), [seconds]);
  const roundLabel = useMemo(() => `${formatTime(seconds)} / ${formatTime(roundTotalSeconds)}`, [roundTotalSeconds, seconds]);
  const currentRound = Math.max(1, Math.floor(seconds / roundIntervalSeconds) + 1);

  function switchMode(value: Mode) {
    setRunning(false);
    setMode(value);
    setSeconds(value === "pomodoro" ? 25 * 60 : value === "free" || value === "rounds" ? 0 : 90);
  }

  function resetTimer() {
    setRunning(false);
    setSeconds(mode === "pomodoro" ? 25 * 60 : mode === "free" || mode === "rounds" ? 0 : 90);
  }

  function openFullscreen() {
    const target = document.documentElement;
    if (document.fullscreenElement) void document.exitFullscreen();
    else void target.requestFullscreen?.();
  }

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm font-semibold text-primary">Cronômetro</p>
        <h1 className="text-3xl font-black tracking-normal">Timer de treino</h1>
      </div>
      <Card>
        <CardHeader className="flex-col xl:flex-row">
          <CardTitle>Descanso, livre, Pomodoro e rounds</CardTitle>
          <Tabs
            className="w-full xl:w-auto"
            value={mode}
            onChange={switchMode}
            items={[
              { value: "rest", label: "Descanso" },
              { value: "free", label: "Livre" },
              { value: "pomodoro", label: "Pomodoro" },
              { value: "rounds", label: "Rounds" }
            ]}
          />
        </CardHeader>
        <CardContent className="space-y-6">
          <div className={cn("flex min-h-64 flex-col items-center justify-center rounded-lg border border-secondary/20 bg-black/35 transition-shadow duration-500 sm:aspect-[16/7]", running && "shadow-[inset_0_0_55px_hsl(var(--secondary)/0.06),0_0_35px_hsl(var(--primary)/0.08)]")}>
            <span
              className={cn(
                "bg-gradient-to-r from-secondary via-foreground to-primary bg-clip-text font-black tracking-normal text-transparent",
                mode === "rounds" ? "text-4xl sm:text-6xl lg:text-8xl" : "text-6xl sm:text-8xl",
                running && "motion-safe:animate-soft-pulse"
              )}
            >
              {mode === "rounds" ? roundLabel : label}
            </span>
            {mode === "rounds" && <span className="mt-3 text-sm font-semibold text-muted-foreground">Round {currentRound}</span>}
          </div>

          {mode === "rounds" ? (
            <div className="grid gap-3 sm:grid-cols-2">
              <label className="space-y-1 text-sm">
                <span className="text-muted-foreground">Duração total</span>
                <div className="flex items-center gap-2">
                  <input
                    className="h-10 w-full rounded-md border bg-background px-3"
                    inputMode="numeric"
                    value={roundTotalMinutes}
                    onChange={(event) => {
                      setRunning(false);
                      setSeconds(0);
                      setRoundTotalMinutes(Math.max(1, Number(event.target.value) || 1));
                    }}
                  />
                  <span className="text-sm text-muted-foreground">min</span>
                </div>
              </label>
              <label className="space-y-1 text-sm">
                <span className="text-muted-foreground">Alarme a cada</span>
                <div className="flex items-center gap-2">
                  <input
                    className="h-10 w-full rounded-md border bg-background px-3"
                    inputMode="numeric"
                    value={roundIntervalSeconds}
                    onChange={(event) => {
                      setRunning(false);
                      setSeconds(0);
                      setRoundIntervalSeconds(Math.max(5, Number(event.target.value) || 60));
                    }}
                  />
                  <span className="text-sm text-muted-foreground">s</span>
                </div>
              </label>
            </div>
          ) : (
            <div className="flex flex-wrap gap-2">
              {presets.map((preset) => (
                <Button key={preset} variant="outline" onClick={() => setSeconds(preset)} type="button">
                  {preset}s
                </Button>
              ))}
            </div>
          )}

          <div className="flex flex-wrap gap-2">
            <Button onClick={() => setRunning((value) => !value)} type="button">
              {running ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
              {running ? "Pausar" : "Iniciar"}
            </Button>
            <Button variant="outline" onClick={resetTimer} type="button">
              <RotateCcw className="h-4 w-4" />
              Resetar
            </Button>
            <Button variant="secondary" onClick={playBeep} type="button">
              <Bell className="h-4 w-4" />
              Alarme
            </Button>
            <Button variant="ghost" onClick={openFullscreen} type="button">
              <Maximize2 className="h-4 w-4" />
              Tela cheia
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
