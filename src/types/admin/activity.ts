export type ActivityType =
  | "test_submitted"
  | "user_updated"
  | "program_created"
  | "program_updated"
  | "program_toggled"
  | "program_deleted"
  | "news_created"
  | "news_updated"
  | "news_deleted";

export interface ActivityEntityRef {
  kind: "test" | "user" | "program" | "news";
  id: string;
}

export interface ActivityItem {
  _id?: string; // when coming from REST
  id?: string; // when coming from socket
  type: ActivityType;
  title: string;
  message: string;
  entity: ActivityEntityRef;
  meta?: Record<string, unknown>;
  actor?: { id?: string; username?: string } | null;
  createdAt: string;
}
