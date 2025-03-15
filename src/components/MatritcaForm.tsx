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

import {
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Select from "./SelectWithReset";

const formSchema = z
  .object({
    balanceGroup: z.enum(["private", "legal"], {
      message: "Балансная группа не выбрана.",
    }),
    controller: z.string().optional(),
    file: z
      .instanceof(File, {
        message: "Отсутствует xlsx файл.",
      })
      .refine(
        (file) =>
          file.type ===
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        {
          message: "Тип файла не xlsx.",
        },
      ),
  })
  .refine(
    (data) =>
      data.balanceGroup !== "private" ||
      (data.balanceGroup === "private" && data.controller),
    {
      message: "Добавьте контроллера, когда выбран Быт.",
      path: ["controller"],
    },
  );

export default function MatritcaForm() {
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
    const formData = new FormData();

    formData.append("balanceGroup", values.balanceGroup);
    formData.append("upload", values.file);

    if (values.controller) formData.append("controller", values.controller);

    let token = accessToken;

    try {
      if (isExpired(token)) {
        token = await refreshTokenRequest();
        setAccessToken(token);
      }

      const response = await fetch("api/matritca/", {
        method: "POST",
        body: formData,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if ([401, 403].includes(response.status)) {
        throw new AuthError(`${response.status} ${await response.json()}`);
      }

      if (response.status === 422) {
        form.setError("file", {
          message:
            "Заголовки таблицы xlsx не совпадают с заголовками экспорта по умолчанию из Sims.",
        });
      }

      if (!response.ok) {
        throw new Error(`${response.status} ${await response.json()}`);
      }

      const blob = await response.blob();
      const fileUrl = URL.createObjectURL(blob);
      const link = document.createElement("a");

      const fileName =
        values.balanceGroup === "private" ? "Быт.zip" : "Приложение №9 Юр.xlsx";

      link.href = fileUrl;
      link.download = fileName;
      link.click();

      URL.revokeObjectURL(fileUrl);

      formRef.current?.reset();
      form.reset();
    } catch (error) {
      if (error instanceof AuthError) {
        setAccessToken("");

        await navigate("/login");
      }

      console.error(error);
    }
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
          name="balanceGroup"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-base" htmlFor="balanceGroup">
                Балансная группа
              </FormLabel>
              <FormControl>
                <Select {...field} value={field.value}>
                  <SelectTrigger className="w-[300px] mt-0.5" id="balanceGroup">
                    <SelectValue placeholder="Выберете балансную группу" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="private">БЫТ</SelectItem>
                    <SelectItem value="legal">Юридические лица</SelectItem>
                  </SelectContent>
                </Select>
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
        <FormField
          control={form.control}
          name="file"
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          render={({ field: { value, onChange, ...fieldProps } }) => (
            <FormItem>
              <FormLabel className="text-base">Экспорт из Sims</FormLabel>
              <FormControl>
                <Input
                  {...fieldProps}
                  className="w-[300px] mt-0.5"
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
        <Button type={isSubmitting ? "button" : "submit"} size="lg">
          {isSubmitting && <Loader2 className="animate-spin" />}
          {isSubmitting ? "Обработка" : "Сформировать"}
        </Button>
      </form>
    </Form>
  );
}
