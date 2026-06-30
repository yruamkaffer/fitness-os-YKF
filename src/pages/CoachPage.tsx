import { subDays } from "date-fns";
import { Bot, CheckCircle2, Sparkles } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useFitnessOverview } from "@/hooks/useFitnessOverview";
import { generateDailyCoachReport } from "@/services/coach.service";
import { computeCurrentStreak } from "@/utils/stats";

export function CoachPage() {
  const { data, today } = useFitnessOverview();
  if (!data) return null;

  const todayEntry = data.entries.find((entry) => entry.date === today);
  const yesterdayDate = subDays(new Date(`${today}T12:00:00`), 1).toISOString().slice(0, 10);
  const yesterday = data.entries.find((entry) => entry.date === yesterdayDate);
  const workout = data.workoutPlan.find((plan) => plan.weekday === new Date(`${today}T12:00:00`).getDay());
  const report = generateDailyCoachReport({
    profile: data.profile,
    today: todayEntry,
    yesterday,
    workout,
    streak: computeCurrentStreak(data.entries),
    entriesCount: data.entries.length
  });

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm font-semibold text-primary">Coach IA</p>
        <h1 className="text-3xl font-black tracking-normal">Relatório inteligente diário</h1>
      </div>
      <Card className="border-primary/30">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bot className="h-5 w-5 text-primary" />
            Bom dia, {data.profile.name}
          </CardTitle>
          <Badge className="border-primary/30 text-primary">
            <Sparkles className="mr-1 h-3 w-3" />
            Baseado nos seus registros
          </Badge>
        </CardHeader>
        <CardContent>
          <p className="text-lg leading-8">{report}</p>
        </CardContent>
      </Card>
      <div className="grid gap-4 md:grid-cols-3">
        {["Progressão de carga", "Consistência", "Registro de peso"].map((item) => (
          <Card key={item}>
            <CardContent className="flex items-center gap-3 p-5">
              <CheckCircle2 className="h-5 w-5 text-primary" />
              <span className="font-semibold">{item}</span>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
