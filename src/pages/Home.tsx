import { Dot, Menu } from "lucide-react";

export default function Home() {
  return (
    <div className="mt-0.5 ml-1.5">
      <div className="ml-[-4px] flex items-center gap-1">
        <Menu size="20px" className="mb-1.5" />
        <h1 className="mb-3 text-2xl font-bold underline">Разделы меню:</h1>
      </div>

      <div className="mb-0.5 ml-[-7px] flex items-center gap-1">
        <Dot strokeWidth="3px" />
        <h2 className="text-lg font-bold">Экспорт Sims Client</h2>
      </div>
      <p className="ml-5.5 max-w-3xl text-pretty">
        Позволяет преобразовать экспорт из ПО Sims, в формате xlsx, в
        &#34;Приложение №9 БЫТ/Юридические лица&#34; и &#34;Ведомость
        дистанционного снятия показаний посредствам АСКУЭ&#34;.
      </p>

      <div className="mt-3 mb-0.5 ml-[-7px] flex items-center gap-1">
        <Dot strokeWidth="3px" />
        <h2 className="text-lg font-bold">ОДПУ</h2>
      </div>
      <p className="ml-5.5 max-w-3xl text-pretty">
        Позволяет преобразовать экспорт из ПО Sims и &#34;Отчёт по показаниям,
        по тарифам (Сут А+)&#34; из ПО Пирамида 2, в формате xlsx, в
        &#34;Приложение №9 ОДПУ&#34; и &#34;Ведомость дистанционного снятия
        показаний посредствам АСКУЭ&#34;.
      </p>

      <div className="mt-3 mb-0.5 ml-[-7px] flex items-center gap-1">
        <Dot strokeWidth="3px" />
        <h2 className="text-lg font-bold">Юридические лица П2</h2>
      </div>
      <p className="ml-5.5 max-w-3xl text-pretty">
        Позволяет преобразовать экспорт из ПО Пирамида 2, в формате xlsx, в
        &#34;Приложение №9 Юридические лица&#34; и не большие ведомости для
        отправки конкретным потребителями по электронной почте.
      </p>

      <div className="mt-3 mb-0.5 ml-[-7px] flex items-center gap-1">
        <Dot strokeWidth="3px" />
        <h2 className="text-lg font-bold">ВИП</h2>
      </div>
      <p className="ml-5.5 max-w-3xl text-pretty">
        Позволяет преобразовать экспорт из ПО Пирамида 2 и Sims, в формате xlsx,
        в ведомости для отправки на ящики филиалов по электронной почте.
      </p>

      <div className="mt-3 mb-0.5 ml-[-7px] flex items-center gap-1">
        <Dot strokeWidth="3px" />
        <h2 className="text-lg font-bold">Микрогенерация</h2>
      </div>
      <p className="ml-5.5 max-w-3xl text-pretty">
        Позволяет преобразовать экспорт из ПО Sims, в формате xlsx, в ведомость
        с Микрогенерацией.
      </p>
    </div>
  );
}
