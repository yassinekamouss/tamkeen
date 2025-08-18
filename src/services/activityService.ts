import api from "../api/axios";
import type { ActivityItem } from "../types/admin/activity";

export async function fetchRecentActivities(limit = 5) {
  const { data } = await api.get<{ success: boolean; data: ActivityItem[] }>(
    `/admin/activity?limit=${limit}`
  );
  // Normalize id field without using any
  const items = (data.data || []).map((a) => {
    const withId = a as ActivityItem & { _id?: string };
    return {
      ...a,
      id: a.id || withId._id,
    } as ActivityItem;
  });
  return items;
}
