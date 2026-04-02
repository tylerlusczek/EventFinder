import { useEffect, useState } from "react";
import EventForm from "./components/EventForm";
import EventList from "./components/EventList";
import "./styles.css";
//import { getEvents, createEvent, updateEvent, deleteEvent } from "../api";

export default function EventsPage() {
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);

  const loadEvents = async () => {
    const data = await getEvents();
    setEvents(data);
  };

  const [message, setMessage] = useState("");

  useEffect(() => {
    loadEvents();
  }, []);

  const handleSubmit = async (event) => {
  if (selectedEvent) {
    await updateEvent(selectedEvent.id, event);
    setMessage("Event updated successfully");
    setSelectedEvent(null);
  } else {
    await createEvent(event);
    setMessage("Event created successfully");
  }
  loadEvents();
};

const handleDelete = async (id) => {
  await deleteEvent(id);
  setMessage("Event deleted successfully");
  loadEvents();
};

  const handleEdit = (event) => {
    setSelectedEvent(event);
  };

  return (
    <div className="container">
  <h1>🎉 Event Finder</h1>

  <EventForm onSubmit={handleSubmit} selectedEvent={selectedEvent} />

  <p>{message}</p>

  <EventList
    events={events}
    onDelete={handleDelete}
    onEdit={handleEdit}
  />
</div>
  );
}