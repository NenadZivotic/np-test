import { ArrowLeftOutlined, DeleteOutlined } from "@ant-design/icons";
import { Button, Card, message, Popconfirm, Spin, Typography } from "antd";
import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import styled from "styled-components";

import { BlogPost as BlogPostType } from "../../data/data";
import {
  useDeleteBlogPostMutation,
  useGetBlogPostsQuery,
} from "../../redux/data-access/apiSlice";
import { formatDate } from "../../utils/helperUtils";
import { EditBlogPost } from "./EditBlogPost";

const { Title, Text, Paragraph } = Typography;

const StyledCard = styled(Card)`
  margin-top: 20px;
  max-width: 800px;
`;

const BackButton = styled(Button)`
  margin-right: 8px;
`;

const DateText = styled(Text)`
  display: block;
  margin-bottom: 20px;
  font-style: italic;
  color: rgba(0, 0, 0, 0.45);
`;

const ButtonContainer = styled.div`
  display: flex;
  margin-bottom: 20px;
`;

export const BlogPost = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { data: blogPosts = [], isLoading } = useGetBlogPostsQuery();

  const blogPost = id
    ? blogPosts.find((post: BlogPostType) => post.id === id)
    : null;

  const [deleteBlogPost] = useDeleteBlogPostMutation();

  const handleBack = () => {
    navigate("/");
  };

  const handleDelete = async () => {
    if (!id) {
      return;
    }

    try {
      await deleteBlogPost(id).unwrap();
      message.success("Blog post deleted successfully");
      navigate("/");
    } catch (error) {
      message.error("Failed to delete blog post");
    }
  };

  if (isLoading) {
    return (
      <div
        data-testid="loading-spinner"
        style={{ display: "flex", justifyContent: "center", padding: "50px" }}
      >
        <Spin size="large" />
      </div>
    );
  }

  if (!blogPost) {
    return (
      <div>
        <BackButton
          icon={<ArrowLeftOutlined />}
          onClick={handleBack}
          type="primary"
        >
          Back to Users
        </BackButton>
        <Typography.Title level={4}>Blog post not found</Typography.Title>
      </div>
    );
  }

  return (
    <div>
      <ButtonContainer>
        <BackButton
          icon={<ArrowLeftOutlined />}
          onClick={handleBack}
          type="primary"
        >
          Back to Users
        </BackButton>
        <EditBlogPost blogPost={blogPost} />
        <Popconfirm
          cancelText="No"
          description="Are you sure you want to delete this blog post?"
          okText="Yes"
          onConfirm={handleDelete}
          title="Delete Blog Post"
        >
          <Button danger icon={<DeleteOutlined />} style={{ marginLeft: 8 }}>
            Delete Post
          </Button>
        </Popconfirm>
      </ButtonContainer>

      <StyledCard>
        <Title level={3}>{blogPost.title}</Title>
        <DateText>Posted on {formatDate(blogPost.datePosted)}</DateText>
        <Paragraph>{blogPost.body}</Paragraph>
      </StyledCard>
    </div>
  );
};
