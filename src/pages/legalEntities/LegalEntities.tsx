import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import LegalEntitiesForm from "../../components/legalEntitiesForm";

export default function LegalEntities() {
  return (
    <div className="flex w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-md">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">
              Обработка экспорта из Пирамида 2
            </CardTitle>
            <CardDescription>
              Добавьте отчёт &#34;Новые показания&#34; из Пирамида 2 с данными
              из балансных групп &#34;Юридические лица Тимашевск&#34; и &#34;ВИП
              Тимашевск&#34;.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <LegalEntitiesForm />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
