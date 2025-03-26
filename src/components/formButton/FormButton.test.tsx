import { render, screen } from "@testing-library/react";

import FormButton from "./FormButton";

describe("FormButton component", () => {
  it("renders the default state of the button if isSubmitting is false", () => {
    render(<FormButton isSubmitting={false} />);

    expect(
      screen.getByRole("button", { name: "Сформировать" }),
    ).toBeInTheDocument();
  });

  it("renders the loading state of the button if isSubmitting is true", () => {
    render(<FormButton isSubmitting={true} />);

    expect(
      screen.getByRole("button", { name: "Обработка" }),
    ).toBeInTheDocument();
  });
});
