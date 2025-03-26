import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { http, HttpResponse } from "msw";
import { setupServer } from "msw/node";
import { BrowserRouter } from "react-router";
import { vi } from "vitest";

const server = setupServer(
  http.get("/api/refresh", () => {
    return HttpResponse.json({ accessToken: "token" }, { status: 200 });
  }),
);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

import MatritcaExportPage from "./MatritcaExport";

function createMockPointerEvent(
  type: string,
  props: PointerEventInit = {},
): PointerEvent {
  const event = new Event(type, props) as PointerEvent;

  Object.assign(event, {
    button: props.button ?? 0,
    ctrlKey: props.ctrlKey ?? false,
    pointerType: props.pointerType ?? "mouse",
  });

  return event;
}

// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-explicit-any
window.PointerEvent = createMockPointerEvent as any;

Object.assign(window.HTMLElement.prototype, {
  scrollIntoView: vi.fn(),
  releasePointerCapture: vi.fn(),
  hasPointerCapture: vi.fn(),
});

describe("MatritcaExportPage", () => {
  it("renders MatritcaExportPage component", () => {
    render(<MatritcaExportPage />, { wrapper: BrowserRouter });

    expect(
      screen.getByText("Обработка экспорта из Sims client"),
    ).toBeInTheDocument();

    expect(
      screen.getByText(
        "Введите балансную группу и добавьте файл в xlsx формате.",
      ),
    ).toBeInTheDocument();

    expect(screen.getByText("Балансная группа")).toBeInTheDocument();
    expect(screen.getByText("Контроллер")).toBeInTheDocument();
    expect(screen.getByText("Экспорт из Sims")).toBeInTheDocument();
    expect(screen.getByRole("button")).toBeInTheDocument();
  });

  it("shows errors when form input fields are empty", async () => {
    render(<MatritcaExportPage />, { wrapper: BrowserRouter });

    const submitButton = screen.getByRole("button");
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(
        screen.getByText("Балансная группа не выбрана."),
      ).toBeInTheDocument();

      expect(screen.getByText("Отсутствует xlsx файл.")).toBeInTheDocument();
    });
  });

  it("shows error when the controller field is empty and the balance group is private", async () => {
    const user = userEvent.setup();

    render(<MatritcaExportPage />, { wrapper: BrowserRouter });

    const selectButtonElement = screen.getByRole("combobox");
    await user.click(selectButtonElement);

    const selectOption = screen.getAllByText("БЫТ");
    await user.click(selectOption[1]);

    const fileInput = screen.getByLabelText("Экспорт из Sims");

    const xlsxFile = new File(["test"], "test.xlsx", {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });

    await user.upload(fileInput, xlsxFile);

    const submitButton = screen.getByRole("button");
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(
        screen.getByText("Добавьте контроллера, когда выбран Быт."),
      ).toBeInTheDocument();
    });
  });

  it("shows an error if the file type is not xlsx", async () => {
    render(<MatritcaExportPage />, { wrapper: BrowserRouter });

    const fileInput = screen.getByLabelText("Экспорт из Sims");

    const xlsFile = new File(["test"], "test.xls", {
      type: "application/vnd.ms-excel",
    });

    fireEvent.change(fileInput, {
      target: { files: { item: () => xlsFile, length: 1, 0: xlsFile } },
    });

    const submitButton = screen.getByRole("button");
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText("Тип файла не xlsx.")).toBeInTheDocument();
    });
  });

  it("does not show error for the controller field when the balance group is legal", async () => {
    const user = userEvent.setup();

    render(<MatritcaExportPage />, { wrapper: BrowserRouter });

    const selectButtonElement = screen.getByRole("combobox");
    await user.click(selectButtonElement);

    const selectOption = screen.getAllByText("Юридические лица");
    await user.click(selectOption[1]);

    const fileInput = screen.getByLabelText("Экспорт из Sims");

    const xlsxFile = new File(["test"], "test.xlsx", {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });

    await user.upload(fileInput, xlsxFile);

    const submitButton = screen.getByRole("button");
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(
        screen.queryByText("Добавьте контроллера, когда выбран Быт."),
      ).not.toBeInTheDocument();
    });
  });
});
