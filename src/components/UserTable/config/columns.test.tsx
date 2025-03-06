import { ColumnType } from "antd/es/table";

import { User } from "../../../data/data";
import { getTableColumns } from "./columns";

describe("getTableColumns", () => {
  const mockOnDeleteUser = jest.fn();
  const mockUser: User = {
    id: 1,
    first_name: "John",
    last_name: "Doe",
    email: "john.doe@example.com",
    gender: "Male",
    ip_address: "192.168.1.1",
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should return the correct columns configuration", () => {
    const columns = getTableColumns(mockOnDeleteUser);

    expect(columns).toHaveLength(6);

    const titles = columns.map((column) => column.title);
    expect(titles).toEqual([
      "ID",
      "First Name",
      "Last Name",
      "Email",
      "Gender",
      "Actions",
    ]);

    const dataColumns = columns.filter(
      (column) => "dataIndex" in column,
    ) as ColumnType<User>[];
    expect(dataColumns).toHaveLength(5);

    dataColumns.forEach((column) => {
      expect(column.dataIndex).toBeDefined();
      expect(column.sorter).toBeDefined();
    });

    const dataIndexes = dataColumns.map((column) => column.dataIndex);
    expect(dataIndexes).toEqual([
      "id",
      "first_name",
      "last_name",
      "email",
      "gender",
    ]);
  });

  it("should provide working sorter functions", () => {
    const columns = getTableColumns(mockOnDeleteUser);

    const idColumn = columns.find(
      (column) => "dataIndex" in column && column.dataIndex === "id",
    ) as ColumnType<User>;
    const idSorter = idColumn.sorter as (a: User, b: User) => number;

    expect(
      idSorter({ ...mockUser, id: 1 }, { ...mockUser, id: 2 }),
    ).toBeLessThan(0);
    expect(
      idSorter({ ...mockUser, id: 2 }, { ...mockUser, id: 1 }),
    ).toBeGreaterThan(0);

    const nameColumn = columns.find(
      (column) => "dataIndex" in column && column.dataIndex === "first_name",
    ) as ColumnType<User>;
    const nameSorter = nameColumn.sorter as (a: User, b: User) => number;

    expect(
      nameSorter(
        { ...mockUser, first_name: "Alice" },
        { ...mockUser, first_name: "Bob" },
      ),
    ).toBeLessThan(0);
    expect(
      nameSorter(
        { ...mockUser, first_name: "Bob" },
        { ...mockUser, first_name: "Alice" },
      ),
    ).toBeGreaterThan(0);
  });
});
