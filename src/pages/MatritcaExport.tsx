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

const formSchema = z.object({
  balanceGroup: z.enum(["БЫТ", "ЮР"], {
    message: "Балансная группа не выбранна.",
  }),
  file: z
    .instanceof(File, {
      message: "Отсутствует xlsx файл.",
    })
    .refine(
      (file) =>
        file.type ===
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
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
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="balanceGroup"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Балансная группа</FormLabel>
              <FormControl>
                <Select {...field}>
                  <SelectTrigger className="w-[300px]">
                    <SelectValue placeholder="Выбирете балансную группу" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="БЫТ">БЫТ</SelectItem>
                    <SelectItem value="ЮР">ЮР</SelectItem>
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Submit</Button>
      </form>
    </Form>
  );
}
