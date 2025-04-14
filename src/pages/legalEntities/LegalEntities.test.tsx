import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { BrowserRouter } from "react-router";

import LegalEntities from "./LegalEntities";

describe("LegalEntities", () => {
  it("renders the component", () => {
    render(<LegalEntities />, { wrapper: BrowserRouter });

    const cardTitle = screen.getByText("Обработка экспорта из Пирамида 2");
    expect(cardTitle).toBeInTheDocument();

    const cardDescription = screen.getByText(/Добавьте отчёт/i);
    expect(cardDescription).toBeInTheDocument();

    const metersReadinsFieldLabel = screen.getByText(
      'Экспорт отчёта "Новые показания"',
    );

    expect(metersReadinsFieldLabel).toBeInTheDocument();

    const currentMeterReadings = screen.getByText(
      /Экспорт балансной группы "А\+ Текущие Тимашевск"/,
    );

    expect(currentMeterReadings).toBeInTheDocument();

    const submitButton = screen.getByRole("button", { name: "Сформировать" });
    expect(submitButton).toBeInTheDocument();
  });

  it("shows an error when form input field are empty", async () => {
    const user = userEvent.setup();

    render(<LegalEntities />, { wrapper: BrowserRouter });

    const submitButton = screen.getByRole("button", { name: "Сформировать" });
    await user.click(submitButton);

    const meterReadinsFieldError = screen.getByText(
      "Отсутствует файл экспорта отчёта Новые показания.",
    );

    expect(meterReadinsFieldError).toBeInTheDocument();

    const currentMeterReadinsFieldError = screen.getByText(
      "Отсутствует файл экспорта балансной группы А+ Текущие Тимашевск.",
    );

    expect(currentMeterReadinsFieldError).toBeInTheDocument();
  });

  it("shows an error if the file type is not xlsx", async () => {
    render(<LegalEntities />, { wrapper: BrowserRouter });

    const meterReadinsInput = screen.getByLabelText(
      /Экспорт балансной группы "А\+ Текущие Тимашевск"/,
    );

    const xlsFileMock = new File(["test"], "test.xls", {
      type: "application/vnd.ms-excel",
    });

    fireEvent.change(meterReadinsInput, {
      target: { files: { item: () => xlsFileMock, length: 1, 0: xlsFileMock } },
    });

    const currentMeterReadinsInput = screen.getByLabelText(
      'Экспорт отчёта "Новые показания"',
    );

    const txtFileMock = new File(["test"], "test.txt", {
      type: "text/plain",
    });

    fireEvent.change(currentMeterReadinsInput, {
      target: { files: { item: () => txtFileMock, length: 1, 0: txtFileMock } },
    });

    const submitButton = screen.getByRole("button", { name: "Сформировать" });
    fireEvent.click(submitButton);

    const invalidFileTypeErrors =
      await screen.findAllByText("Тип файла не xlsx.");

    expect(invalidFileTypeErrors.length).toBe(2);
  });
});
