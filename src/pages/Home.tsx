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
        Позволяет преобразовать экспорт из ПО Sims, в формате xlsx, в Приложение
        №9 БЫТ/ЮР и Ведомость дистанционного снятия показаний посредствам АСКУЭ.
      </p>

      <div className="mt-3 mb-0.5 ml-[-7px] flex items-center gap-1">
        <Dot strokeWidth="3px" />
        <h2 className="text-lg font-bold">ОДПУ</h2>
      </div>
      <p className="ml-5.5 max-w-3xl text-pretty">
        Позволяет преобразовать экспорт из ПО Sims и &ldquo;Отчёт по показаниям,
        по тарифам (Сут А+)&rdquo; из ПО Пирамида 2, в формате xlsx, в
        Приложение №9 ОДПУ и Ведомость дистанционного снятия показаний
        посредствам АСКУЭ.
      </p>
    </div>
  );
}
