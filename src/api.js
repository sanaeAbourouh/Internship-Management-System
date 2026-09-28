const API = "http://127.0.0.1:5000/api";
export async function apiFetch(endpoint, options = {}) {
  const response = await fetch(`${API}${endpoint}`, {
    ...options,
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
  });

  let data;

  try {
    data = await response.json();
  } catch {
    data = {};
  }

  if (!response.ok) {
    const error = new Error(
      data.error || "Request failed."
    );

    error.status = response.status;

    throw error;
  }

  return data;
}