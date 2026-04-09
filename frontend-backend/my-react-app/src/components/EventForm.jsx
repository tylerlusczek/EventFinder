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

  // Convert MySQL datetime to datetime-local format
  const formatDateTimeLocal = (dt) => {
    if (!dt) return "";
    const d = new Date(dt);
    const pad = (n) => n.toString().padStart(2, "0");
    return `${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
  };

 useEffect(() => {
  if (selectedEvent) {
    setForm({
      title: selectedEvent.name || "",
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
    setForm({
      title: "",
      description: "",
      location: "",
      capacity: "",
      org_id: "",
      start_time: "",
      end_time: "",
    });
  };

  return (
    
    <form className="form-group" onSubmit={handleSubmit}>
      <div className="form-group">
        <label>Event Name</label>
        <input name="title" value={form.title} onChange={handleChange} />
      </div>

      <div className="form-group">
        <label>Description</label>
        <input name="description" value={form.description} onChange={handleChange} />
      </div>

      <div className="form-group">
        <label>Location</label>
        <input name="location" value={form.location} onChange={handleChange} />
      </div>

      <div className="form-group">
        <label>Capacity</label>
        <input type="number" name="capacity" value={form.capacity} onChange={handleChange} />
      </div>

      <div className="form-group">
        <label>Start Date & Time</label>
        <input type="datetime-local" name="start_time" value={form.start_time} onChange={handleChange} />
      </div>

      <div className="form-group">
        <label>End Date & Time</label>
        <input type="datetime-local" name="end_time" value={form.end_time} onChange={handleChange} />
      </div>

      <div className="form-group">
        <label>Club</label>
        <select name="org_id" value={form.org_id} onChange={handleChange}>
          <option value="">Select Club</option>
          {clubs.map((club) => (
            <option key={club.id} value={club.id}>{club.name}</option>
          ))}
        </select>
      </div>

      <button type="submit">{selectedEvent ? "Update Event" : "Add Event"}</button>
    </form>
  );
}