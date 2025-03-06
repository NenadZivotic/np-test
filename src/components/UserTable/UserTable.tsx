import { Input, message, Table } from "antd";
import React, { useMemo, useState } from "react";

import { User } from "../../data/data";
import { usePagination } from "../../hooks/usePagination";
import { useDeleteUserMutation } from "../../redux/data-access/apiSlice";
import { getTableColumns } from "./config/columns";
import { UserBlogPosts } from "./UserBlogPosts";
import { filterUsers } from "./utils/filterUsers";

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
  const [searchTerm, setSearchTerm] = useState("");

  const filteredUsers = useMemo(
    () => filterUsers(users, searchTerm),
    [searchTerm, users],
  );

  const { pagination, handlePaginationChange } = usePagination({
    data: filteredUsers,
    defaultPageSize: 10,
    storageKey: "user-table-pagination",
  });

  const [deleteUser] = useDeleteUserMutation();
  const handleDeleteUser = async (userId: number) => {
    try {
      await deleteUser(userId).unwrap();
      message.success("User deleted successfully");
    } catch (error) {
      message.error("Failed to delete user");
    }
  };

  const handleSearch = (value: string) => {
    setSearchTerm(value.toLowerCase());
  };

  return (
    <>
      <Input
        allowClear={true}
        onChange={(event) => {
          handleSearch(event.target.value);
        }}
        placeholder="Search users..."
        style={{ marginBottom: 16, width: 300 }}
        value={searchTerm}
      />
      <Table
        columns={getTableColumns(handleDeleteUser)}
        dataSource={filteredUsers}
        expandable={{
          expandedRowRender: (record) => (
            <UserBlogPosts
              onBlogPostClick={onBlogPostClick}
              userId={record.id}
            />
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
          style: { cursor: "pointer" },
          onClick: (event) => {
            event.stopPropagation();
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
        })}
        pagination={pagination}
        rowKey={(record) => String(record.id)}
      />
    </>
  );
};
