import type { notificationType } from "../types/notification.types";

export const groupByDate = (notifications: notificationType[]) => {
  const groups: Record<string, notificationType[]> = {};
  const today    = new Date(); today.setHours(0,0,0,0);
  const yesterday = new Date(today); yesterday.setDate(today.getDate() - 1);

  for (const n of notifications) {
    const d = new Date(n.createdAt); d.setHours(0,0,0,0);
    let key: string;
    if (d.getTime() === today.getTime())     key = "Today";
    else if (d.getTime() === yesterday.getTime()) key = "Yesterday";
    else key = d.toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" });
    if (!groups[key]) groups[key] = [];
    groups[key].push(n);
  }
  return groups;
};