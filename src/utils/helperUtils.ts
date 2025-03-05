// helper function to safely format dates

import { format, parseISO } from "date-fns";

export const formatDate = (dateString: string) => {
  try {
    return format(parseISO(dateString), "MMM dd, yyyy");
  } catch (dateError) {
    try {
      return format(new Date(dateString), "MMM dd, yyyy");
    } catch (dateParseError) {
      return "Unknown date";
    }
  }
};
