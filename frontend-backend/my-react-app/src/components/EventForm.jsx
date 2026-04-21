import { useState, useEffect } from "react";
import { getClubs } from "../api";

export default function EventForm({ onSubmit, selectedEvent }) {
  const [form, setForm] = useState({
    title: "",
    description: "",
    location: "",
    capacity: "",
    org_id: "",
    start_time: "",
    end_time: "",
  });

  const [clubs, setClubs] = useState([]);

  useEffect(() => {
    getClubs().then(setClubs);
  }, []);

  const formatDateTimeLocal = (dt) => {
    if (!dt) return "";
    const d = new Date(dt);
    const pad = (n) => n.toString().padStart(2, "0");
    return `${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
  };

  useEffect(() => {
    if (selectedEvent) {
      setForm({
        title: selectedEvent.name || selectedEvent.title || "",
        description: selectedEvent.description || "",
        location: selectedEvent.location || "",
        capacity: selectedEvent.capacity || "",
        org_id: selectedEvent.club_id || "",
        start_time: formatDateTimeLocal(selectedEvent.date),
        end_time: formatDateTimeLocal(selectedEvent.end_time),
      });
    }
  }, [selectedEvent]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(form);
    setForm({ title: "", description: "", location: "", capacity: "", org_id: "", start_time: "", end_time: "" });
  };

  return (
    <div className="form-panel">
      <p className="form-panel-title">{selectedEvent ? "Edit Event" : "Create Event"}</p>
      <form onSubmit={handleSubmit}>
        <div className="field">
          <label htmlFor="title">Event Name</label>
          <input id="title" name="title" value={form.title} onChange={handleChange} placeholder="e.g. Spring Kickoff" />
        </div>

        <div className="field">
          <label htmlFor="description">Description</label>
          <input id="description" name="description" value={form.description} onChange={handleChange} placeholder="Brief description" />
        </div>

        <div className="field">
          <label htmlFor="location">Location</label>
          <input id="location" name="location" value={form.location} onChange={handleChange} placeholder="e.g. Student Union Room 204" />
        </div>

        <div className="field">
          <label htmlFor="capacity">Capacity</label>
          <input id="capacity" type="number" name="capacity" value={form.capacity} onChange={handleChange} placeholder="e.g. 50" />
        </div>

        <div className="field-row">
          <div className="field">
            <label htmlFor="start_time">Start Date & Time</label>
            <input id="start_time" type="datetime-local" name="start_time" value={form.start_time} onChange={handleChange} />
          </div>
          <div className="field">
            <label htmlFor="end_time">End Date & Time</label>
            <input id="end_time" type="datetime-local" name="end_time" value={form.end_time} onChange={handleChange} />
          </div>
        </div>

        <div className="field">
          <label htmlFor="org_id">Club</label>
          <select id="org_id" name="org_id" value={form.org_id} onChange={handleChange}>
            <option value="">Select Club</option>
            {clubs.map((club) => (
              <option key={club.id} value={club.id}>{club.name}</option>
            ))}
          </select>
        </div>

        <button type="submit" className="btn-add">{selectedEvent ? "Update Event" : "Add Event"}</button>
      </form>
    </div>
  );
}
