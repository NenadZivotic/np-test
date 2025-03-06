import { DeleteOutlined } from "@ant-design/icons";
import { Button, Popconfirm } from "antd";
import { ColumnsType } from "antd/es/table";
import React from "react";

import { User } from "../../../data/data";

export const getTableColumns = (
  onDeleteUser: (id: number) => void,
): ColumnsType<User> => [
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
          onDeleteUser(record.id);
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
