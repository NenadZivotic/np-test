import { User } from "../../../data/data";
import { filterUsers } from "./filterUsers";

describe("filterUsers", () => {
  const users: User[] = [
    {
      id: 1,
      first_name: "John",
      last_name: "Doe",
      email: "john.doe@example.com",
      gender: "male",
      ip_address: "192.168.0.1",
    },
    {
      id: 2,
      first_name: "Jane",
      last_name: "Smith",
      email: "jane.smith@example.com",
      gender: "female",
      ip_address: "192.168.0.2",
    },
    {
      id: 3,
      first_name: "Alice",
      last_name: "Johnson",
      email: "alice.johnson@example.com",
      gender: "female",
      ip_address: "192.168.0.3",
    },
  ];

  it("should return all users when searchTerm is empty", () => {
    const result = filterUsers(users, "");
    expect(result).toEqual(users);
  });

  it("should return users that match the searchTerm in any property (case-insensitive)", () => {
    const result = filterUsers(users, "john");
    expect(result).toEqual([
      {
        id: 1,
        first_name: "John",
        last_name: "Doe",
        email: "john.doe@example.com",
        gender: "male",
        ip_address: "192.168.0.1",
      },
      {
        id: 3,
        first_name: "Alice",
        last_name: "Johnson",
        email: "alice.johnson@example.com",
        gender: "female",
        ip_address: "192.168.0.3",
      },
    ]);
  });

  it("should return users that match the searchTerm in the name", () => {
    const result = filterUsers(users, "Jane");
    expect(result).toEqual([
      {
        id: 2,
        first_name: "Jane",
        last_name: "Smith",
        email: "jane.smith@example.com",
        gender: "female",
        ip_address: "192.168.0.2",
      },
    ]);
  });

  it("should return users that match the searchTerm in the email", () => {
    const result = filterUsers(users, "jane.smith@example.com");
    expect(result).toEqual([
      {
        id: 2,
        first_name: "Jane",
        last_name: "Smith",
        email: "jane.smith@example.com",
        gender: "female",
        ip_address: "192.168.0.2",
      },
    ]);
  });

  it("should return an empty array if no users match the searchTerm", () => {
    const result = filterUsers(users, "nonexistent");
    expect(result).toEqual([]);
  });

  it("should handle searchTerm with special characters", () => {
    const result = filterUsers(users, "john.doe");
    expect(result).toEqual([
      {
        id: 1,
        first_name: "John",
        last_name: "Doe",
        email: "john.doe@example.com",
        gender: "male",
        ip_address: "192.168.0.1",
      },
    ]);
  });

  it("should return all users if searchTerm is undefined", () => {
    const result = filterUsers(users, undefined as unknown as string);
    expect(result).toEqual(users);
  });
});
