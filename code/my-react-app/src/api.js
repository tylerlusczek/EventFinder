const API_BASE = "http://localhost:5000";

// ======================
// EVENTS API
// ======================

// GET all events
export const getEvents = async () => {
  const res = await fetch(`${API_BASE}/events`);
  if (!res.ok) throw new Error("Failed to fetch events");
  return res.json();
};

// CREATE event
export const createEvent = async (event) => {
  const res = await fetch(`${API_BASE}/events`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(event),
  });

  if (!res.ok) throw new Error("Failed to create event");
  return res.json();
};

// UPDATE event
export const updateEvent = async (id, event) => {
  const res = await fetch(`${API_BASE}/events/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(event),
  });

  if (!res.ok) throw new Error("Failed to update event");
  return res.json();
};

// DELETE event
export const deleteEvent = async (id) => {
  const res = await fetch(`${API_BASE}/events/${id}`, {
    method: "DELETE",
  });

  if (!res.ok) throw new Error("Failed to delete event");
  return res.json();
};



// ======================
// CLUBS API (for dropdown)
// ======================

// GET all clubs
export const getClubs = async () => {
  const res = await fetch(`${API_BASE}/clubs`);
  if (!res.ok) throw new Error("Failed to fetch clubs");
  return res.json();
};