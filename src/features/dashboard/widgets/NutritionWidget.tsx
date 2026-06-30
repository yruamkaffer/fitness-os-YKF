import { Apple, Droplets } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import type { NutritionDay } from "@/types/fitness";

interface NutritionWidgetProps {
  nutrition: NutritionDay;
  proteinGoal: number;
  water: number;
}

export function NutritionWidget({ nutrition, proteinGoal, water }: NutritionWidgetProps) {
  const macros = [
    { label: "Proteína", value: nutrition.protein, goal: proteinGoal, unit: "g" },
    { label: "Carboidratos", value: nutrition.carbs, goal: 240, unit: "g" },
    { label: "Gorduras", value: nutrition.fats, goal: 70, unit: "g" }
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Apple className="h-5 w-5 text-primary" />
          Resumo nutricional
        </CardTitle>
        <p className="text-sm text-muted-foreground">{nutrition.calories} kcal registradas</p>
      </CardHeader>
      <CardContent className="space-y-4">
        {macros.map((macro) => (
          <div key={macro.label} className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>{macro.label}</span>
              <span className="text-muted-foreground">
                {macro.value}/{macro.goal}{macro.unit}
              </span>
            </div>
            <Progress value={(macro.value / macro.goal) * 100} />
          </div>
        ))}
        <div className="rounded-md border bg-muted/30 p-3">
          <div className="flex items-center gap-2 text-sm font-semibold">
            <Droplets className="h-4 w-4 text-secondary" />
            Água: {water.toFixed(1).replace(".", ",")}L / {nutrition.waterGoal.toFixed(1).replace(".", ",")}L
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
