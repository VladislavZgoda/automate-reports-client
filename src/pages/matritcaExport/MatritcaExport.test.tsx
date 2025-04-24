import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { BrowserRouter } from "react-router";
import { vi } from "vitest";

import MatritcaExport from "./MatritcaExport";

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

const mockXlsxFile = new File(["test"], "test.xlsx", {
  type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
});

vi.mock("../../utils/refreshToken");
vi.mock("../../utils/downloadFile");

const original = window.location;

beforeAll(() => {
  Object.defineProperty(window, "location", {
    configurable: true,
    value: { reload: vi.fn() },
  });
});

afterAll(() => {
  Object.defineProperty(window, "location", {
    configurable: true,
    value: original,
  });
});

describe("MatritcaExport", () => {
  it("renders MatritcaExport component", () => {
    render(<MatritcaExport />, { wrapper: BrowserRouter });

    expect(
      screen.getByText("Обработка экспорта из Sims client"),
    ).toBeInTheDocument();

    expect(
      screen.getByText(
        "Выберете балансную группу и добавьте файл в xlsx формате.",
      ),
    ).toBeInTheDocument();

    expect(screen.getByText("Балансная группа")).toBeInTheDocument();
    expect(screen.getByText("Контроллер")).toBeInTheDocument();
    expect(screen.getByText("Экспорт из Sims")).toBeInTheDocument();

    expect(
      screen.getByRole("button", { name: "Сформировать" }),
    ).toBeInTheDocument();
  });

  it("shows errors when form input fields are empty", async () => {
    render(<MatritcaExport />, { wrapper: BrowserRouter });

    const submitButton = screen.getByRole("button");
    fireEvent.click(submitButton);

    const balanceGroupError = await screen.findByText(
      "Балансная группа не выбрана.",
    );

    expect(balanceGroupError).toBeInTheDocument();

    const fileInputError = await screen.findByText("Отсутствует xlsx файл.");

    expect(fileInputError).toBeInTheDocument();
  });

  it("shows error when the controller field is empty and the balance group is private", async () => {
    const user = userEvent.setup();

    render(<MatritcaExport />, { wrapper: BrowserRouter });

    const selectButtonElement = screen.getByRole("combobox");
    await user.click(selectButtonElement);

    const selectOption = screen.getAllByText("БЫТ");
    await user.click(selectOption[1]);

    const fileInput = screen.getByLabelText("Экспорт из Sims");
    await user.upload(fileInput, mockXlsxFile);

    const submitButton = screen.getByRole("button", { name: "Сформировать" });
    fireEvent.click(submitButton);

    const controllerFieldError = await screen.findByText(
      "Добавьте контроллера, когда выбран Быт.",
    );

    expect(controllerFieldError).toBeInTheDocument();
  });

  it("shows an error if the file type is not xlsx", async () => {
    render(<MatritcaExport />, { wrapper: BrowserRouter });

    const fileInput = screen.getByLabelText("Экспорт из Sims");

    const mockXlsFile = new File(["test"], "test.xls", {
      type: "application/vnd.ms-excel",
    });

    fireEvent.change(fileInput, {
      target: { files: { item: () => mockXlsFile, length: 1, 0: mockXlsFile } },
    });

    const submitButton = screen.getByRole("button", { name: "Сформировать" });
    fireEvent.click(submitButton);

    const invalidFileTypeError = await screen.findByText("Тип файла не xlsx.");

    expect(invalidFileTypeError).toBeInTheDocument();
  });

  it("does not show error for the controller field when the balance group is legal", async () => {
    const user = userEvent.setup();

    render(<MatritcaExport />, { wrapper: BrowserRouter });

    const selectButtonElement = screen.getByRole("combobox");
    await user.click(selectButtonElement);

    const selectOption = screen.getAllByText("Юридические лица");
    await user.click(selectOption[1]);

    const fileInput = screen.getByLabelText("Экспорт из Sims");
    await user.upload(fileInput, mockXlsxFile);

    const submitButton = screen.getByRole("button", { name: "Сформировать" });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(
        screen.queryByText("Добавьте контроллера, когда выбран Быт."),
      ).not.toBeInTheDocument();
    });
  });
});
