import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useLocation, useNavigate } from "react-router";
import { z } from "zod";
import authTokenStore from "../store/authTokenStore";
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
import loginRequest from "../api/auth/login/loginRequest";
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
  const accessToken = authTokenStore.getState().accessToken;
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
  const origin = state?.from?.pathname ?? "/";

  const isSubmitting = form.formState.isSubmitting;

  useEffect(() => {
    if (accessToken) {
      void navigate(origin);
    }
  }, [accessToken, navigate, origin]);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const accessToken = await loginRequest(values);
      authTokenStore.getState().setAccessToken(accessToken);

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
