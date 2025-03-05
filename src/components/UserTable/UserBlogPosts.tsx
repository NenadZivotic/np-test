import { DeleteOutlined } from "@ant-design/icons";
import { Button, message, Popconfirm, Spin, Table, Typography } from "antd";
import type { ColumnsType } from "antd/es/table";
import React, { useEffect } from "react";
import styled from "styled-components";

import { BlogPost as BlogPostType } from "../../data/data";
import {
  useDeleteBlogPostMutation,
  useGetBlogPostsQuery,
} from "../../redux/data-access/apiSlice";
import { formatDate } from "../../utils/helperUtils";
import { AddBlogPost } from "../BlogPost/AddBlogPost";

const StyledLoadingContainer = styled.div`
  padding: 20px;
  text-align: center;
`;

const StyledUserBlogPosts = styled.div`
  display: flex;
  flex-direction: column;
`;

const StyledUserBlogPostsHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
`;

interface UserBlogPostsProps {
  userId: number;
  onBlogPostClick: (blogPostId: string) => void;
}

export const UserBlogPosts = ({
  userId,
  onBlogPostClick,
}: UserBlogPostsProps) => {
  // use RTK Query to fetch blog posts
  const { data: allPosts = [], isLoading, error } = useGetBlogPostsQuery();

  // show error message if fetching fails
  useEffect(() => {
    if (error) {
      message.error("Failed to fetch blog posts");
    }
  }, [error]);

  // filter posts for the current user
  const blogPosts = allPosts.filter(
    (post: BlogPostType) => post.userId === userId,
  );

  // use RTK Query mutation for deleting blog posts
  const [deleteBlogPost] = useDeleteBlogPostMutation();

  const handleDeleteBlogPost = async (blogPostId: string) => {
    try {
      await deleteBlogPost(blogPostId).unwrap();
      message.success("Blog post deleted successfully");
    } catch (deleteError) {
      message.error("Failed to delete blog post");
    }
  };

  const columns: ColumnsType<BlogPostType> = [
    {
      title: "Title",
      dataIndex: "title",
      key: "title",
      ellipsis: true,
      width: "60%",
      render: (text, record) => (
        <Typography.Text
          onClick={() => onBlogPostClick(record.id)}
          style={{ cursor: "pointer" }}
        >
          {text}
        </Typography.Text>
      ),
    },
    {
      title: "Date Posted",
      dataIndex: "datePosted",
      key: "datePosted",
      render: (date: string) => formatDate(date),
      width: "20%",
    },
    {
      title: "Actions",
      key: "actions",
      width: "10%",
      render: (_, record) => (
        <Popconfirm
          cancelText="No"
          description="Are you sure you want to delete this blog post?"
          okText="Yes"
          onConfirm={() => handleDeleteBlogPost(record.id)}
          title="Delete Blog Post"
        >
          <Button
            aria-label="Delete blog post"
            danger
            icon={<DeleteOutlined />}
            type="text"
          />
        </Popconfirm>
      ),
    },
  ];

  if (isLoading) {
    return (
      <StyledLoadingContainer>
        <Spin data-testid="loading-spinner" size="large" />
      </StyledLoadingContainer>
    );
  }

  return (
    <StyledUserBlogPosts>
      <StyledUserBlogPostsHeader>
        <Typography.Title level={5} style={{ margin: 0 }}>
          Blog Posts
        </Typography.Title>
        <AddBlogPost userId={userId} />
      </StyledUserBlogPostsHeader>

      {blogPosts.length === 0 ? (
        <Typography.Text>No blog posts found for this user.</Typography.Text>
      ) : (
        <Table
          columns={columns}
          dataSource={blogPosts}
          pagination={false}
          rowKey="id"
          size="small"
        />
      )}
    </StyledUserBlogPosts>
  );
};
