import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { BrowserRouter } from "react-router";

import MatritcaExportPage from "./MatritcaExportPage";

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
    const user = userEvent.setup();

    render(<MatritcaExportPage />, { wrapper: BrowserRouter });

    await user.click(screen.getByRole("button"));

    expect(screen.getByText("Балансная группа не выбрана.")).toBeTruthy();
    expect(screen.getByText("Отсутствует xlsx файл.")).toBeTruthy();
  });

//   it("shows error when the controller field is empty and the balance group is private", async () => {

//     render(<MatritcaExportPage />, { wrapper: BrowserRouter });

//     const balanceGroupSelect = screen.getByLabelText("Балансная группа");

//     // await user.selectOptions(balanceGroupSelect, "БЫТ");

//     fireEvent.pointerDown(
//       balanceGroupSelect,
//       new PointerEvent("pointerdown", {
//         ctrlKey: false,
//         button: 0,
//       }),
//     );

//     const selectedOption = await waitFor(() => screen.findByText("БЫТ"));
//     fireEvent.click(selectedOption);

//     //screen.debug()
//   });
});
