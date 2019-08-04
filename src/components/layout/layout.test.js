import React from "react";
import { render, cleanup } from "@testing-library/react";

import Layout from "./layout";

afterEach(cleanup);

describe("Layout Component Tests", () => {
  it("Should render layout with online mode", () => {
    const { asFragment } = render(<Layout isOnline={true}>Layout test</Layout>);
    expect(asFragment()).toMatchSnapshot();
  });

  it("Should render layout with offline mode", () => {
    const { asFragment } = render(
      <Layout isOnline={false}>Layout test</Layout>
    );
    expect(asFragment()).toMatchSnapshot();
  });
});
