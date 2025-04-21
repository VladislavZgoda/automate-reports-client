import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import VipForm from "../../components/VipForm";

export default function VIP() {
  return (
    <div className="flex w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-md">
        <Card>
          <CardHeader>
            <CardTitle className="text-center text-2xl">
              Cформировать ведомости для ВИП потребителей
            </CardTitle>
            <CardDescription>
              Добавьте отчёт &#34;Новые показания&#34; из Пирамида 2 с данными
              из балансной группы &#34;ВИП Тимашевск&#34; и файл с экспортом из
              Sims в xlsx формате.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <VipForm />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
