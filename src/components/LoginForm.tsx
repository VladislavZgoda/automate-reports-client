import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useLocation, useNavigate } from "react-router";
import { z } from "zod";
import LoginButton from "./loginButton/LoginButton";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { Input } from "@/components/ui/input";
import loginRequest from "../api/login";
import useAuthStore from "../hooks/useAuthStore";
import { AuthError } from "../utils/customErrors";

interface LocationState {
  from?: { pathname: string | undefined };
}

const formSchema = z.object({
  login: z.string().min(1, { message: "Отсутствует имя учетной записи." }),
  password: z
    .string()
    .min(1, { message: "Отсутствует пароль от учетной записи." }),
});

export default function LoginForm() {
  const setAccessToken = useAuthStore((state) => state.setAccessToken);
  const navigate = useNavigate();
  const location = useLocation();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      login: "",
      password: "",
    },
  });

  const state = location.state as LocationState;
  const isSubmitting = form.formState.isSubmitting;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const accessToken = await loginRequest(values);
      setAccessToken(accessToken);

      const origin = state?.from?.pathname ?? "/";
      await navigate(origin);
    } catch (error) {
      if (error instanceof AuthError) {
        const message = "Имя учетной записи или пароль не верны!";

        form.setError("login", {
          message: message,
        });

        form.setError("password", {
          message: message,
        });
      } else {
        console.log(error);
      }
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="basis-3xs space-y-4"
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

        <LoginButton isSubmitting={isSubmitting} />
      </form>
    </Form>
  );
}
