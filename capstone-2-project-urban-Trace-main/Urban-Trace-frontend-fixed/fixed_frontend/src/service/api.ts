import { parseIssuesResponse, statusToBackend } from "../utils/issueMapper";
import { normalizeIssue } from "../utils/issueMapper";

const BASE_URL = "http://127.0.0.1:8000/api";
export const ACCESS_TOKEN_KEY = "urban-trace-access-token";

export function getAuthHeaders(): Record<string, string> {
  const token = localStorage.getItem(ACCESS_TOKEN_KEY);
  return token ? { Authorization: `Bearer ${token}` } : {};
}

/** Safely parse JSON — avoids "Unexpected token '<'" when server returns HTML errors */
export async function parseJsonResponse<T = unknown>(res: Response): Promise<T> {
  const text = await res.text();
  const isJson = (res.headers.get("content-type") || "").includes("application/json");

  if (!isJson) {
    throw new Error(
      res.ok
        ? "Server returned an unexpected response."
        : `Request failed (${res.status}). Start the Django backend: .\\run-backend.ps1`
    );
  }

  try {
    return JSON.parse(text) as T;
  } catch {
    throw new Error(`Invalid JSON from server (${res.status}).`);
  }
}

function formatApiErrors(data: Record<string, unknown>): string {
  return Object.entries(data)
    .map(([key, val]) => {
      const msgs = Array.isArray(val) ? val.join(", ") : String(val);
      return key === "non_field_errors" ? msgs : `${key}: ${msgs}`;
    })
    .join(" · ");
}

// ─── Auth ─────────────────────────────────────────────────

export type AuthUser = {
  id: string;
  username: string;
  email: string;
  role: string;
};

export const login = async (
  usernameOrEmail: string,
  password: string
): Promise<{ access: string; refresh: string; user: AuthUser }> => {
  const res = await fetch(`${BASE_URL}/auth/login/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username: usernameOrEmail, password }),
  });

  const data = await parseJsonResponse<Record<string, unknown>>(res);
  if (!res.ok) {
    throw new Error(formatApiErrors(data) || `Login failed (${res.status})`);
  }
  return data as { access: string; refresh: string; user: AuthUser };
};

export const registerUser = async (payload: Record<string, string>) => {
  const res = await fetch(`${BASE_URL}/auth/register/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  const data = await parseJsonResponse<Record<string, unknown>>(res);
  if (!res.ok) throw new Error(formatApiErrors(data) || "Registration failed");
  return data;
};

export const getUsers = async (role?: string) => {
  const qs = role ? `?role=${encodeURIComponent(role)}` : "";
  const res = await fetch(`${BASE_URL}/auth/users/${qs}`, {
    headers: { ...getAuthHeaders() },
  });
  if (!res.ok) throw new Error(`Failed to fetch users: ${res.status}`);
  return parseJsonResponse(res);
};

// ─── Organisations ────────────────────────────────────────

export type Organization = {
  id: string;
  name: string;
  email: string;
  contact_email: string;
  registration_id: string;
  focus_area: string;
  description: string;
  verified: boolean;
  created_at: string;
};

export const registerOrganization = async (payload: {
  username: string;
  email: string;
  password: string;
  password_confirm: string;
  name: string;
  registration_id: string;
  focus_area: string;
  description: string;
  contact_email: string;
}) => {
  const res = await fetch(`${BASE_URL}/organizations/register/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  const data = await parseJsonResponse<Record<string, unknown>>(res);
  if (!res.ok) throw new Error(formatApiErrors(data) || "Organisation registration failed");
  return data;
};

export const getOrganizations = async (): Promise<Organization[]> => {
  const res = await fetch(`${BASE_URL}/organizations/`, {
    headers: { ...getAuthHeaders() },
  });
  if (!res.ok) throw new Error(`Failed to fetch organisations: ${res.status}`);
  const data = await parseJsonResponse<{ results?: Organization[] } | Organization[]>(res);
  return Array.isArray(data) ? data : data.results ?? [];
};

export const verifyOrganization = async (orgId: string) => {
  const res = await fetch(`${BASE_URL}/organizations/${orgId}/verify/`, {
    method: "POST",
    headers: { ...getAuthHeaders() },
  });
  const data = await parseJsonResponse<Record<string, unknown>>(res);
  if (!res.ok) throw new Error(formatApiErrors(data) || "Verification failed");
  return data;
};

// ─── Issues ───────────────────────────────────────────────

export const getIssues = async () => {
  const res = await fetch(`${BASE_URL}/issues/`, {
    headers: { ...getAuthHeaders() },
  });
  if (!res.ok) throw new Error(`Failed to fetch issues: ${res.status}`);
  const data = await parseJsonResponse(res);
  return parseIssuesResponse(data);
};

export const createIssue = async (formData: FormData) => {
  const res = await fetch(`${BASE_URL}/issues/`, {
    method: "POST",
    body: formData,
  });

  if (!res.ok) {
    const errData = await parseJsonResponse<Record<string, unknown>>(res).catch(() => ({}));
    throw new Error(
      (errData as { detail?: string }).detail || `Submission failed (${res.status})`
    );
  }

  const raw = await parseJsonResponse(res);
  return normalizeIssue(raw as Record<string, unknown>);
};

export const updateIssueStatus = async (issueId: string, status: string) => {
  const backendStatus = statusToBackend(status);
  const res = await fetch(`${BASE_URL}/issues/${issueId}/update_status/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeaders(),
    },
    body: JSON.stringify({ status: backendStatus }),
  });

  if (!res.ok) {
    const errData = await parseJsonResponse<Record<string, unknown>>(res).catch(() => ({}));
    throw new Error(
      (errData as { error?: string }).error ||
        (errData as { detail?: string }).detail ||
        `Update failed: ${res.status}`
    );
  }
  return parseJsonResponse(res);
};

export const deleteIssue = async (issueId: string) => {
  const res = await fetch(`${BASE_URL}/issues/${issueId}/`, {
    method: "DELETE",
    headers: { ...getAuthHeaders() },
  });
  if (!res.ok) throw new Error(`Delete failed: ${res.status}`);
};

// ─── Dashboard Stats ──────────────────────────────────────

export const getDashboardStats = async () => {
  const res = await fetch(`${BASE_URL}/stats/`, {
    headers: { ...getAuthHeaders() },
  });
  if (!res.ok) throw new Error(`Stats fetch failed: ${res.status}`);
  return parseJsonResponse(res);
};
