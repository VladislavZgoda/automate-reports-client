import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useEffect } from "react";
import { useNavigate } from "react-router";
import LoginForm from "../../components/LoginForm";
import useAuth from "../../hooks/useAuth";

export default function LoginPage() {
  const { accessToken } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (accessToken) {
      void navigate("/");
    }
  }, [accessToken, navigate]);

  return (
    <div className="flex min-h-svh w-full flex-col items-center justify-center p-6 md:p-10">
      <h1 className="mb-3 text-2xl font-bold">Обработка XLSX файлов</h1>
      <div className="w-full max-w-sm">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Вход</CardTitle>
            <CardDescription>
              Введите имя учетной записи и пароль для входа.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <LoginForm />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
