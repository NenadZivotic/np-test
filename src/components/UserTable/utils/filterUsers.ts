import { User } from "../../../data/data";

export const filterUsers = (users: User[], searchTerm: string): User[] => {
  if (!searchTerm) {
    return users;
  }

  return users.filter((user) =>
    Object.values(user).some((value) =>
      value
        ?.toString()
        .toLowerCase()
        .includes(searchTerm?.toLowerCase() || ""),
    ),
  );
};
