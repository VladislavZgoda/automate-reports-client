import { zodResolver } from "@hookform/resolvers/zod";
import { useRef } from "react";
import { useForm } from "react-hook-form";
import { isExpired } from "react-jwt";
import { useNavigate } from "react-router";
import { z } from "zod";
import refreshTokenRequest from "../api/refreshToken";
import useAuthStore from "../hooks/useAuthStore";
import { AuthError } from "../utils/customErrors";
import downloadFile from "../utils/downloadFile";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import FormButton from "./formButton/FormButton";

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
      message: "Отсутствует файл экспорта из Пирамида 2.",
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

const response422Schema = z.object({
  file: z.enum(["matritcaOdpy", "piramidaOdpy"]),
  message: z.string().min(1),
});

export default function OdpyForm() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      controller: "",
    },
  });

  const isSubmitting = form.formState.isSubmitting;

  const accessToken = useAuthStore((state) => state.accessToken);
  const setAccessToken = useAuthStore((state) => state.setAccessToken);
  const resetToken = useAuthStore((state) => state.reset);

  const formRef = useRef<HTMLFormElement>(null);
  const navigate = useNavigate();

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const formData = new FormData();

    formData.append("matritcaOdpy", values.simsFile);
    formData.append("piramidaOdpy", values.piramidaFile);
    formData.append("controller", values.controller);

    let token = accessToken;

    try {
      if (isExpired(token)) {
        token = await refreshTokenRequest();
        setAccessToken(token);
      }

      const response = await fetch("api/odpy/", {
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
        const response422 = response422Schema.parse(await response.json());

        if (response422.file === "matritcaOdpy") {
          form.setError("simsFile", {
            message: response422.message,
          });
        } else if (response422.file === "piramidaOdpy") {
          form.setError("piramidaFile", {
            message: response422.message,
          });
        }

        throw new Error(`422 ${response422.message}`);
      }

      if (!response.ok) {
        throw new Error(`${response.status} ${await response.json()}`);
      }

      const blob = await response.blob();
      downloadFile(blob, "ОДПУ.zip");

      formRef.current?.reset();
      form.reset();
    } catch (error) {
      if (error instanceof AuthError) {
        resetToken();

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
          name="simsFile"
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          render={({ field: { value, onChange, ...fieldProps } }) => (
            <FormItem>
              <FormLabel className="text-base">Экспорт из Sims</FormLabel>
              <FormControl>
                <Input
                  {...fieldProps}
                  className="mt-0.5 w-[300px] cursor-pointer"
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
              <FormLabel className="text-base">Экспорт из Пирамида 2</FormLabel>
              <FormControl>
                <Input
                  {...fieldProps}
                  className="mt-0.5 w-[300px] cursor-pointer"
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
                  className="mt-0.5 w-[300px]"
                  placeholder="Введите ФИО контроллера"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormButton isSubmitting={isSubmitting} />
      </form>
    </Form>
  );
}
