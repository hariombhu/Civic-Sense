import type { Issue, IssueStatus } from "../types/issue";

type RawIssue = Record<string, unknown>;

/** Map UI status labels to Django backend status values */
export function statusToBackend(status: string): IssueStatus {
  const map: Record<string, IssueStatus> = {
    open: "pending",
    assigned: "pending",
    pending: "pending",
    in_progress: "in_progress",
    resolved: "resolved",
    closed: "closed",
  };
  return map[status] ?? (status as IssueStatus);
}

/** Normalize a single issue from the Django API */
export function normalizeIssue(raw: RawIssue): Issue {
  const id = String(raw.id ?? "");
  const address =
    (typeof raw.address === "string" && raw.address) ||
    (typeof raw.locationLabel === "string" && raw.locationLabel) ||
    "No address provided";
  const createdAt = String(raw.created_at ?? raw.createdAt ?? new Date().toISOString());
  const lat = Number(raw.latitude ?? raw.lat ?? 0);
  const lng = Number(raw.longitude ?? raw.lng ?? 0);

  return {
    id,
    title: String(raw.title ?? ""),
    description: String(raw.description ?? ""),
    status: String(raw.status ?? "pending") as IssueStatus,
    category: String(raw.category ?? "other"),
    latitude: lat,
    longitude: lng,
    lat,
    lng,
    address,
    locationLabel: address,
    image: (raw.image as string | null) ?? null,
    created_at: createdAt,
    createdAt,
    upvotes: Number(raw.upvotes ?? 0),
    created_by: raw.created_by as Issue["created_by"],
    assigned_to: raw.assigned_to as Issue["assigned_to"],
  };
}

/** Unwrap paginated or plain list responses from DRF */
export function parseIssuesResponse(data: unknown): Issue[] {
  if (!data) return [];
  const list = Array.isArray(data)
    ? data
    : (data as { results?: RawIssue[] }).results ?? [];
  return list.map((item) => normalizeIssue(item as RawIssue));
}

export function issueLocation(issue: Issue): string {
  return issue.locationLabel || issue.address || "No address";
}

export function issueDate(issue: Issue): string {
  const d = issue.createdAt || issue.created_at;
  if (!d) return "—";
  return new Date(d).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}
