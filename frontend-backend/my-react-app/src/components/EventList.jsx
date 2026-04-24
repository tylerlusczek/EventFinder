function formatDate(str) {
  if (!str) return "";
  const d = new Date(str);
  return d.toLocaleString("en-US", { month: "short", day: "numeric", year: "numeric", hour: "numeric", minute: "2-digit" });
}

export default function EventList({ events, onDelete, onEdit, currentUserId, onRsvp, onCancelRsvp, registeredEventIds, rsvpStatusById, isAdmin = false }) {
  return (
    <div className="table-card">
      <div className="table-card-header">All Events</div>
      <div className="table-scroll">
        <table>
          <thead>
            <tr>
              <th scope="col">Name</th>
              <th scope="col">Description</th>
              <th scope="col">Location</th>
              <th scope="col">Capacity</th>
              <th scope="col">Start</th>
              <th scope="col">End</th>
              <th scope="col">Club</th>
              <th scope="col">Actions</th>
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
                    {(isOwner || isAdmin) && <button className="btn-edit" aria-label={"Edit " + event.name} onClick={() => onEdit(event)}>Edit</button>}
                    {(isOwner || isAdmin) && <button className="btn-delete" aria-label={"Delete " + event.name} onClick={() => onDelete(event.id)}>Delete</button>}
                    {isAdmin || !isOwner && !isRegistered && <button className="btn-rsvp" aria-label={"RSVP to " + event.name} onClick={() => onRsvp(event.id)}>RSVP</button>}
                    {isAdmin || !isOwner && isRegistered && (
                      <button className="btn-cancel-rsvp" aria-label={"Cancel RSVP for " + event.name} onClick={() => onCancelRsvp(event.id)}>
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
    </div>
  );
}
