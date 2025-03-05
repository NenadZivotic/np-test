import { EditOutlined } from "@ant-design/icons";
import { Button, Form, Input, message, Modal } from "antd";
import React, { useState } from "react";

import { BlogPost } from "../../data/data";
import { useEditBlogPostMutation } from "../../redux/data-access/apiSlice";

interface EditBlogPostProps {
  blogPost: BlogPost;
}

export const EditBlogPost = ({ blogPost }: EditBlogPostProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm();

  const [editBlogPost, { isLoading }] = useEditBlogPostMutation();

  const showModal = () => {
    form.setFieldsValue({
      title: blogPost.title,
      body: blogPost.body,
    });
    setIsModalOpen(true);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();

      await editBlogPost({
        id: blogPost.id,
        title: values.title,
        content: values.body,
        datePosted: blogPost.datePosted,
        userId: blogPost.userId,
      }).unwrap();

      message.success("Blog post updated successfully");
      setIsModalOpen(false);
    } catch (error) {
      if (error instanceof Error) {
        message.error(`Failed to update blog post: ${error.message}`);
      } else {
        message.error("Failed to update blog post");
      }
    }
  };

  return (
    <>
      <Button
        icon={<EditOutlined />}
        onClick={showModal}
        style={{ marginLeft: 8 }}
        type="primary"
      >
        Edit Post
      </Button>

      <Modal
        footer={[
          <Button key="cancel" onClick={handleCancel}>
            Cancel
          </Button>,
          <Button
            key="submit"
            loading={isLoading}
            onClick={handleSubmit}
            type="primary"
          >
            Save Changes
          </Button>,
        ]}
        onCancel={handleCancel}
        open={isModalOpen}
        title="Edit Blog Post"
        width={700}
      >
        <Form
          form={form}
          initialValues={{
            title: blogPost.title,
            body: blogPost.body,
          }}
          layout="vertical"
        >
          <Form.Item
            label="Title"
            name="title"
            rules={[
              { required: true, message: "Please enter the blog post title" },
            ]}
          >
            <Input.TextArea />
          </Form.Item>

          <Form.Item
            label="Content"
            name="body"
            rules={[
              { required: true, message: "Please enter the blog post content" },
            ]}
          >
            <Input.TextArea rows={10} />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};
