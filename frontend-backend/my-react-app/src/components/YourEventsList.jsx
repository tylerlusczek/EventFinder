export default function YourEventsList({ events, currentUserId, onEdit, onDelete, onCancelRsvp }) {
  return (
    <div className="table-card">
      <div className="table-card-header">Your Events</div>
      {events.length === 0 ? (
        <div className="empty-state">You have not created or RSVP'd to any events yet.</div>
      ) : (
        <table>
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
                    {isOwner && <button className="btn-edit" onClick={() => onEdit(event)}>Edit</button>}
                    {isOwner && <button className="btn-delete" onClick={() => onDelete(event.id)}>Delete</button>}
                    {!isOwner && <button className="btn-cancel-rsvp" onClick={() => onCancelRsvp(event.id)}>Cancel RSVP</button>}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
    </div>
  );
}
