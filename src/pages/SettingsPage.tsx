import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function SettingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm font-semibold text-primary">Configurações</p>
        <h1 className="text-3xl font-black tracking-normal">Dados locais</h1>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Armazenamento</CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground">
          Seus registros ficam salvos no navegador deste dispositivo. Quando você quiser, este mesmo fluxo pode ser ligado ao Supabase.
        </CardContent>
      </Card>
    </div>
  );
}
