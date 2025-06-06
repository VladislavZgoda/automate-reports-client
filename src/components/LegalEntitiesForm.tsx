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
  UnprocessableCurrentMeterReadingsError,
  UnprocessableMeterReadingsError,
} from "../utils/customErrors";

import { Input } from "@/components/ui/input";
import request from "../api/endpoint/request";
import authTokenStore from "../store/authTokenStore";
import downloadFile from "../utils/downloadFile";
import refreshToken from "../utils/refreshToken";
import FormButton from "./formButton/FormButton";

const formSchema = z.object({
  meterReadings: z
    .instanceof(File, {
      message: "Отсутствует файл экспорта отчёта Новые показания.",
    })
    .refine(
      (file) =>
        file.type ===
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      { message: "Тип файла не xlsx." },
    ),
  currentMeterReadings: z
    .instanceof(File, {
      message:
        "Отсутствует файл экспорта балансной группы А+ Текущие Тимашевск.",
    })
    .refine(
      (file) =>
        file.type ===
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      { message: "Тип файла не xlsx." },
    ),
});

export default function LegalEntitiesForm() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  const isSubmitting = form.formState.isSubmitting;
  const accessToken = authTokenStore.getState().accessToken;

  const formRef = useRef<HTMLFormElement>(null);
  const navigate = useNavigate();

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const formData = new FormData();

    formData.append("meterReadings", values.meterReadings);
    formData.append("currentMeterReadings", values.currentMeterReadings);

    try {
      const token = await refreshToken(accessToken);
      const blob = await request("api/legal-entities/", token, formData);

      downloadFile(blob, "Юр.zip");

      formRef.current?.reset();
    } catch (error) {
      if (error instanceof AuthError) {
        authTokenStore.getState().reset();

        await navigate("/login");
      } else if (error instanceof UnprocessableMeterReadingsError) {
        form.setError("meterReadings", {
          message:
            "Заголовки таблицы xlsx не совпадают с заголовками Экспорт отчёта Новые показания.",
        });
      } else if (error instanceof UnprocessableCurrentMeterReadingsError) {
        form.setError("currentMeterReadings", {
          message: `Заголовки таблицы xlsx не совпадают с заголовками балансной группы
                А+ Текущие Тимашевск.`,
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
          name="meterReadings"
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
          name="currentMeterReadings"
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          render={({ field: { value, onChange, ...fieldProps } }) => (
            <FormItem>
              <FormLabel className="text-base">
                Экспорт балансной группы
                <br /> &#34;А+ Текущие Тимашевск&#34;
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

        <FormButton isSubmitting={isSubmitting} />
      </form>
    </Form>
  );
}
