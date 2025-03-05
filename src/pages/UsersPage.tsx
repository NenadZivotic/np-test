import { Spin } from "antd";
import React, { useCallback } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";

import { UserTable } from "../components/UserTable/UserTable";
import { useGetUsersQuery } from "../redux/data-access/apiSlice";

const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 200px;
`;

export const UsersPage = () => {
  const navigate = useNavigate();

  const { data: users = [], isFetching } = useGetUsersQuery();

  const handleBlogPostClick = useCallback(
    (blogPostId: string) => {
      navigate(`/blog/${blogPostId}`);
    },
    [navigate],
  );

  return (
    <>
      {isFetching ? (
        <LoadingContainer>
          <Spin size="large" />
        </LoadingContainer>
      ) : (
        <UserTable
          loading={isFetching}
          onBlogPostClick={handleBlogPostClick}
          users={users}
        />
      )}
    </>
  );
};
