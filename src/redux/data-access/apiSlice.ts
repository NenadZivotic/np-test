import { createApi } from "@reduxjs/toolkit/query/react";

import {
  addBlogPost,
  BlogPost,
  deleteBlogPost,
  deleteUser,
  editBlogPost,
  getMembers,
  getUsers,
  User,
} from "../../data/data";

// create a custom base query that uses the data module functions
// this allows us to use RTK Query with the existing data module
const dataModuleBaseQuery =
  () =>
  async ({
    url,
    method,
    body,
  }: {
    url: string;
    method: string;
    body?: unknown;
  }) => {
    try {
      let result;

      // route the request to the appropriate data module function
      switch (url) {
        case "/users":
          if (method === "GET") {
            result = await getUsers();
          } else if (method === "DELETE" && body) {
            result = await deleteUser(body as number);
          }
          break;
        case "/blogPosts":
          if (method === "GET") {
            result = await getMembers();
          } else if (method === "POST" && body) {
            result = await addBlogPost(body as BlogPost);
          } else if (method === "DELETE" && body) {
            result = await deleteBlogPost(body as string);
          }
          break;
        case "/blogPosts/edit":
          if (method === "PUT" && body) {
            const { id, title, content, datePosted, userId } = body as {
              id: string;
              title: string;
              content: string;
              datePosted: string;
              userId: number;
            };
            result = await editBlogPost(id, {
              title,
              body: content,
              userId,
              datePosted,
            });
          }
          break;
        default:
          return {
            error: { status: 404, data: "Not Found" },
          };
      }

      return { data: result };
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error occurred";

      return {
        error: {
          status: 500,
          data: errorMessage,
        },
      };
    }
  };

export const apiSlice = createApi({
  reducerPath: "api",
  baseQuery: dataModuleBaseQuery(),
  tagTypes: ["User", "BlogPost"],
  endpoints: (builder) => ({
    // users endpoints
    getUsers: builder.query<User[], void>({
      query: () => ({ url: "/users", method: "GET" }),
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: "User" as const, id })),
              { type: "User", id: "LIST" },
            ]
          : [{ type: "User", id: "LIST" }],
    }),

    deleteUser: builder.mutation<boolean, number>({
      query: (id) => ({
        url: "/users",
        method: "DELETE",
        body: id,
      }),
      invalidatesTags: () => [{ type: "User", id: "LIST" }],
    }),

    // blog posts endpoints
    getBlogPosts: builder.query<BlogPost[], void>({
      query: () => ({ url: "/blogPosts", method: "GET" }),
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: "BlogPost" as const, id })),
              { type: "BlogPost", id: "LIST" },
            ]
          : [{ type: "BlogPost", id: "LIST" }],
    }),

    addBlogPost: builder.mutation<BlogPost, BlogPost>({
      query: (post) => ({
        url: "/blogPosts",
        method: "POST",
        body: post,
      }),
      invalidatesTags: [{ type: "BlogPost", id: "LIST" }],
    }),

    deleteBlogPost: builder.mutation<boolean, string>({
      query: (id) => ({
        url: "/blogPosts",
        method: "DELETE",
        body: id,
      }),
      invalidatesTags: () => [{ type: "BlogPost", id: "LIST" }],
    }),

    editBlogPost: builder.mutation<
      BlogPost,
      {
        id: string;
        title: string;
        content: string;
        datePosted: string;
        userId: number;
      }
    >({
      query: (post) => ({
        url: "/blogPosts/edit",
        method: "PUT",
        body: post,
      }),
      invalidatesTags: (_, __, { id }) => [{ type: "BlogPost", id }],
    }),
  }),
});

export const {
  useGetUsersQuery,
  useDeleteUserMutation,
  useGetBlogPostsQuery,
  useAddBlogPostMutation,
  useDeleteBlogPostMutation,
  useEditBlogPostMutation,
} = apiSlice;
