import React from "react";
import { render, cleanup } from "@testing-library/react";

import Story from "./story";

afterEach(cleanup);

describe("Story Component Tests", () => {
  it("Should render empty story", () => {
    const { asFragment } = render(<Story />);

    expect(asFragment()).toMatchSnapshot();
  });

  it("Should render story with data", () => {
    const { asFragment } = render(
      <Story
        title="Title"
        author="Author"
        url="https://www.hackernews.com"
        date="August 1, 2019 1:00pm"
      />
    );

    expect(asFragment()).toMatchSnapshot();
  });
});
