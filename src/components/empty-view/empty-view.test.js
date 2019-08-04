import React from "react";
import { render, cleanup } from "@testing-library/react";

import EmptyView from "./empty-view";

afterEach(cleanup);

describe("Empty View Component Tests", () => {
  it("Should render empty view without content", () => {
    const { asFragment } = render(<EmptyView title="" />);
    expect(asFragment()).toMatchSnapshot();
  });

  it("Should render empty view without links", () => {
    const { asFragment } = render(<EmptyView title="Empty view test" />);

    expect(asFragment()).toMatchSnapshot();
  });

  it("Should render empty view with links", () => {
    const { asFragment } = render(
      <EmptyView
        title="Empty view test"
        subtitle="Subtitle test"
        url="https://hackernews.com"
      />
    );

    expect(asFragment()).toMatchSnapshot();
  });
});
