import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { BrowserRouter } from "react-router";
import { vi } from "vitest";

import PrivateNotTransferred from "./NotTransferred";

vi.mock("../../utils/refreshToken");
vi.mock("../../utils/downloadFile");

describe("PrivateNotTransferred", () => {
  it("renders PrivateNotTransferred component", () => {
    render(<PrivateNotTransferred />, { wrapper: BrowserRouter });

    const cardTitle = screen.getByText(
      "Cформировать файл с не загруженными бытовыми показаниями.",
    );

    expect(cardTitle).toBeInTheDocument();

    const cardDescription = screen.getByText(
      'Добавьте файл с экспортом из Sims в xlsx формате и отчет "Приложение №9".',
    );

    expect(cardDescription).toBeInTheDocument();

    expect(screen.getByText("Экспорт из Sims")).toBeInTheDocument();
    expect(screen.getByText('Отчёт "Приложение №9"')).toBeInTheDocument();

    expect(
      screen.getByRole("button", { name: "Сформировать" }),
    ).toBeInTheDocument();
  });

  it("shows an error when form input field are empty", async () => {
    const user = userEvent.setup();

    render(<PrivateNotTransferred />, { wrapper: BrowserRouter });

    const submitButton = screen.getByRole("button", { name: "Сформировать" });
    await user.click(submitButton);

    const simsFileFieldError = screen.getByText(
      "Отсутствует файл экспорта из Sims.",
    );

    expect(simsFileFieldError).toBeInTheDocument();

    const reportNineFileFieldError = screen.getByText(
      "Отсутствует файл c отчётом Приложение №9.",
    );

    expect(reportNineFileFieldError).toBeInTheDocument();
  });

  it("does not show errors when form input fields are not empty and the file type is correct", async () => {
    const mockXlsxFile = new File(["test"], "test.xlsx", {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });

    render(<PrivateNotTransferred />, { wrapper: BrowserRouter });

    const simsFileInput = screen.getByLabelText("Экспорт из Sims");

    fireEvent.change(simsFileInput, {
      target: {
        files: { item: () => mockXlsxFile, length: 1, 0: mockXlsxFile },
      },
    });

    const reportNineFileInput = screen.getByLabelText('Отчёт "Приложение №9"');

    fireEvent.change(reportNineFileInput, {
      target: {
        files: { item: () => mockXlsxFile, length: 1, 0: mockXlsxFile },
      },
    });

    const submitButton = screen.getByRole("button");
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(
        screen.queryByText("Отсутствует файл экспорта из Sims."),
      ).not.toBeInTheDocument();
    });

    await waitFor(() => {
      expect(screen.queryByText("Тип файла не xlsx.")).not.toBeInTheDocument();
    });

    await waitFor(() => {
      expect(
        screen.queryByText("Отсутствует файл c отчётом Приложение №9."),
      ).not.toBeInTheDocument();
    });
  });

  it("shows an error if the file type is not xlsx", async () => {
    render(<PrivateNotTransferred />, { wrapper: BrowserRouter });

    const simsFileInput = screen.getByLabelText("Экспорт из Sims");

    const xlsFileMock = new File(["test"], "test.xls", {
      type: "application/vnd.ms-excel",
    });

    fireEvent.change(simsFileInput, {
      target: {
        files: { item: () => xlsFileMock, length: 1, 0: xlsFileMock },
      },
    });

    const reportNineFileInput = screen.getByLabelText('Отчёт "Приложение №9"');

    const txtFileMock = new File(["test"], "test.txt", {
      type: "text/plain",
    });

    fireEvent.change(reportNineFileInput, {
      target: {
        files: { item: () => txtFileMock, length: 1, 0: txtFileMock },
      },
    });

    const submitButton = screen.getByRole("button", { name: "Сформировать" });
    fireEvent.click(submitButton);

    const invalidFileTypeErrors =
      await screen.findAllByText("Тип файла не xlsx.");

    expect(invalidFileTypeErrors.length).toBe(2);
  });
});
