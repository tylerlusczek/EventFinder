import { useState, useEffect } from "react";
import { getClubs } from "../api";

export default function EventForm({ onSubmit, selectedEvent }) {
  const [form, setForm] = useState({
    name: "",
    date: "",
    location: "",
    capacity: "",
    club_id: ""
  });

  const [clubs, setClubs] = useState([]);

  useEffect(() => {
    getClubs().then(setClubs);
  }, []);

  useEffect(() => {
    if (selectedEvent) {
      setForm(selectedEvent);
    }
  }, [selectedEvent]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(form);
  };

  return (
    <form onSubmit={handleSubmit}>
      <input name="name" placeholder="Event Name" value={form.name} onChange={handleChange} />
      <input name="date" type="date" value={form.date} onChange={handleChange} />
      <input name="location" placeholder="Location" value={form.location} onChange={handleChange} />
      
      <input
        name="capacity"
        type="number"
        placeholder="Capacity"
        value={form.capacity}
        onChange={handleChange}
      />

      {/* Dropdown */}
      <select name="club_id" value={form.club_id} onChange={handleChange}>
        <option value="">Select Club</option>
        {clubs.map((club) => (
          <option key={club.id} value={club.id}>
            {club.name}
          </option>
        ))}
      </select>

      <button type="submit">
        {selectedEvent ? "Update Event" : "Add Event"}
      </button>
    </form>
  );
}