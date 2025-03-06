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

// define route handler types for better type safety
type RouteHandler = {
  [method: string]: (body?: unknown) => Promise<unknown>;
};

// create a custom base query that uses the data module functions
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
      const routes: Record<string, RouteHandler> = {
        "/users": {
          GET: () => getUsers(),
          DELETE: (id) => deleteUser(id as number),
        },
        "/blogPosts": {
          GET: () => getMembers(),
          POST: (post) => addBlogPost(post as BlogPost),
          DELETE: (id) => deleteBlogPost(id as string),
        },
        "/blogPosts/edit": {
          PUT: (data) => {
            const { id, title, content, datePosted, userId } = data as {
              id: string;
              title: string;
              content: string;
              datePosted: string;
              userId: number;
            };
            return editBlogPost(id, {
              title,
              body: content,
              userId,
              datePosted,
            });
          },
        },
      };

      // get the handler for the requested route and method
      const routeHandlers = routes[url];
      if (!routeHandlers) {
        return { error: { status: 404, data: "Not Found" } };
      }

      const handler = routeHandlers[method];
      if (!handler) {
        return { error: { status: 405, data: "Method Not Allowed" } };
      }

      const result = await handler(body);

      // ensure we always return a valid result
      if (result === undefined) {
        return {
          data: method === "DELETE" ? true : {},
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
