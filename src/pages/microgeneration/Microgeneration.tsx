import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import MicrogenerationForm from "../../components/MicrogenerationForm";

export default function Microgeneration() {
  return (
    <div className="flex w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-md">
        <Card>
          <CardHeader>
            <CardTitle className="text-center text-2xl">
              Cформировать ведомость с Микрогенерацией
            </CardTitle>
            <CardDescription>
              Добавьте файл с экспортом - импортом Активной энергии из Sims в
              xlsx формате и выберете балансную группу.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <MicrogenerationForm />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
