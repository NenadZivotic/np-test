import { screen } from "@testing-library/react";
import React from "react";

import { renderWithProviders } from "../utils/testUtils";
import { App } from "./App";

describe("<App>", () => {
  it("renders the page title", async () => {
    renderWithProviders(<App />);

    expect(
      await screen.findByRole("heading", { name: "NaviPartner Tech Test" }),
    ).toBeInTheDocument();
  });
});
