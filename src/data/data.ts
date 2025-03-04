// do NOT modify this file
// do NOT modify this file
// do NOT modify this file
// do NOT modify this file
// do NOT modify this file
// do NOT modify this file
// do NOT modify this file
// do NOT modify this file

import blogPosts from "./blog-posts.json";
import users from "./users.json";

export type User = typeof users[0];
export type BlogPost = typeof blogPosts[0];

const randomDelayPromise = <T>(data: T) => {
  const delay = Math.floor(Math.random() * 400) + 100;
  return new Promise<T>((resolve) => setTimeout(() => resolve(data), delay));
};

const db = {
  users,
  blogPosts,
};

export const getUsers = () => randomDelayPromise(db.users);

export const getMembers = () => randomDelayPromise(db.blogPosts);

export const deleteUser = (idToDelete: number): Promise<true> => {
  db.users = db.users.filter(({ id }) => id !== idToDelete);

  return randomDelayPromise(true);
};

export const deleteBlogPost = (idToDelete: string): Promise<true> => {
  db.blogPosts = db.blogPosts.filter(({ id }) => id !== idToDelete);

  return randomDelayPromise(true);
};

export const addBlogPost = (
  newBlogPost: typeof blogPosts[0],
): Promise<BlogPost> => {
  db.blogPosts = [newBlogPost, ...db.blogPosts];

  if (Math.random() < 0.2) {
    throw new Error("something went wrong!");
  }

  return randomDelayPromise(newBlogPost);
};

export const editBlogPost = (
  postId: string,
  data: Omit<typeof blogPosts[0], "id">,
): Promise<BlogPost> => {
  db.blogPosts = db.blogPosts.map((post) =>
    post.id === postId ? { id: postId, ...data } : post,
  );

  return randomDelayPromise({ id: postId, ...data });
};
