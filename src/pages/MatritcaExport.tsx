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

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const formSchema = z.object({
  balanceGroup: z.enum(["private", "legal"], {
    message: "Балансная группа не выбрана.",
  }),
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
});

export default function MatritcaExport() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
  }

  return (
    <div className="flex w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-md">
        <div className="flex flex-col gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">
                Обработка экспорта из Sims client
              </CardTitle>
              <CardDescription>
                Введите балансную группу и добавьте файл в xlsx формате.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-8"
                >
                  <FormField
                    control={form.control}
                    name="balanceGroup"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-base">
                          Балансная группа
                        </FormLabel>
                        <FormControl>
                          <Select onValueChange={field.onChange} {...field}>
                            <SelectTrigger className="w-[300px]">
                              <SelectValue placeholder="Выберете балансную группу" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="private">БЫТ</SelectItem>
                              <SelectItem value="legal">
                                Юридические лица
                              </SelectItem>
                            </SelectContent>
                          </Select>
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
                        <FormLabel className="text-base">
                          Экспорт из Sims
                        </FormLabel>
                        <FormControl>
                          <Input
                            {...fieldProps}
                            className="w-[300px]"
                            placeholder="xlsx файл"
                            type="file"
                            accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                            onChange={(event) =>
                              onChange(event.target.files?.[0])
                            }
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
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
