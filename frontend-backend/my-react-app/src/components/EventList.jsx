function formatDate(str) {
  if (!str) return "";
  const d = new Date(str);
  return d.toLocaleString("en-US", { month: "short", day: "numeric", year: "numeric", hour: "numeric", minute: "2-digit" });
}

export default function EventList({ events, onDelete, onEdit, currentUserId, onRsvp, onCancelRsvp, registeredEventIds, rsvpStatusById }) {
  return (
    <div className="table-card">
      <div className="table-card-header">All Events</div>
      <table>
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
              <td colSpan="8" className="empty-state">No events found</td>
            </tr>
          )}
          {events.map((event) => {
            const isOwner = currentUserId && event.created_by === currentUserId;
            const isRegistered = registeredEventIds?.has(event.id);
            const rsvpStatus = rsvpStatusById?.[event.id];
            return (
              <tr key={event.id}>
                <td>{event.name}</td>
                <td>{event.description}</td>
                <td>{event.location}</td>
                <td>{event.capacity}</td>
                <td>{formatDate(event.date)}</td>
                <td>{formatDate(event.end_time)}</td>
                <td>{event.club_name}</td>
                <td>
                  {isOwner && <button className="btn-edit" onClick={() => onEdit(event)}>Edit</button>}
                  {isOwner && <button className="btn-delete" onClick={() => onDelete(event.id)}>Delete</button>}
                  {!isOwner && !isRegistered && <button className="btn-rsvp" onClick={() => onRsvp(event.id)}>RSVP</button>}
                  {!isOwner && isRegistered && (
                    <button className="btn-cancel-rsvp" onClick={() => onCancelRsvp(event.id)}>
                      Cancel RSVP {rsvpStatus ? `(${rsvpStatus})` : ""}
                    </button>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
