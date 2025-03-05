import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

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

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="balanceGroup"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-base">Балансная группа</FormLabel>
              <FormControl>
                <Select onValueChange={field.onChange} {...field}>
                  <SelectTrigger className="w-[300px]">
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
                  className="w-[300px]"
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
                  className="w-[300px]"
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
        <Button type="submit" size="lg">
          Сформировать
        </Button>
      </form>
    </Form>
  );
}
