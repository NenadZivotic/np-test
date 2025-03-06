import { getUsers } from "../../data/data";
import { setupStore } from "../store";
import userReducer, { fetchUsers, removeUser, UserState } from "./userSlice";

jest.mock("../../data/data", () => ({
  getUsers: jest.fn(),
}));

describe("userSlice", () => {
  let store = setupStore();

  beforeEach(() => {
    store = setupStore();
  });

  it("should return the initial state", () => {
    expect(userReducer(undefined, { type: undefined })).toEqual({
      userList: [],
    });
  });

  it("should remove a user by id", () => {
    const initialState: UserState = {
      userList: [
        {
          id: 1,
          first_name: "John Doe",
          last_name: "Doe",
          email: "john@example.com",
          gender: "Male",
          ip_address: "127.0.0.1",
        },
        {
          id: 2,
          first_name: "Jane Doe",
          last_name: "Doe",
          email: "jane@example.com",
          gender: "Female",
          ip_address: "0.0.0.0",
        },
      ],
    };
    const nextState = userReducer(initialState, removeUser(1));

    expect(nextState.userList).toHaveLength(1);
    expect(nextState.userList[0].id).toBe(2);
  });

  it("should fetch users and update state", async () => {
    const mockUsers = [{ id: 1, name: "John Doe" }];
    (getUsers as jest.Mock).mockResolvedValue(mockUsers);

    await store.dispatch(fetchUsers());

    const state = store.getState().user;
    expect(state.userList).toEqual(mockUsers);
  });
});
