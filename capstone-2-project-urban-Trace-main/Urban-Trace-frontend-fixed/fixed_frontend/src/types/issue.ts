export type IssueCategory = "sanitation" | "road" | "electricity" | "water" | "other";

/** Matches Django Issue.STATUS_CHOICES */
export type IssueStatus = "pending" | "in_progress" | "resolved" | "closed";

export type Issue = {
  id: string;
  title: string;
  description: string;
  status: IssueStatus | string;
  category: string;
  latitude: number;
  longitude: number;
  lat?: number;
  lng?: number;
  address?: string;
  locationLabel?: string;
  image?: string | null;
  created_at: string;
  createdAt?: string;
  upvotes?: number;
  created_by?: { id: string; username: string; email?: string } | null;
  assigned_to?: { id: string; username: string; email?: string } | null;
};
