import { useEffect, useState } from "react";
import EventForm from "./components/EventForm";
import EventList from "./components/EventList";
import "./app.css";
import { getEvents, createEvent, updateEvent, deleteEvent } from "./api";

export default function App() {
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [message, setMessage] = useState("");

  // Load events from backend
  const loadEvents = async () => {
    try {
      const data = await getEvents();
      setEvents(data);
    } catch (err) {
      setMessage(err.message);
    }
  };

  useEffect(() => {
    loadEvents();
  }, []);

  const handleSubmit = async (event) => {
    try {
      if (selectedEvent) {
        await updateEvent(selectedEvent.id, event);
        setMessage("Event updated successfully");
      } else {
        await createEvent(event);
        setMessage("Event created successfully");
      }
      setSelectedEvent(null);
      loadEvents();
    } catch (err) {
      setMessage(err.message);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteEvent(id);
      setMessage("Event deleted successfully");
      loadEvents();
    } catch (err) {
      setMessage(err.message);
    }
  };

  const handleEdit = (event) => {
    setSelectedEvent(event);
  };

    return (
    <div className="container">
      <h1>🎉 Event Finder</h1>

      {/* Form Header */}
      <h2 className="section-header">Add / Edit Event</h2>
      <EventForm onSubmit={handleSubmit} selectedEvent={selectedEvent} />

      <p>{message}</p>

      {/* Table Header */}
      <h2 className="section-header">Event List</h2>
      <div className="table-container">
        <EventList
          events={events}
          onDelete={handleDelete}
          onEdit={handleEdit}
        />
      </div>
    </div>
  );
}