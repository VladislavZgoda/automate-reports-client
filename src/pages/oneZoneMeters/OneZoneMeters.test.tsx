import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { BrowserRouter } from "react-router";
import { vi } from "vitest";

import OneZoneMeters from "./OneZoneMeters";

vi.mock("../../utils/refreshToken");
vi.mock("../../utils/downloadFile");

describe("OneZoneMeters", () => {
  it("renders OneZoneMeters component", () => {
    render(<OneZoneMeters />, { wrapper: BrowserRouter });

    const cardTitle = screen.getByText(
      "Изменить показания Т1 и Т2 у однозонных NP7x.",
    );

    expect(cardTitle).toBeInTheDocument();

    const cardDescription = screen.getByText(
      "Добавьте файл с экспортом из Sims в xlsx формате и файл с серийными номерами однозонных счетчиков.",
    );

    expect(cardDescription).toBeInTheDocument();

    expect(screen.getByText("Экспорт из Sims")).toBeInTheDocument();
    expect(screen.getByText("Однозонные счётчики")).toBeInTheDocument();

    expect(
      screen.getByRole("button", { name: "Сформировать" }),
    ).toBeInTheDocument();
  });

  it("shows an error when form input field are empty", async () => {
    const user = userEvent.setup();

    render(<OneZoneMeters />, { wrapper: BrowserRouter });

    const submitButton = screen.getByRole("button", { name: "Сформировать" });
    await user.click(submitButton);

    const simsFileFieldError = screen.getByText(
      "Отсутствует файл экспорта из Sims.",
    );

    expect(simsFileFieldError).toBeInTheDocument();

    const oneZoneMetersFileFieldError = screen.getByText(
      "Отсутствует файл с однозонными счетчиками.",
    );

    expect(oneZoneMetersFileFieldError).toBeInTheDocument();
  });

  it("does not show errors when form input fields are not empty and the file type is correct", async () => {
    const mockXlsxFile = new File(["test"], "test.xlsx", {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });

    render(<OneZoneMeters />, { wrapper: BrowserRouter });

    const simsFileInput = screen.getByLabelText("Экспорт из Sims");

    fireEvent.change(simsFileInput, {
      target: {
        files: { item: () => mockXlsxFile, length: 1, 0: mockXlsxFile },
      },
    });

    const oneZoneMetersFileInput = screen.getByLabelText("Однозонные счётчики");

    fireEvent.change(oneZoneMetersFileInput, {
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
        screen.queryByText("Отсутствует файл с однозонными счетчиками."),
      ).not.toBeInTheDocument();
    });
  });

  it("shows an error if the file type is not xlsx", async () => {
    render(<OneZoneMeters />, { wrapper: BrowserRouter });

    const simsFileInput = screen.getByLabelText("Экспорт из Sims");

    const xlsFileMock = new File(["test"], "test.xls", {
      type: "application/vnd.ms-excel",
    });

    fireEvent.change(simsFileInput, {
      target: {
        files: { item: () => xlsFileMock, length: 1, 0: xlsFileMock },
      },
    });

    const oneZoneMetersFileInput = screen.getByLabelText("Однозонные счётчики");

    const txtFileMock = new File(["test"], "test.txt", {
      type: "text/plain",
    });

    fireEvent.change(oneZoneMetersFileInput, {
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
