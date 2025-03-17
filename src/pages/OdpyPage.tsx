import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import OdpyForm from "../components/OdpyForm";

export default function Odpy() {
  return (
    <div className="flex w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-md">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">
              Сформировать ведомость с ОДПУ
            </CardTitle>
            <CardDescription>
              Добавьте экспорт из Sims в xlsx формате, отчёт по показаниям из
              Пирамида2 с диапазоном в 4 суток.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <OdpyForm />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
