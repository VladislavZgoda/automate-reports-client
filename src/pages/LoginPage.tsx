import LoginForm from "../components/LoginForm";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { HandleLogin } from "src/types";

export default function LoginPage(props: HandleLogin) {
  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <div className="flex flex-col gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">Вход</CardTitle>
              <CardDescription>
                Введите имя учетной записи и пароль для входа.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <LoginForm {...props} />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
