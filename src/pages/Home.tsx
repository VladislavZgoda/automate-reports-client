import { Dot, Menu } from "lucide-react";

export default function Home() {
  return (
    <div className="ml-1.5 mt-0.5">
      <div className="flex gap-1 items-center ml-[-4px]">
        <Menu size="20px" className="mb-1.5" />
        <h1 className="text-2xl font-bold underline mb-3">Разделы меню:</h1>
      </div>

      <div className="flex gap-1 items-center mb-0.5 ml-[-7px]">
        <Dot strokeWidth="3px" />
        <h2 className="text-lg font-bold">Экспорт Sims Client</h2>
      </div>
      <p className="text-pretty max-w-3xl ml-5.5">
        Позволяет преобразовать экспорт из ПО Sims, в формате xlsx, в Приложение
        №9 БЫТ/ЮР и Ведомость дистанционного снятия показаний посредствам АСКУЭ.
      </p>

      <div className="flex gap-1 items-center mb-0.5 mt-3 ml-[-7px]">
        <Dot strokeWidth="3px" />
        <h2 className="text-lg font-bold">ОДПУ</h2>
      </div>
      <p className="text-pretty max-w-3xl ml-5.5">
        Позволяет преобразовать экспорт из ПО Sims и &ldquo;Отчёт по показаниям,
        по тарифам (Сут А+)&rdquo; из ПО Пирамида 2, в формате xlsx, в
        Приложение №9 ОДПУ и Ведомость дистанционного снятия показаний
        посредствам АСКУЭ.
      </p>
    </div>
  );
}
