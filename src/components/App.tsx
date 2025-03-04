import React, { useEffect } from "react";
import styled from "styled-components";

import { useAppDispatch } from "../hooks/useAppDispatch";
import { useTypedSelector } from "../hooks/useTypedSelector";
import { fetchUsers, selectUsers } from "../redux/user/userSlice";
import { GlobalStyles } from "./GlobalStyles/GlobalStyles";

const StyledWrapper = styled.div`
  padding: 24px;
`;

export const App = () => {
  const dispatch = useAppDispatch();
  const users = useTypedSelector(selectUsers);
  const subsetOfUsers = users.slice(0, 10); // TODO: Remove this when you have found a better way to not show all users at once

  useEffect(() => {
    dispatch(fetchUsers());
  }, []);

  return (
    <StyledWrapper>
      <GlobalStyles />

      <h1>NaviPartner Tech Test</h1>

      <h2>Create your app here!</h2>
      <p>Let's get you started:</p>
      <table>
        <thead>
          <tr>
            <th>Name</th>
          </tr>
        </thead>
        <tbody>
          {subsetOfUsers.map((user) => (
            <tr key={user.id}>
              <td>{user.first_name}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </StyledWrapper>
  );
};
