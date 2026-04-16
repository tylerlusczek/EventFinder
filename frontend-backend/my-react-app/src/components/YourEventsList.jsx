export default function YourEventsList({ events, currentUserId, onEdit, onDelete, onCancelRsvp }) {
  return (
    <div className="your-events-card">
      <h2>Your Events</h2>
      {events.length === 0 ? (
        <p>You have not created or RSVP'd to any events yet.</p>
      ) : (
        <div className="table-container">
          <table className="event-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Description</th>
                <th>Location</th>
                <th>Start</th>
                <th>End</th>
                <th>Club</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {events.map((event) => {
                const isOwner = event.created_by === currentUserId;
                return (
                  <tr key={event.id}>
                    <td>{event.name}</td>
                    <td>{event.description}</td>
                    <td>{event.location}</td>
                    <td>{new Date(event.date).toLocaleString()}</td>
                    <td>{new Date(event.end_time).toLocaleString()}</td>
                    <td>{event.club_name}</td>
                    <td>{event.rsvp_status || "Host"}</td>
                    <td>
                      {isOwner && <button onClick={() => onEdit(event)}>Edit</button>}
                      {isOwner && <button onClick={() => onDelete(event.id)}>Delete</button>}
                      {!isOwner && <button onClick={() => onCancelRsvp(event.id)}>Cancel RSVP</button>}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
