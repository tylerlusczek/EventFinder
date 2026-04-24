const API_BASE = "http://localhost:5000";

const getAuthHeaders = () => {
  const token = localStorage.getItem("auth_token");
  return token ? { Authorization: `Bearer ${token}` } : {};
};

const handleResponse = async (res) => {
  const data = await res.json().catch(() => null);
  if (!res.ok) {
    throw new Error(data?.error || "Request failed");
  }
  return data;
};

export const signup = async (user) => {
  const res = await fetch(`${API_BASE}/signup`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(user),
  });
  return handleResponse(res);
};

export const login = async (credentials) => {
  const res = await fetch(`${API_BASE}/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(credentials),
  });
  return handleResponse(res);
};

export const changePassword = async (payload) => {
  const res = await fetch(`${API_BASE}/change-password`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeaders(),
    },
    body: JSON.stringify(payload),
  });
  return handleResponse(res);
};

export const getClubs = async () => {
  const res = await fetch(`${API_BASE}/clubs`, {
    headers: {
      ...getAuthHeaders(),
    },
  });
  return handleResponse(res);
};

export const joinClub = async (orgId) => {
  const res = await fetch(`${API_BASE}/clubs/${orgId}/join`, {
    method: "POST",
    headers: {
      ...getAuthHeaders(),
    },
  });
  return handleResponse(res);
};

export const leaveClub = async (orgId) => {
  const res = await fetch(`${API_BASE}/clubs/${orgId}/join`, {
    method: "DELETE",
    headers: {
      ...getAuthHeaders(),
    },
  });
  return handleResponse(res);
};

export const createClub = async (club) => {
  const res = await fetch(`${API_BASE}/clubs`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeaders(),
    },
    body: JSON.stringify(club),
  });
  return handleResponse(res);
};

export const deleteClub = async (orgId) => {
  const res = await fetch(`${API_BASE}/clubs/${orgId}`, {
    method: "DELETE",
    headers: {
      ...getAuthHeaders(),
    },
  });
  return handleResponse(res);
};

export const getEvents = async () => {
  const res = await fetch(`${API_BASE}/events`, {
    headers: {
      ...getAuthHeaders(),
    },
  });
  return handleResponse(res);
};

export const getMyEvents = async () => {
  const res = await fetch(`${API_BASE}/my-events`, {
    headers: {
      ...getAuthHeaders(),
    },
  });
  return handleResponse(res);
};

export const createEvent = async (event) => {
  const res = await fetch(`${API_BASE}/events`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeaders(),
    },
    body: JSON.stringify(event),
  });
  return handleResponse(res);
};

export const updateEvent = async (id, event) => {
  const res = await fetch(`${API_BASE}/events/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeaders(),
    },
    body: JSON.stringify(event),
  });
  return handleResponse(res);
};

export const deleteEvent = async (id) => {
  const res = await fetch(`${API_BASE}/events/${id}`, {
    method: "DELETE",
    headers: {
      ...getAuthHeaders(),
    },
  });
  return handleResponse(res);
};

export const rsvpEvent = async (eventId) => {
  const res = await fetch(`${API_BASE}/events/${eventId}/rsvp`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeaders(),
    },
    body: JSON.stringify({ rsvp_status: "Going" }),
  });
  return handleResponse(res);
};

export const cancelRsvp = async (eventId) => {
  const res = await fetch(`${API_BASE}/events/${eventId}/rsvp`, {
    method: "DELETE",
    headers: {
      ...getAuthHeaders(),
    },
  });
  return handleResponse(res);
};

export const getUsers = async () => {
  const res = await fetch(`${API_BASE}/users`, {
    headers: {
      ...getAuthHeaders(),
    },
  });
  return handleResponse(res);
};

export const createUser = async (user) => {
  const res = await fetch(`${API_BASE}/users`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeaders(),
    },
    body: JSON.stringify(user),
  });
  return handleResponse(res);
};

export const updateUser = async (id, user) => {
  const res = await fetch(`${API_BASE}/users/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeaders(),
    },
    body: JSON.stringify(user),
  });
  return handleResponse(res);
};
