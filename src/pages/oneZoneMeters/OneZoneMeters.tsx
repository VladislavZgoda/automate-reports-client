import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import OneZoneMetersForm from "../../components/OneZoneMetersForm";

export default function OneZoneMeters() {
  return (
    <div className="flex w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-md">
        <Card>
          <CardHeader>
            <CardTitle className="text-center text-2xl">
              Изменить показания Т1 и Т2 у однозонных NP7x.
            </CardTitle>
            <CardDescription>
              Добавьте файл с экспортом из Sims в xlsx формате и файл с
              серийными номерами однозонных счетчиков.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <OneZoneMetersForm />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
