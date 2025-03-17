import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import useAuth from "../hooks/useAuth";
import { Loader2 } from "lucide-react";
import { useNavigate } from "react-router";
import { isExpired } from "react-jwt";
import refreshTokenRequest from "../api/refreshToken";
import { useRef } from "react";
import { AuthError } from "../utils/customErrors";

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

const formSchema = z.object({
  simsFile: z
    .instanceof(File, {
      message: "Отсутствует файл экспорта из Sims.",
    })
    .refine(
      (file) =>
        file.type ===
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      { message: "Тип файла не xlsx." },
    ),
  piramidaFile: z
    .instanceof(File, {
      message: "Отсутствует файл экспорта из Пирамида2.",
    })
    .refine(
      (file) =>
        file.type ===
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      { message: "Тип файла не xlsx." },
    ),
  controller: z.string().min(1, {
    message: "Пустое поле.",
  }),
});

export default function OdpyForm() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      controller: "",
    },
  });

  const isSubmitting = form.formState.isSubmitting;

  const { accessToken, setAccessToken } = useAuth();
  const formRef = useRef<HTMLFormElement>(null);
  const navigate = useNavigate();

  async function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-8"
        ref={formRef}
      >
        <FormField
          control={form.control}
          name="simsFile"
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          render={({ field: { value, onChange, ...fieldProps } }) => (
            <FormItem>
              <FormLabel className="text-base">Экспорт из Sims</FormLabel>
              <FormControl>
                <Input
                  {...fieldProps}
                  className="w-[300px] mt-0.5 cursor-pointer"
                  placeholder="xlsx файл"
                  type="file"
                  accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                  onChange={(event) => onChange(event.target.files?.[0])}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="piramidaFile"
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          render={({ field: { value, onChange, ...fieldProps } }) => (
            <FormItem>
              <FormLabel className="text-base">Экспорт из Пирамида2</FormLabel>
              <FormControl>
                <Input
                  {...fieldProps}
                  className="w-[300px] mt-0.5 cursor-pointer"
                  placeholder="xlsx файл"
                  type="file"
                  accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                  onChange={(event) => onChange(event.target.files?.[0])}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="controller"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-base">Контроллер</FormLabel>
              <FormControl>
                <Input
                  className="w-[300px] mt-0.5"
                  placeholder="Введите ФИО контроллера"
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
          className={isSubmitting ? "cursor-wait" : "cursor-pointer"}
        >
          {isSubmitting && <Loader2 className="animate-spin" />}
          {isSubmitting ? "Обработка" : "Сформировать"}
        </Button>
      </form>
    </Form>
  );
}
