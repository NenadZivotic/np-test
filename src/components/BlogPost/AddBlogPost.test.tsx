import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { message } from "antd";
import React from "react";
import { Provider } from "react-redux";

import { setupStore } from "../../redux/store";
import { AddBlogPost } from "./AddBlogPost";

jest.mock("../../data/data", () => ({
  addBlogPost: jest.fn(() => Promise.resolve()),
}));

jest.mock("antd", () => ({
  ...jest.requireActual("antd"),
  message: {
    success: jest.fn(),
    error: jest.fn(),
  },
}));

describe("AddBlogPost Component", () => {
  let store: ReturnType<typeof setupStore>;

  beforeEach(() => {
    store = setupStore();
    jest.clearAllMocks();
  });

  it("renders the add blog post form", () => {
    render(
      <Provider store={store}>
        <AddBlogPost userId={1} />
      </Provider>,
    );

    fireEvent.click(screen.getByText(/Add Blog Post/i));

    expect(screen.getByText(/Add New Blog Post/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Title/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Content/i)).toBeInTheDocument();
  });

  it("submits a new blog post successfully", async () => {
    render(
      <Provider store={store}>
        <AddBlogPost userId={1} />
      </Provider>,
    );

    fireEvent.click(screen.getByText(/Add Blog Post/i));

    fireEvent.change(screen.getByLabelText(/Title/i), {
      target: { value: "Test Blog Post" },
    });
    fireEvent.change(screen.getByLabelText(/Content/i), {
      target: { value: "This is a test blog post content" },
    });

    fireEvent.click(screen.getByText(/Add Post/i));

    await waitFor(() => {
      expect(message.success).toHaveBeenCalledWith(
        "Blog post added successfully",
      );
    });
  });

  it("shows error when form submission fails", async () => {
    const mockAddBlogPost = require("../../data/data").addBlogPost;
    mockAddBlogPost.mockRejectedValue(new Error("Submission failed"));

    render(
      <Provider store={store}>
        <AddBlogPost userId={1} />
      </Provider>,
    );

    fireEvent.click(screen.getByText(/Add Blog Post/i));

    fireEvent.change(screen.getByLabelText(/Title/i), {
      target: { value: "Test Blog Post" },
    });
    fireEvent.change(screen.getByLabelText(/Content/i), {
      target: { value: "This is a test blog post content" },
    });

    fireEvent.click(screen.getByText(/Add Post/i));

    await waitFor(() => {
      expect(message.error).toHaveBeenCalledWith(
        expect.stringContaining("Failed to add blog post"),
      );
    });
  });
});
