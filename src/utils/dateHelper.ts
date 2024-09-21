import { format } from "date-fns";

export const formatDateTime = (timestamp: Date) => {
  return format(timestamp.toISOString(), "yyyy-MM-dd HH:mm:ss");
};
