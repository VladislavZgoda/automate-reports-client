import { zodResolver } from "@hookform/resolvers/zod";
import { useRef } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router";
import { z } from "zod";
import request from "../api/endpoint/request";
import authTokenStore from "../store/authTokenStore";

import {
  AuthError,
  UnprocessableOneZoneMetersError,
  UnprocessableSimsFileError,
} from "../utils/customErrors";

import downloadFile from "../utils/downloadFile";
import refreshToken from "../utils/refreshToken";

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
    .file({ error: "Отсутствует файл экспорта из Sims." })
    .mime("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", {
      error: "Тип файла не xlsx.",
    }),
  oneZoneMetersFile: z
    .file({
      error: "Отсутствует файл с однозонными счетчиками.",
    })
    .mime("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", {
      error: "Тип файла не xlsx.",
    }),
});

export default function OneZoneMetersForm() {
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
    formData.append("oneZoneMetersFile", values.oneZoneMetersFile);

    try {
      const token = await refreshToken(accessToken);
      const blob = await request("api/one-zone-meters/", token, formData);

      downloadFile(blob, "Измененные Т1/Т2.xlsx");

      formRef.current?.reset();
    } catch (error) {
      if (error instanceof AuthError) {
        authTokenStore.getState().reset();

        await navigate("/login");
      } else if (error instanceof UnprocessableSimsFileError) {
        form.setError("simsFile", {
          message:
            "Заголовки таблицы xlsx не соответствуют заголовкам экспорта по умолчанию из Sims.",
        });
      } else if (error instanceof UnprocessableOneZoneMetersError) {
        form.setError("oneZoneMetersFile", {
          message: "Некорректное содержание файла.",
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
          name="oneZoneMetersFile"
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          render={({ field: { value, onChange, ...fieldProps } }) => (
            <FormItem>
              <FormLabel className="text-base">Однозонные счётчики</FormLabel>
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

        <FormButton isSubmitting={isSubmitting} />
      </form>
    </Form>
  );
}
