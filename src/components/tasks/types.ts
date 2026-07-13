export interface Task {
  id: string;
  title: string;
  description: string | null;
  taskType: "daily" | "near_term";
  status: "pending" | "completed";
  sortOrder: number;
  dueDate: string | null;
  nearTermRange: string | null;
  completedAt: string | null;
  createdAt: string | null;
  updatedAt: string | null;
}
