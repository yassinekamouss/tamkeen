import api from "../api/axios";
import type { TestItem } from "../types/test";

export interface TestsQuery {
  q?: string;
  applicantType?: "physique" | "morale";
  eligible?: boolean;
  region?: string;
  page?: number;
  limit?: number;
}

export interface TestsResponse {
  success: boolean;
  tests: TestItem[];
  page: number;
  limit: number;
  total: number;
  hasMore: boolean;
}

export const fetchTests = async (
  params: TestsQuery
): Promise<TestsResponse> => {
  const qp: Record<string, string> = {};
  if (params.q) qp.q = params.q;
  if (params.applicantType) qp.applicantType = params.applicantType;
  if (typeof params.eligible === "boolean")
    qp.eligible = String(params.eligible);
  if (params.region) qp.region = params.region;
  if (params.page) qp.page = String(params.page);
  if (params.limit) qp.limit = String(params.limit);

  const search = new URLSearchParams(qp).toString();
  const { data } = await api.get(
    `/test/eligibilite${search ? `?${search}` : ""}`
  );
  return data as TestsResponse;
};
