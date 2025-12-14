const useMock = String(process.env.REACT_APP_USE_MOCK).toLowerCase() === "true";

export function isMockEnabled() {
  return useMock;
}

export const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || "";

export async function request(path, options = {}) {
  const url = `${API_BASE_URL}${path}`;

  const res = await fetch(url, {
    headers: { "Content-Type": "application/json", ...(options.headers || {}) },
    ...options,
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`HTTP ${res.status} ${res.statusText} ${text}`);
  }

  const contentType = res.headers.get("content-type") || "";
  if (!contentType.includes("application/json")) return null;

  return res.json();
}
