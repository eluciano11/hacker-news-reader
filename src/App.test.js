import React from "react";
import moxios from "moxios";
import { render, cleanup, waitForElement } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";

import App from "./App";

describe("Root Component Test", () => {
  beforeEach(() => moxios.install());
  afterEach(() => {
    moxios.uninstall();
    cleanup();
  });

  it("Should render loading view", async () => {
    const { getByTestId } = render(<App />);

    expect(getByTestId("loading")).toBeInTheDocument();
  });

  it("Should handle empty stories", async () => {
    moxios.stubRequest(/newstories\.json/, { status: 200, response: [] });

    const { getByTestId } = render(<App />);
    const resolvedComponent = await waitForElement(() => getByTestId("empty"));

    expect(resolvedComponent).toBeInTheDocument();
  });

  it("Should handle error from network", async () => {
    moxios.stubRequest(/newstories\.json/, { status: 500 });

    const { getByTestId } = render(<App />);
    const resolvedComponent = await waitForElement(() => getByTestId("error"));

    expect(resolvedComponent).toBeInTheDocument();
  });
});
