export type ProjectStatus = "QUEUED" | "IN_PROGRESS" | "DELIVERED";

export type ProjectRow = {
  id: string;
  created_at: string;
  name: string | null;
  status: ProjectStatus;
};

