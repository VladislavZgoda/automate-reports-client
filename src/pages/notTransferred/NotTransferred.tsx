import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import NotTransferredForm from "../../components/NotTransferredForm";

export default function PrivateNotTransferred() {
  return (
    <div className="flex w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-md">
        <Card>
          <CardHeader>
            <CardTitle className="text-center text-2xl">
              Cформировать файл с не загруженными бытовыми показаниями.
            </CardTitle>
            <CardDescription>
              Добавьте файл с экспортом из Sims в xlsx формате и отчет
              &#34;Приложение №9&#34;.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <NotTransferredForm />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
