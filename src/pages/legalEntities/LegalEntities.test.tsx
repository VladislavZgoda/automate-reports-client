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

    const fileInputFieldLabel = screen.getByText("Экспорт из Пирамида 2");
    expect(fileInputFieldLabel).toBeInTheDocument();

    const submitButton = screen.getByRole("button", { name: "Сформировать" });
    expect(submitButton).toBeInTheDocument();
  });

  it("shows an error when form input field are empty", async () => {
    const user = userEvent.setup();

    render(<LegalEntities />, { wrapper: BrowserRouter });

    const submitButton = screen.getByRole("button", { name: "Сформировать" });
    await user.click(submitButton);

    const piramidaFileInputFieldError = screen.getByText(
      "Отсутствует файл экспорта из Пирамида 2.",
    );

    expect(piramidaFileInputFieldError).toBeInTheDocument();
  });

  it("shows an error if the file type is not xlsx", async () => {
    render(<LegalEntities />, { wrapper: BrowserRouter });

    const piramidaFileInput = screen.getByLabelText("Экспорт из Пирамида 2");

    const xlsFileMock = new File(["test"], "test.xls", {
      type: "application/vnd.ms-excel",
    });

    fireEvent.change(piramidaFileInput, {
      target: { files: { item: () => xlsFileMock, length: 1, 0: xlsFileMock } },
    });

    const submitButton = screen.getByRole("button", { name: "Сформировать" });
    fireEvent.click(submitButton);

    const invalidFileTypeErrors = await screen.findByText("Тип файла не xlsx.");
    expect(invalidFileTypeErrors).toBeInTheDocument();
  });
});
