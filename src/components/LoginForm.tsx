import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { use } from "react";
import { AuthContext } from "../providers/authProvider";

const formSchema = z.object({
  login: z.string().nonempty({ message: "Отсутствует имя учетной записи." }),
  password: z
    .string()
    .nonempty({ message: "Отсутствует пароль от учетной записи." }),
});

export default function LoginForm() {
  const { handleLogin } = use(AuthContext);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      login: "",
      password: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
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
                  type="password"
                  placeholder="Введите свой пароль"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" size="lg">
          Войти
        </Button>
      </form>
    </Form>
  );
}
