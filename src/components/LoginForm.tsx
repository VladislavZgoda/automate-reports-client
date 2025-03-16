import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { Input } from "@/components/ui/input";
import useAuth from "../hooks/useAuth";
import { useEffect } from "react";

const formSchema = z.object({
  login: z.string().nonempty({ message: "Отсутствует имя учетной записи." }),
  password: z
    .string()
    .nonempty({ message: "Отсутствует пароль от учетной записи." }),
});

export default function LoginForm() {
  const { handleLogin, statusCode, setStatusCode } = useAuth();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      login: "",
      password: "",
    },
  });

  const isSubmitting = form.formState.isSubmitting;

  useEffect(() => {
    if (statusCode === 401) {
      const message = "Имя учетной записи или пароль не верны!";

      form.setError("login", {
        message: message,
      });

      form.setError("password", {
        message: message,
      });
    }
  }, [form, statusCode]);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setStatusCode(null);
    await handleLogin(values);
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-4 basis-3xs"
      >
        <FormField
          control={form.control}
          name="login"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-base">Имя учетной записи</FormLabel>
              <FormControl>
                <Input
                  className="mt-0.5"
                  placeholder="Введите имя вашей учётной записи"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-base">Пароль</FormLabel>
              <FormControl>
                <Input
                  className="mt-0.5"
                  type="password"
                  autoComplete="on"
                  placeholder="Введите свой пароль"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button
          type={isSubmitting ? "button" : "submit"}
          size="lg"
          className="cursor-pointer"
        >
          {isSubmitting && <Loader2 className="animate-spin" />}
          {isSubmitting ? "Проверка" : "Войти"}
        </Button>
      </form>
    </Form>
  );
}
