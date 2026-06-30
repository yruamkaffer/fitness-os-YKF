import { Bot, Sparkles } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface CoachCardProps {
  report: string;
}

export function CoachCard({ report }: CoachCardProps) {
  return (
    <Card className="border-primary/30 bg-gradient-to-br from-card via-card to-primary/10">
      <CardHeader>
        <div>
          <CardTitle className="flex items-center gap-2">
            <Bot className="h-5 w-5 text-primary" />
            Coach IA
          </CardTitle>
          <p className="mt-1 text-sm text-muted-foreground">Relatório automático diário</p>
        </div>
        <Badge className="border-primary/30 text-primary">
          <Sparkles className="mr-1 h-3 w-3" />
          Inteligente
        </Badge>
      </CardHeader>
      <CardContent>
        <p className="text-sm leading-7 text-foreground/90">{report}</p>
      </CardContent>
    </Card>
  );
}
