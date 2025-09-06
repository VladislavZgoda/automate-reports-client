import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export default function Home() {
  return (
    <Accordion
      type="single"
      collapsible
      className="mt-0.5 ml-1.5 w-full"
      defaultValue="item-1"
    >
      <AccordionItem value="item-1">
        <AccordionTrigger className="text-lg font-bold">
          Экспорт Sims Client
        </AccordionTrigger>
        <AccordionContent className="max-w-2xl text-lg text-pretty">
          Позволяет преобразовать экспорт из ПО Sims, в формате xlsx, в
          &#34;Приложение №9 БЫТ/Юридические лица&#34; и &#34;Ведомость
          дистанционного снятия показаний посредствам АСКУЭ&#34;.
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-2">
        <AccordionTrigger className="text-lg font-bold">ОДПУ</AccordionTrigger>
        <AccordionContent className="max-w-2xl text-lg text-pretty">
          Позволяет преобразовать экспорт из ПО Sims и &#34;Отчёт по показаниям,
          по тарифам (Сут А+)&#34; из ПО Пирамида 2, в формате xlsx, в
          &#34;Приложение №9 ОДПУ&#34; и &#34;Ведомость дистанционного снятия
          показаний посредствам АСКУЭ&#34;.
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-3">
        <AccordionTrigger className="text-lg font-bold">
          Юридические лица П2
        </AccordionTrigger>
        <AccordionContent className="max-w-2xl text-lg text-pretty">
          Позволяет преобразовать экспорт из ПО Пирамида 2, в формате xlsx, в
          &#34;Приложение №9 Юридические лица&#34; и не большие ведомости для
          отправки конкретным потребителями по электронной почте.
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-4">
        <AccordionTrigger className="text-lg font-bold">ВИП</AccordionTrigger>
        <AccordionContent className="max-w-2xl text-lg text-pretty">
          Позволяет преобразовать экспорт из ПО Пирамида 2 и Sims, в формате
          xlsx, в ведомости для отправки на ящики филиалов по электронной почте.
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-5">
        <AccordionTrigger className="text-lg font-bold">
          Микрогенерация
        </AccordionTrigger>
        <AccordionContent className="max-w-2xl text-lg text-pretty">
          Позволяет преобразовать экспорт из ПО Sims, в формате xlsx, в
          ведомость с Микрогенерацией.
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-6">
        <AccordionTrigger className="text-lg font-bold">
          Не загруженные 25
        </AccordionTrigger>
        <AccordionContent className="max-w-2xl text-lg text-pretty">
          Позволяет преобразовать экспорт из ПО Sims, в формате xlsx, в файл из
          которого удаленны бытовые потребители, показания которых были переданы
          25 числа.
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-7">
        <AccordionTrigger className="text-lg font-bold">
          Изменить однозонные NP7x
        </AccordionTrigger>
        <AccordionContent className="max-w-2xl text-lg text-pretty">
          Позволяет изменить Т1 и Т2 однозонных счетчиков NP7x из экспорта ПО
          Sims, в формате xlsx. Для этого нужно нужен файл с серийными номерами
          записаными в столбец &#34;A&#34;.
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}
