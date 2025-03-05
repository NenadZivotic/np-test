import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { message } from "antd";
import React from "react";
import { Provider } from "react-redux";

import { User } from "../../data/data";
import { useDeleteUserMutation } from "../../redux/data-access/apiSlice";
import { setupStore } from "../../redux/store";
import { UserTable } from "./UserTable";

jest.mock("../../redux/data-access/apiSlice", () => ({
  ...jest.requireActual("../../redux/data-access/apiSlice"),
  useDeleteUserMutation: jest.fn(),
}));

jest.mock("./UserBlogPosts", () => ({
  UserBlogPosts: jest.fn(({ userId }) => (
    <div data-testid="mock-user-blog-posts" data-userid={userId} />
  )),
}));

jest.mock("antd", () => ({
  ...jest.requireActual("antd"),
  message: {
    error: jest.fn(),
    success: jest.fn(),
  },
}));

describe("UserTable Component", () => {
  const mockUsers: User[] = [
    {
      id: 1,
      first_name: "John",
      last_name: "Doe",
      email: "john.doe@example.com",
      gender: "Male",
      ip_address: "192.168.1.1",
    },
    {
      id: 2,
      first_name: "Jane",
      last_name: "Smith",
      email: "jane.smith@example.com",
      gender: "Female",
      ip_address: "192.168.1.2",
    },
  ];

  const mockOnBlogPostClick = jest.fn();
  const mockDeleteUser = jest.fn();
  const mockUnwrap = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();

    mockUnwrap.mockResolvedValue({ success: true });
    mockDeleteUser.mockReturnValue({ unwrap: mockUnwrap });
    (useDeleteUserMutation as jest.Mock).mockReturnValue([
      mockDeleteUser,
      { isLoading: false },
    ]);
  });

  const renderWithProvider = (ui: React.ReactElement) => {
    const store = setupStore();
    return render(<Provider store={store}>{ui}</Provider>);
  };

  it("renders user data correctly", () => {
    renderWithProvider(
      <UserTable
        loading={false}
        onBlogPostClick={mockOnBlogPostClick}
        users={mockUsers}
      />,
    );

    expect(screen.getByText("John")).toBeInTheDocument();
    expect(screen.getByText("Doe")).toBeInTheDocument();
    expect(screen.getByText("john.doe@example.com")).toBeInTheDocument();
    expect(screen.getByText("Jane")).toBeInTheDocument();
    expect(screen.getByText("Smith")).toBeInTheDocument();
    expect(screen.getByText("jane.smith@example.com")).toBeInTheDocument();
  });

  it("shows loading state", () => {
    renderWithProvider(
      <UserTable
        loading={true}
        onBlogPostClick={mockOnBlogPostClick}
        users={[]}
      />,
    );

    expect(document.querySelector(".ant-spin")).toBeInTheDocument();
  });

  it("expands row to show blog posts", () => {
    renderWithProvider(
      <UserTable
        loading={false}
        onBlogPostClick={mockOnBlogPostClick}
        users={mockUsers}
      />,
    );

    const firstRow = screen.getByText("John").closest("tr");
    if (firstRow) {
      fireEvent.click(firstRow);
    }

    expect(screen.getByTestId("mock-user-blog-posts")).toBeInTheDocument();
  });

  it("deletes a user when delete button is clicked", async () => {
    renderWithProvider(
      <UserTable
        loading={false}
        onBlogPostClick={mockOnBlogPostClick}
        users={mockUsers}
      />,
    );

    const deleteButtons = screen.getAllByLabelText("Delete user");
    fireEvent.click(deleteButtons[0]);

    fireEvent.click(screen.getByText("Yes"));

    await waitFor(() => {
      expect(mockDeleteUser).toHaveBeenCalledWith(1);
      expect(mockUnwrap).toHaveBeenCalled();
      expect(message.success).toHaveBeenCalledWith("User deleted successfully");
    });
  });

  it("shows error message when user deletion fails", async () => {
    mockUnwrap.mockRejectedValue(new Error("Failed to delete"));

    renderWithProvider(
      <UserTable
        loading={false}
        onBlogPostClick={mockOnBlogPostClick}
        users={mockUsers}
      />,
    );

    const deleteButtons = screen.getAllByLabelText("Delete user");
    fireEvent.click(deleteButtons[0]);

    fireEvent.click(screen.getByText("Yes"));

    await waitFor(() => {
      expect(mockDeleteUser).toHaveBeenCalledWith(1);
      expect(mockUnwrap).toHaveBeenCalled();
      expect(message.error).toHaveBeenCalledWith("Failed to delete user");
    });
  });

  it("updates filteredUsers when users prop changes", () => {
    const { rerender } = renderWithProvider(
      <UserTable
        loading={false}
        onBlogPostClick={mockOnBlogPostClick}
        users={mockUsers}
      />,
    );

    expect(screen.getByText("John")).toBeInTheDocument();
    expect(screen.getByText("Jane")).toBeInTheDocument();

    const updatedUsers = [
      {
        id: 3,
        first_name: "Alice",
        last_name: "Johnson",
        email: "alice.johnson@example.com",
        gender: "Female",
        ip_address: "192.168.1.3",
      },
    ];

    rerender(
      <Provider store={setupStore()}>
        <UserTable
          loading={false}
          onBlogPostClick={mockOnBlogPostClick}
          users={updatedUsers}
        />
      </Provider>,
    );

    expect(screen.queryByText("John")).not.toBeInTheDocument();
    expect(screen.queryByText("Jane")).not.toBeInTheDocument();
    expect(screen.getByText("Alice")).toBeInTheDocument();
    expect(screen.getByText("Johnson")).toBeInTheDocument();
  });

  it("handles pagination changes", () => {
    const manyUsers = Array.from({ length: 15 }, (_, index) => ({
      id: index + 1,
      first_name: `User${index + 1}`,
      last_name: `Last${index + 1}`,
      email: `user${index + 1}@example.com`,
      gender: index % 2 === 0 ? "Male" : "Female",
      ip_address: `192.168.1.${index + 1}`,
    }));

    renderWithProvider(
      <UserTable
        loading={false}
        onBlogPostClick={mockOnBlogPostClick}
        users={manyUsers}
      />,
    );

    expect(screen.getByText("User1")).toBeInTheDocument();
    expect(screen.getByText("User10")).toBeInTheDocument();

    expect(screen.queryByText("User11")).not.toBeInTheDocument();

    const nextPageButton = screen.getByTitle("Next Page");
    fireEvent.click(nextPageButton);

    expect(screen.getByText("User11")).toBeInTheDocument();
    expect(screen.queryByText("User1")).not.toBeInTheDocument();
  });

  it("doesn't expand row when clicking on delete button", () => {
    renderWithProvider(
      <UserTable
        loading={false}
        onBlogPostClick={mockOnBlogPostClick}
        users={mockUsers}
      />,
    );

    const deleteButtons = screen.getAllByLabelText("Delete user");
    fireEvent.click(deleteButtons[0]);

    expect(screen.getByText("Delete User")).toBeInTheDocument();
    expect(
      screen.queryByTestId("mock-user-blog-posts"),
    ).not.toBeInTheDocument();
  });
});
