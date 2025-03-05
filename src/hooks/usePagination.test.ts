import { act, renderHook } from "@testing-library/react";
import type { TablePaginationConfig } from "antd/es/table";

import { usePagination } from "./usePagination";

const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value;
    },
    clear: () => {
      store = {};
    },
    removeItem: (key: string) => {
      delete store[key];
    },
  };
})();

Object.defineProperty(window, "localStorage", { value: localStorageMock });

describe("usePagination", () => {
  const mockData = Array.from({ length: 25 }, (_, index) => ({
    id: index + 1,
  }));

  beforeEach(() => {
    localStorageMock.clear();
  });

  it("should initialize with default values", () => {
    const { result } = renderHook(() =>
      usePagination({
        data: mockData,
        storageKey: "test-pagination-1",
      }),
    );

    expect(result.current.pagination).toEqual({
      current: 1,
      pageSize: 10,
      showSizeChanger: true,
      pageSizeOptions: ["10", "20", "50", "100"],
      total: mockData.length,
    });
  });

  it("should initialize with custom values", () => {
    const { result } = renderHook(() =>
      usePagination({
        data: mockData,
        defaultPageSize: 20,
        pageSizeOptions: ["5", "10", "20"],
        storageKey: "test-pagination-2",
      }),
    );

    expect(result.current.pagination).toEqual({
      current: 1,
      pageSize: 20,
      showSizeChanger: true,
      pageSizeOptions: ["5", "10", "20"],
      total: mockData.length,
    });
  });

  it("should update pagination when data changes", () => {
    const { result, rerender } = renderHook((props) => usePagination(props), {
      initialProps: {
        data: mockData,
        storageKey: "test-pagination-3",
      },
    });

    const newData = Array.from({ length: 50 }, (_, index) => ({
      id: index + 1,
    }));
    rerender({
      data: newData,
      storageKey: "test-pagination-3",
    });

    expect(result.current.pagination.total).toBe(newData.length);
  });

  it("should handle pagination change", () => {
    const { result } = renderHook(() =>
      usePagination({
        data: mockData,
        storageKey: "test-pagination-4",
      }),
    );

    const newPagination: TablePaginationConfig = {
      current: 2,
      pageSize: 20,
    };

    act(() => {
      result.current.handlePaginationChange(newPagination);
    });

    expect(result.current.pagination).toEqual({
      current: 2,
      pageSize: 20,
      showSizeChanger: true,
      pageSizeOptions: ["10", "20", "50", "100"],
      total: mockData.length,
    });

    const savedPagination = JSON.parse(
      localStorageMock.getItem("test-pagination-4") || "{}",
    );
    expect(savedPagination).toEqual({
      current: 2,
      pageSize: 20,
    });
  });

  it("should preserve pagination settings when data changes", () => {
    const { result, rerender } = renderHook((props) => usePagination(props), {
      initialProps: {
        data: mockData,
        storageKey: "test-pagination-5",
      },
    });

    const newPagination: TablePaginationConfig = {
      current: 2,
      pageSize: 50,
    };

    act(() => {
      result.current.handlePaginationChange(newPagination);
    });

    const newData = Array.from({ length: 30 }, (_, index) => ({
      id: index + 1,
    }));
    rerender({
      data: newData,
      storageKey: "test-pagination-5",
    });

    expect(result.current.pagination).toEqual({
      current: 2,
      pageSize: 50,
      showSizeChanger: true,
      pageSizeOptions: ["10", "20", "50", "100"],
      total: newData.length,
    });
  });

  it("should load pagination settings from localStorage", () => {
    localStorageMock.setItem(
      "test-pagination-6",
      JSON.stringify({
        current: 3,
        pageSize: 100,
      }),
    );

    const { result } = renderHook(() =>
      usePagination({
        data: mockData,
        storageKey: "test-pagination-6",
      }),
    );

    expect(result.current.pagination).toEqual({
      current: 3,
      pageSize: 100,
      showSizeChanger: true,
      pageSizeOptions: ["10", "20", "50", "100"],
      total: mockData.length,
    });
  });
});
