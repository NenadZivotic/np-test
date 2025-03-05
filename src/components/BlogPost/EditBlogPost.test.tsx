import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { message } from "antd";
import React from "react";
import { Provider } from "react-redux";

import { setupStore } from "../../redux/store";
import { EditBlogPost } from "./EditBlogPost";

jest.mock("../../data/data", () => ({
  editBlogPost: jest.fn(() => Promise.resolve()),
}));

jest.mock("antd", () => ({
  ...jest.requireActual("antd"),
  message: {
    success: jest.fn(),
    error: jest.fn(),
  },
}));

const mockBlogPost = {
  id: "test-blog-1",
  title: "Test Blog Post",
  body: "This is a test blog post content.",
  userId: 1,
  datePosted: new Date("2023-01-01T00:00:00Z").toISOString(),
};

describe("EditBlogPost Component", () => {
  let store: ReturnType<typeof setupStore>;

  beforeEach(() => {
    store = setupStore();
    jest.clearAllMocks();
  });

  it("renders the edit blog post form", async () => {
    render(
      <Provider store={store}>
        <EditBlogPost blogPost={mockBlogPost} />
      </Provider>,
    );

    fireEvent.click(screen.getByText(/Edit Post/i));

    await waitFor(() => {
      expect(screen.getByLabelText(/Edit Blog Post/i)).toBeInTheDocument();
    });

    expect(screen.getByLabelText(/Title/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Content/i)).toBeInTheDocument();
  });

  it("edits a blog post successfully", async () => {
    render(
      <Provider store={store}>
        <EditBlogPost blogPost={mockBlogPost} />
      </Provider>,
    );

    fireEvent.click(screen.getByText(/Edit Post/i));

    fireEvent.change(screen.getByLabelText(/Title/i), {
      target: { value: "Updated Blog Post" },
    });
    fireEvent.change(screen.getByLabelText(/Content/i), {
      target: { value: "Updated content." },
    });

    fireEvent.click(screen.getByText(/Save Changes/i));

    await waitFor(() => {
      expect(message.success).toHaveBeenCalledWith(
        "Blog post updated successfully",
      );
    });
  });

  it("shows error when form submission fails", async () => {
    const mockEditBlogPost = require("../../data/data").editBlogPost;
    mockEditBlogPost.mockRejectedValue(new Error("Submission failed"));

    render(
      <Provider store={store}>
        <EditBlogPost blogPost={mockBlogPost} />
      </Provider>,
    );

    fireEvent.click(screen.getByText(/Edit Post/i));

    fireEvent.change(screen.getByLabelText(/Title/i), {
      target: { value: "Test Blog Post" },
    });
    fireEvent.change(screen.getByLabelText(/Content/i), {
      target: { value: "This is a test blog post content" },
    });

    fireEvent.click(screen.getByText(/Save Changes/i));

    await waitFor(() => {
      expect(message.error).toHaveBeenCalledWith(
        expect.stringContaining("Failed to update blog post"),
      );
    });
  });
});
