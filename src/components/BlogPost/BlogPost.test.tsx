import { configureStore } from "@reduxjs/toolkit";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import React from "react";
import { act } from "react-dom/test-utils";
import { Provider } from "react-redux";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import * as reactRouterDom from "react-router-dom";

import {
  apiSlice,
  useDeleteBlogPostMutation,
  useGetBlogPostsQuery,
} from "../../redux/data-access/apiSlice";
import { formatDate } from "../../utils/helperUtils";
import { BlogPost } from "./BlogPost";

jest.mock("../../redux/data-access/apiSlice", () => ({
  ...jest.requireActual("../../redux/data-access/apiSlice"),
  useGetBlogPostsQuery: jest.fn(),
  useDeleteBlogPostMutation: jest.fn(),
}));

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useParams: jest.fn(),
  useNavigate: jest.fn(),
}));

const mockBlogPost = {
  id: "test-blog-1",
  title: "Test Blog Post",
  body: "This is a test blog post content.",
  userId: 1,
  datePosted: new Date("2023-01-01T00:00:00Z").toISOString(),
};

const createTestStore = () =>
  configureStore({
    reducer: {
      [apiSlice.reducerPath]: apiSlice.reducer,
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().concat(apiSlice.middleware),
  });

describe("BlogPost Component", () => {
  let store: ReturnType<typeof createTestStore>;

  beforeEach(() => {
    jest.clearAllMocks();
    store = createTestStore();

    (useGetBlogPostsQuery as jest.Mock).mockReturnValue({
      data: [mockBlogPost],
      isLoading: false,
    });

    (useDeleteBlogPostMutation as jest.Mock).mockReturnValue([
      jest.fn().mockResolvedValue({ data: true }),
      { isLoading: false },
    ]);

    (reactRouterDom.useParams as jest.Mock).mockReturnValue({
      id: "test-blog-1",
    });
    (reactRouterDom.useNavigate as jest.Mock).mockReturnValue(jest.fn());
  });

  const renderComponent = () =>
    render(
      <Provider store={store}>
        <MemoryRouter initialEntries={[`/blog/test-blog-1`]}>
          <Routes>
            <Route element={<BlogPost />} path="/blog/:id" />
          </Routes>
        </MemoryRouter>
      </Provider>,
    );

  test("renders blog post details correctly", async () => {
    await act(async () => {
      renderComponent();
    });

    await waitFor(() => {
      const titleElement = screen.getByRole("heading", {
        name: "Test Blog Post",
        level: 3,
      });
      expect(titleElement).toBeInTheDocument();

      const bodyElement = screen.getByText("This is a test blog post content.");
      expect(bodyElement).toBeInTheDocument();

      const dateElement = screen.getByText(
        `Posted on ${formatDate(mockBlogPost.datePosted)}`,
      );
      expect(dateElement).toBeInTheDocument();
    });
  });

  test("navigates back when back button is clicked", async () => {
    const mockNavigate = jest.fn();
    (reactRouterDom.useNavigate as jest.Mock).mockReturnValue(mockNavigate);

    await act(async () => {
      renderComponent();
    });

    await waitFor(() => {
      const titleElement = screen.getByRole("heading", {
        name: "Test Blog Post",
        level: 3,
      });
      expect(titleElement).toBeInTheDocument();
    });

    const backButton = screen.getByRole("button", { name: /back to users/i });
    fireEvent.click(backButton);

    expect(mockNavigate).toHaveBeenCalledWith("/");
  });

  test("deletes blog post", async () => {
    const mockNavigate = jest.fn();
    (reactRouterDom.useNavigate as jest.Mock).mockReturnValue(mockNavigate);

    const mockDeleteBlogPost = jest.fn().mockReturnValue({
      unwrap: jest.fn().mockResolvedValue({ data: true }),
    });

    (useDeleteBlogPostMutation as jest.Mock).mockReturnValue([
      mockDeleteBlogPost,
      { isLoading: false },
    ]);

    await act(async () => {
      renderComponent();
    });

    await waitFor(() => {
      const titleElement = screen.getByRole("heading", {
        name: "Test Blog Post",
        level: 3,
      });
      expect(titleElement).toBeInTheDocument();
    });

    const deleteButton = screen.getByRole("button", { name: /delete post/i });
    fireEvent.click(deleteButton);

    const confirmDeleteButton = screen.getByRole("button", { name: /yes/i });
    fireEvent.click(confirmDeleteButton);

    await waitFor(() => {
      expect(mockDeleteBlogPost).toHaveBeenCalledWith("test-blog-1");
      expect(mockNavigate).toHaveBeenCalledWith("/");
    });
  });

  test("handles error when fetching blog post", async () => {
    (useGetBlogPostsQuery as jest.Mock).mockReturnValue({
      data: undefined,
      isLoading: false,
      error: new Error("Failed to fetch"),
    });

    await act(async () => {
      renderComponent();
    });

    await waitFor(() => {
      const loadingSpinner = screen.queryByTestId("loading-spinner");
      expect(loadingSpinner).not.toBeInTheDocument();
    });
  });

  test("handles blog post not found", async () => {
    (useGetBlogPostsQuery as jest.Mock).mockReturnValue({
      data: [],
      isLoading: false,
    });

    await act(async () => {
      renderComponent();
    });

    await waitFor(() => {
      const notFoundElement = screen.getByRole("heading", {
        name: /blog post not found/i,
        level: 4,
      });
      expect(notFoundElement).toBeInTheDocument();
    });
  });
});
