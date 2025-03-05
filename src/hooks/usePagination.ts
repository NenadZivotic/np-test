import type { TablePaginationConfig } from "antd/es/table";
import { useEffect, useState } from "react";

interface UsePaginationProps<T> {
  data: T[];
  defaultPageSize?: number;
  pageSizeOptions?: string[];
  storageKey?: string;
}

export const usePagination = <T>({
  data,
  defaultPageSize = 10,
  pageSizeOptions = ["10", "20", "50", "100"],
  storageKey = "table-pagination",
}: UsePaginationProps<T>) => {
  // initialize pagination from localStorage or defaults
  const [pagination, setPagination] = useState<TablePaginationConfig>(() => {
    try {
      const savedPagination = localStorage.getItem(storageKey);
      if (savedPagination) {
        const parsed = JSON.parse(savedPagination);
        return {
          ...parsed,
          total: data.length,
          showSizeChanger: true,
          pageSizeOptions,
        };
      }
    } catch (error) {
      console.error("Error loading pagination from localStorage:", error);
    }

    // default values if nothing in localStorage
    return {
      current: 1,
      pageSize: defaultPageSize,
      showSizeChanger: true,
      pageSizeOptions,
      total: data.length,
    };
  });

  // update total when data changes
  useEffect(() => {
    setPagination((prev) => ({
      ...prev,
      total: data.length,
    }));
  }, [data]);

  // save pagination settings to localStorage when they change
  useEffect(() => {
    try {
      const paginationToSave = {
        current: pagination.current,
        pageSize: pagination.pageSize,
      };
      localStorage.setItem(storageKey, JSON.stringify(paginationToSave));
    } catch (error) {
      console.error("Error saving pagination to localStorage:", error);
    }
  }, [pagination.current, pagination.pageSize, storageKey]);

  const handlePaginationChange = (newPagination: TablePaginationConfig) => {
    setPagination((prev) => ({
      ...prev,
      current: newPagination.current,
      pageSize: newPagination.pageSize,
    }));
  };

  return {
    pagination,
    handlePaginationChange,
  };
};
