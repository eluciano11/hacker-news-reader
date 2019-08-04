import React from "react";
import { render, cleanup } from "@testing-library/react";

import Loader from "./Loader";

afterEach(cleanup);

describe("Loader Component Tests", () => {
  it("Should render loader", () => {
    const { asFragment } = render(<Loader />);
    expect(asFragment()).toMatchSnapshot();
  });
});
