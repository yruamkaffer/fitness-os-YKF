import { Blocks, Database, Plus, ShieldCheck } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface ModulePageProps {
  module: string;
}

export function ModulePage({ module }: ModulePageProps) {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-semibold text-primary">Módulo independente</p>
          <h1 className="text-3xl font-black tracking-normal">{module}</h1>
          <p className="mt-2 max-w-2xl text-muted-foreground">
            Área preparada para evoluir com formulários, histórico, gráficos, exportação e sincronização via Supabase.
          </p>
        </div>
        <Button>
          <Plus className="h-4 w-4" />
          Novo registro
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {[
          { icon: Blocks, title: "Componentizado", text: "Cada módulo tem página, serviços, modelos e widgets próprios." },
          { icon: Database, title: "Persistência pronta", text: "Camada preparada para Supabase, cache local e modo offline." },
          { icon: ShieldCheck, title: "Escalável", text: "Sem acoplamento com o dashboard principal." }
        ].map((item) => (
          <Card key={item.title}>
            <CardHeader>
              <item.icon className="h-5 w-5 text-primary" />
              <CardTitle>{item.title}</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">{item.text}</CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
