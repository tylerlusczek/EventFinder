export default function YourEventsList({ events, currentUserId, onEdit, onDelete, onCancelRsvp }) {
  return (
    <div className="table-card">
      <div className="table-card-header">Your Events</div>
      {events.length === 0 ? (
        <div className="empty-state">You have not created or RSVP'd to any events yet.</div>
      ) : (
        <div className="table-scroll">
          <table>
            <thead>
              <tr>
                <th scope="col">Name</th>
                <th scope="col">Description</th>
                <th scope="col">Location</th>
                <th scope="col">Start</th>
                <th scope="col">End</th>
                <th scope="col">Club</th>
                <th scope="col">Status</th>
                <th scope="col">Actions</th>
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
                      {isOwner && <button className="btn-edit" aria-label={"Edit " + event.name} onClick={() => onEdit(event)}>Edit</button>}
                      {isOwner && <button className="btn-delete" aria-label={"Delete " + event.name} onClick={() => onDelete(event.id)}>Delete</button>}
                      {!isOwner && <button className="btn-cancel-rsvp" aria-label={"Cancel RSVP for " + event.name} onClick={() => onCancelRsvp(event.id)}>Cancel RSVP</button>}
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
