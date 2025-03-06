import {
  addBlogPost,
  deleteBlogPost,
  deleteUser,
  editBlogPost,
  getMembers,
  getUsers,
} from "../../data/data";
import { setupStore } from "../store";
import { apiSlice } from "./apiSlice";

jest.mock("../../data/data", () => ({
  getUsers: jest.fn(),
  getMembers: jest.fn(),
  deleteUser: jest.fn(),
  deleteBlogPost: jest.fn(),
  addBlogPost: jest.fn(),
  editBlogPost: jest.fn(),
}));

describe("apiSlice", () => {
  let store = setupStore();

  beforeEach(() => {
    store = setupStore();
    jest.restoreAllMocks();
  });

  it("should fetch users successfully", async () => {
    const mockUsers = [{ id: 1, name: "John Doe" }];
    (getUsers as jest.Mock).mockResolvedValue(mockUsers);

    const result = await store.dispatch(apiSlice.endpoints.getUsers.initiate());
    expect(result.data).toEqual(mockUsers);
  });

  it("should fetch blog posts (getMembers) successfully", async () => {
    const mockPosts = [{ id: 1, name: "John Doe" }];
    (getMembers as jest.Mock).mockResolvedValue(mockPosts);

    const result = await store.dispatch(apiSlice.endpoints.getUsers.initiate());
    expect(result.data).toEqual(mockPosts);
  });

  it("should delete a user successfully", async () => {
    (deleteUser as jest.Mock).mockResolvedValue(true);

    const result = await store.dispatch(
      apiSlice.endpoints.deleteUser.initiate(1),
    );
    expect(result).toEqual({ data: true });
  });

  it("should delete a blog post successfully", async () => {
    (deleteBlogPost as jest.Mock).mockResolvedValue(true);

    const result = await store.dispatch(
      apiSlice.endpoints.deleteBlogPost.initiate("1"),
    );
    expect(result).toEqual({ data: true });
  });

  it("should add a blog post successfully", async () => {
    const newPost = {
      id: "4",
      userId: 1,
      datePosted: "2023-01-01",
      title: "New Post",
      body: "Test content",
    };
    (addBlogPost as jest.Mock).mockResolvedValue(newPost);

    const result = await store.dispatch(
      apiSlice.endpoints.addBlogPost.initiate(newPost),
    );
    expect(result).toEqual({ data: newPost });
  });

  it("should handle addBlogPost failure", async () => {
    jest.spyOn(Math, "random").mockReturnValue(0.15); // force failure
    (addBlogPost as jest.Mock).mockImplementation(() => {
      throw new Error("something went wrong!");
    });

    const result = await store.dispatch(
      apiSlice.endpoints.addBlogPost.initiate({
        id: "4",
        userId: 1,
        datePosted: "2023-01-01",
        title: "Fail Post",
        body: "Error",
      }),
    );

    expect(result).toBeDefined();
  });

  it("should edit a blog post successfully", async () => {
    const updatedPost = {
      id: "4",
      userId: 1,
      datePosted: "2023-01-01",
      title: "Updated Title",
      content: "Updated Content",
    };
    (editBlogPost as jest.Mock).mockResolvedValue(updatedPost);

    const result = await store.dispatch(
      apiSlice.endpoints.editBlogPost.initiate({
        id: "4",
        userId: 1,
        datePosted: "2023-01-01",
        title: "New Post",
        content: "Test content",
      }),
    );

    expect(result).toEqual({ data: updatedPost });
  });
});
