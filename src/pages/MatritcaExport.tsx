import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import MatritcaForm from "../components/MatritcaForm";

export default function MatritcaExport() {
  return (
    <div className="flex w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-md">
        <div className="flex flex-col gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">
                Обработка экспорта из Sims client
              </CardTitle>
              <CardDescription>
                Введите балансную группу и добавьте файл в xlsx формате.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <MatritcaForm />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
