function formatDate(str) {
  if (!str) return "";
  const d = new Date(str);
  return d.toLocaleString("en-US", { month: "short", day: "numeric", year: "numeric", hour: "numeric", minute: "2-digit" });
}

export default function EventList({ events, onDelete, onEdit }) {
  return (
    <div className="table-container">
      <table className="event-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Description</th>
            <th>Location</th>
            <th>Capacity</th>
            <th>Start</th>
            <th>End</th>
            <th>Club</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {events.length === 0 && (
            <tr>
              <td colSpan="8" style={{ textAlign: "center" }}>No events found</td>
            </tr>
          )}
          {events.map((event) => (
            <tr key={event.id}>
              <td>{event.name}</td>
              <td>{event.description}</td>
              <td>{event.location}</td>
              <td>{event.capacity}</td>
              <td>{formatDate(event.date)}</td>
              <td>{formatDate(event.end_time)}</td>
              <td>{event.club_name}</td>
              <td>
                <button onClick={() => onEdit(event)}>Edit</button>
                <button onClick={() => onDelete(event.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}