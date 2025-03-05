import { PlusOutlined } from "@ant-design/icons";
import { Button, Form, Input, message, Modal } from "antd";
import React, { useState } from "react";

import { useAddBlogPostMutation } from "../../redux/data-access/apiSlice";

interface AddBlogPostProps {
  userId: number;
}

export const AddBlogPost = ({ userId }: AddBlogPostProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm();

  const [addBlogPost, { isLoading }] = useAddBlogPostMutation();

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    form.resetFields();
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();

      const newId = `blog-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

      const newBlogPost = {
        id: newId,
        title: values.title,
        body: values.body,
        userId,
        datePosted: new Date().toISOString(),
      };

      await addBlogPost(newBlogPost).unwrap();
      message.success("Blog post added successfully");
      setIsModalOpen(false);
      form.resetFields();
    } catch (error) {
      if (error instanceof Error) {
        message.error(`Failed to add blog post: ${error.message}`);
      } else {
        message.error("Failed to add blog post");
      }
    }
  };

  return (
    <>
      <Button icon={<PlusOutlined />} onClick={showModal} type="primary">
        Add Blog Post
      </Button>
      <Modal
        confirmLoading={isLoading}
        okText="Add Post"
        onCancel={handleCancel}
        onOk={handleSubmit}
        open={isModalOpen}
        title="Add New Blog Post"
      >
        <Form form={form} layout="vertical" name="addBlogPostForm">
          <Form.Item
            label="Title"
            name="title"
            rules={[
              { required: true, message: "Please enter the blog post title" },
              {
                max: 100,
                message: "Title cannot be longer than 100 characters",
              },
            ]}
          >
            <Input.TextArea placeholder="Enter blog post title" />
          </Form.Item>
          <Form.Item
            label="Content"
            name="body"
            rules={[
              { required: true, message: "Please enter the blog post content" },
            ]}
          >
            <Input.TextArea
              maxLength={2000}
              placeholder="Enter blog post content"
              rows={6}
              showCount
            />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};
