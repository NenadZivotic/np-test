import { DeleteOutlined } from "@ant-design/icons";
import { Button, message, Popconfirm, Table } from "antd";
import { ColumnsType } from "antd/es/table";
import React, { useState } from "react";

import { User } from "../../data/data";
import { usePagination } from "../../hooks/usePagination";
import { useDeleteUserMutation } from "../../redux/data-access/apiSlice";
import { UserBlogPosts } from "./UserBlogPosts";

interface UserTableProps {
  users: User[];
  loading: boolean;
  onBlogPostClick: (blogPostId: string) => void;
}

export const UserTable = ({
  users,
  loading,
  onBlogPostClick,
}: UserTableProps) => {
  const [expandedRowKeys, setExpandedRowKeys] = useState<string[]>([]);
  const { pagination, handlePaginationChange } = usePagination({
    data: users,
    storageKey: "user-table-pagination",
  });

  const [deleteUser] = useDeleteUserMutation();

  const columns: ColumnsType<User> = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
      sorter: (a, b) => a.id - b.id,
      width: "10%",
    },
    {
      title: "First Name",
      dataIndex: "first_name",
      key: "first_name",
      sorter: (a, b) => a.first_name.localeCompare(b.first_name),
    },
    {
      title: "Last Name",
      dataIndex: "last_name",
      key: "last_name",
      sorter: (a, b) => a.last_name.localeCompare(b.last_name),
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      sorter: (a, b) => a.email.localeCompare(b.email),
    },
    {
      title: "Gender",
      dataIndex: "gender",
      key: "gender",
      width: "15%",
      sorter: (a, b) => a.gender.localeCompare(b.gender),
    },
    {
      title: "Actions",
      key: "actions",
      width: "10%",
      render: (_, record) => (
        <Popconfirm
          cancelText="No"
          description="Are you sure you want to delete this user? This will also delete all their blog posts."
          okText="Yes"
          onConfirm={(event) => {
            event?.stopPropagation();
            handleDeleteUser(record.id);
          }}
          title="Delete User"
        >
          <Button
            aria-label="Delete user"
            danger
            icon={<DeleteOutlined />}
            onClick={(event) => event.stopPropagation()}
            type="text"
          />
        </Popconfirm>
      ),
    },
  ];

  const handleDeleteUser = async (userId: number) => {
    try {
      await deleteUser(userId).unwrap();
      message.success("User deleted successfully");
    } catch (error) {
      message.error("Failed to delete user");
    }
  };

  return (
    <Table
      columns={columns}
      dataSource={users}
      expandable={{
        expandedRowRender: (record) => (
          <UserBlogPosts onBlogPostClick={onBlogPostClick} userId={record.id} />
        ),
        expandedRowKeys,
        onExpand: (expanded, record) => {
          setExpandedRowKeys(expanded ? [record.id.toString()] : []);
        },
        rowExpandable: () => true,
        showExpandColumn: false,
      }}
      loading={loading}
      onChange={handlePaginationChange}
      onRow={(record) => ({
        onClick: (event) => {
          const target = event.target as HTMLElement;
          if (
            target.closest("button") ||
            target.closest("a") ||
            target.closest(".ant-dropdown")
          ) {
            return;
          }

          const recordKey = String(record.id);
          const currentExpandedRowKeys = [...expandedRowKeys];
          const index = currentExpandedRowKeys.indexOf(recordKey);

          if (index > -1) {
            currentExpandedRowKeys.splice(index, 1);
          } else {
            currentExpandedRowKeys.push(recordKey);
          }

          setExpandedRowKeys(currentExpandedRowKeys);
        },
        style: {
          cursor: "pointer",
          transition: "background-color 0.3s",
        },
      })}
      pagination={pagination}
      rowKey={(record) => String(record.id)}
    />
  );
};
