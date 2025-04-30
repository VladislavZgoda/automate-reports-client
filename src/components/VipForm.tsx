import { zodResolver } from "@hookform/resolvers/zod";
import { useRef } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router";
import { z } from "zod";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import {
  AuthError,
  UnprocessablePiramidaFileError,
  UnprocessableSimsFileError,
} from "../utils/customErrors";

import { Input } from "@/components/ui/input";
import request from "../api/endpoint/request";
import authTokenStore from "../store/authTokenStore";
import downloadFile from "../utils/downloadFile";
import refreshToken from "../utils/refreshToken";
import FormButton from "./formButton/FormButton";

const formSchema = z.object({
  piramidaFile: z
    .instanceof(File, {
      message: "Отсутствует файл экспорта отчёта Новые показания.",
    })
    .refine(
      (file) =>
        file.type ===
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      { message: "Тип файла не xlsx." },
    ),
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
});

export default function VipForm() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  const isSubmitting = form.formState.isSubmitting;
  const accessToken = authTokenStore.getState().accessToken;

  const formRef = useRef<HTMLFormElement>(null);
  const navigate = useNavigate();

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const formData = new FormData();

    formData.append("simsFile", values.simsFile);
    formData.append("piramidaFile", values.piramidaFile);

    try {
      const token = await refreshToken(accessToken);
      const blob = await request("api/vip/", token, formData);

      downloadFile(blob, "ВИП.zip");

      formRef.current?.reset();
    } catch (error) {
      if (error instanceof AuthError) {
        authTokenStore.getState().reset();

        await navigate("/login");
      } else if (error instanceof UnprocessableSimsFileError) {
        form.setError("simsFile", {
          message:
            "Заголовки таблицы xlsx не совпадают с заголовками экспорта по умолчанию из Sims.",
        });
      } else if (error instanceof UnprocessablePiramidaFileError) {
        form.setError("piramidaFile", {
          message:
            "Заголовки таблицы xlsx не совпадают с заголовками Экспорт отчёта Новые показания.",
        });
      } else {
        console.error(error);
      }
    }
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        ref={formRef}
        className="space-y-8"
      >
        <FormField
          control={form.control}
          name="piramidaFile"
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          render={({ field: { value, onChange, ...fieldProps } }) => (
            <FormItem>
              <FormLabel className="text-base">
                Экспорт отчёта &#34;Новые показания&#34;
              </FormLabel>
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
              <FormMessage className="w-60 text-pretty" />
            </FormItem>
          )}
        />

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
              <FormMessage className="w-60 text-pretty" />
            </FormItem>
          )}
        />

        <FormButton isSubmitting={isSubmitting} />
      </form>
    </Form>
  );
}
