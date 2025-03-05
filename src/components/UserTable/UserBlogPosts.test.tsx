import { configureStore } from "@reduxjs/toolkit";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { message } from "antd";
import React from "react";
import { act } from "react-dom/test-utils";
import { Provider } from "react-redux";

import { BlogPost } from "../../data/data";
import {
  apiSlice,
  useDeleteBlogPostMutation,
  useGetBlogPostsQuery,
} from "../../redux/data-access/apiSlice";
import { UserBlogPosts } from "./UserBlogPosts";

jest.mock("../../redux/data-access/apiSlice", () => ({
  ...jest.requireActual("../../redux/data-access/apiSlice"),
  useGetBlogPostsQuery: jest.fn(),
  useDeleteBlogPostMutation: jest.fn(),
}));

jest.mock("antd", () => ({
  ...jest.requireActual("antd"),
  message: {
    error: jest.fn(),
    success: jest.fn(),
  },
}));

const createTestStore = () =>
  configureStore({
    reducer: {
      [apiSlice.reducerPath]: apiSlice.reducer,
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().concat(apiSlice.middleware),
  });

describe("UserBlogPosts Component", () => {
  let store: ReturnType<typeof createTestStore>;

  const mockBlogPosts: BlogPost[] = [
    {
      id: "1",
      title: "Test Blog Post 1",
      body: "Test content 1",
      userId: 1,
      datePosted: "2023-01-01T12:00:00Z",
    },
    {
      id: "2",
      title: "Test Blog Post 2",
      body: "Test content 2",
      userId: 1,
      datePosted: "2023-01-02T12:00:00Z",
    },
  ];

  const mockOnBlogPostClick = jest.fn();
  const mockDeleteBlogPost = jest.fn();
  const mockUnwrap = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    store = createTestStore();

    mockUnwrap.mockResolvedValue({ id: "1" });
    mockDeleteBlogPost.mockReturnValue({ unwrap: mockUnwrap });

    (useGetBlogPostsQuery as jest.Mock).mockReturnValue({
      data: mockBlogPosts,
      isLoading: false,
      error: undefined,
    });

    (useDeleteBlogPostMutation as jest.Mock).mockReturnValue([
      mockDeleteBlogPost,
      { isLoading: false },
    ]);
  });

  const renderComponent = () =>
    render(
      <Provider store={store}>
        <UserBlogPosts onBlogPostClick={mockOnBlogPostClick} userId={1} />
      </Provider>,
    );

  it("renders loading state initially", async () => {
    (useGetBlogPostsQuery as jest.Mock).mockReturnValue({
      data: undefined,
      isLoading: true,
      error: undefined,
    });

    await act(async () => {
      renderComponent();
    });

    const loadingSpinner = screen.queryByTestId("loading-spinner");
    expect(loadingSpinner).toBeInTheDocument();
  });

  it("fetches and displays user blog posts", async () => {
    await act(async () => {
      renderComponent();
    });

    await waitFor(() => {
      expect(screen.getByText("Test Blog Post 1")).toBeInTheDocument();
      expect(screen.getByText("Test Blog Post 2")).toBeInTheDocument();
      expect(screen.getByText("Jan 01, 2023")).toBeInTheDocument();
      expect(screen.getByText("Jan 02, 2023")).toBeInTheDocument();
    });
  });

  it("displays a message when no blog posts are found", async () => {
    (useGetBlogPostsQuery as jest.Mock).mockReturnValue({
      data: [],
      isLoading: false,
      error: undefined,
    });

    await act(async () => {
      renderComponent();
    });

    await waitFor(() => {
      expect(
        screen.getByText("No blog posts found for this user."),
      ).toBeInTheDocument();
    });
  });

  it("calls onBlogPostClick when a blog post title is clicked", async () => {
    await act(async () => {
      renderComponent();
    });

    await waitFor(() => {
      expect(screen.getByText("Test Blog Post 1")).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText("Test Blog Post 1"));
    expect(mockOnBlogPostClick).toHaveBeenCalledWith("1");
  });

  it("deletes a blog post when delete button is clicked", async () => {
    mockUnwrap.mockResolvedValue({ id: "1" });

    renderComponent();

    await waitFor(() => {
      expect(screen.getByText("Test Blog Post 1")).toBeInTheDocument();
    });

    const deleteButtons = screen.getAllByLabelText("Delete blog post");
    expect(deleteButtons.length).toBeGreaterThan(0);
    fireEvent.click(deleteButtons[0]);

    const yesButton = screen.getByText("Yes");
    expect(yesButton).toBeInTheDocument();
    fireEvent.click(yesButton);

    await waitFor(() => {
      expect(mockDeleteBlogPost).toHaveBeenCalledWith("1");
      expect(mockUnwrap).toHaveBeenCalled();
      expect(message.success).toHaveBeenCalledWith(
        "Blog post deleted successfully",
      );
    });
  });

  it("shows error message when blog post deletion fails", async () => {
    mockUnwrap.mockRejectedValue(new Error("Failed to delete"));

    renderComponent();

    await waitFor(() => {
      expect(screen.getByText("Test Blog Post 1")).toBeInTheDocument();
    });

    const deleteButtons = screen.getAllByLabelText("Delete blog post");
    expect(deleteButtons.length).toBeGreaterThan(0);
    fireEvent.click(deleteButtons[0]);

    const yesButton = screen.getByText("Yes");
    expect(yesButton).toBeInTheDocument();
    fireEvent.click(yesButton);

    await waitFor(() => {
      expect(mockDeleteBlogPost).toHaveBeenCalledWith("1");
      expect(mockUnwrap).toHaveBeenCalled();
      expect(message.error).toHaveBeenCalledWith("Failed to delete blog post");
    });
  });

  it("shows error message when fetching blog posts fails", async () => {
    (useGetBlogPostsQuery as jest.Mock).mockReturnValue({
      data: undefined,
      isLoading: false,
      error: { message: "Failed to fetch" },
    });

    await act(async () => {
      renderComponent();
    });

    expect(message.error).toHaveBeenCalledWith("Failed to fetch blog posts");
  });

  it("filters blog posts for the current user", async () => {
    const mixedBlogPosts = [
      ...mockBlogPosts,
      {
        id: "3",
        title: "Another User's Post",
        body: "This belongs to another user",
        userId: 2,
        datePosted: "2023-01-03T12:00:00Z",
      },
    ];

    (useGetBlogPostsQuery as jest.Mock).mockReturnValue({
      data: mixedBlogPosts,
      isLoading: false,
      error: undefined,
    });

    await act(async () => {
      renderComponent();
    });

    await waitFor(() => {
      expect(screen.getByText("Test Blog Post 1")).toBeInTheDocument();
      expect(screen.getByText("Test Blog Post 2")).toBeInTheDocument();
      expect(screen.queryByText("Another User's Post")).not.toBeInTheDocument();
    });
  });
});
