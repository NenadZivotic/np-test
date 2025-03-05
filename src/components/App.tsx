import { ConfigProvider, Typography } from "antd";
import React from "react";
import { Route, Routes } from "react-router-dom";
import styled from "styled-components";

import { UsersPage } from "../pages/UsersPage";
import { BlogPost } from "./BlogPost/BlogPost";
import { GlobalStyles } from "./GlobalStyles/GlobalStyles";

const StyledWrapper = styled.div`
  padding: 24px;
  max-width: 1200px;
  margin: 0 auto;
`;

const { Title } = Typography;

export const App = () => (
  <ConfigProvider>
    <StyledWrapper>
      <GlobalStyles />
      <Title level={2}>NaviPartner Tech Test</Title>
      <Title level={4}>User Management System</Title>

      <Routes>
        <Route element={<UsersPage />} path="/" />
        <Route element={<BlogPost />} path="/blog/:id" />
      </Routes>
    </StyledWrapper>
  </ConfigProvider>
);
