import { useState, useEffect } from "react";
import api from "../../api/axios";
import { getAdminSocket } from "../../api/socket";
import { fetchRecentActivities } from "../../services/activityService";
import type { ActivityItem } from "../../types/admin/activity";

export interface DashboardStats {
  totalUsers: number;
  totalPrograms: number;
  activePrograms: number;
  recentTests: number;
}

export interface AdminStatsResponse {
  totals: {
    totalUsers: number;
    totalPrograms: number;
    activePrograms: number;
    totalTests: number;
  };
  last7d: {
    newUsers: number;
    tests: number;
  };
  topSectors: { _id: string; count: number }[];
  activeByRegion: { _id: string; count: number }[];
}

export function activityKey(a: ActivityItem): string {
  const anyA = a as ActivityItem & { _id?: string; id?: string };
  return anyA.id || anyA._id || `${a.type}-${a.createdAt}`;
}

export const useDashboardStats = () => {
  const [stats, setStats] = useState<DashboardStats>({
    totalUsers: 0,
    totalPrograms: 0,
    activePrograms: 0,
    recentTests: 0,
  });
  const [extra, setExtra] = useState<AdminStatsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [activities, setActivities] = useState<ActivityItem[]>([]);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const { data } = await api.get<AdminStatsResponse>("/stats/admin");
        setExtra(data);
        setStats({
          totalUsers: data.totals.totalUsers,
          totalPrograms: data.totals.totalPrograms,
          activePrograms: data.totals.activePrograms,
          recentTests: data.last7d.tests,
        });
      } catch (error) {
        console.error("Erreur lors du chargement des statistiques:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  useEffect(() => {
    let mounted = true;
    fetchRecentActivities(5)
      .then((items) => {
        if (!mounted) return;
        const sorted = [...items].sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        setActivities(sorted.slice(0, 5));
      })
      .catch(() => {});

    const s = getAdminSocket();
    const onNew = (e: ActivityItem) => {
      setActivities((prev) => {
        const next = [e, ...prev];
        const seen = new Set<string>();
        const unique = next.filter((it) => {
          const id = activityKey(it);
          if (seen.has(id)) return false;
          seen.add(id);
          return true;
        });
        unique.sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        return unique.slice(0, 5);
      });
    };
    s.on("activity:new", onNew);

    return () => {
      mounted = false;
      s.off("activity:new", onNew);
    };
  }, []);

  return {
    stats,
    extra,
    loading,
    activities,
    activityKey,
  };
};
export default useDashboardStats;
