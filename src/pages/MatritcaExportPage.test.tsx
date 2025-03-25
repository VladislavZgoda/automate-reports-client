import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { BrowserRouter } from "react-router";
import { vi } from "vitest";

import MatritcaExportPage from "./MatritcaExportPage";

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

    expect(screen.getByText("Обработка экспорта из Sims client")).toBeTruthy();

    expect(
      screen.getByText(
        "Введите балансную группу и добавьте файл в xlsx формате.",
      ),
    ).toBeTruthy();

    expect(screen.getByText("Балансная группа")).toBeTruthy();
    expect(screen.getByText("Контроллер")).toBeTruthy();
    expect(screen.getByText("Экспорт из Sims")).toBeTruthy();
    expect(screen.getByRole("button")).toBeTruthy();
  });

  it("shows errors when form input fields are empty", async () => {
    render(<MatritcaExportPage />, { wrapper: BrowserRouter });

    const submitButton = screen.getByRole("button");
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText("Балансная группа не выбрана.")).toBeTruthy();
      expect(screen.getByText("Отсутствует xlsx файл.")).toBeTruthy();
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
      ).toBeTruthy();
    });
  });
});
