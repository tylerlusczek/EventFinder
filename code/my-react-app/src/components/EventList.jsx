export default function EventList({ events, onDelete, onEdit }) {
  return (
    <table border="1">
      <thead>
        <tr>
          <th>Name</th>
          <th>Date</th>
          <th>Location</th>
          <th>Actions</th>
          <th>Capacity</th>
          <th>Club</th>
        </tr>
      </thead>
      <tbody>
        {events.length === 0 && <p>No events found</p>}
        {events.map((event) => (
          <tr key={event.id}>
            <td>{event.name}</td>
            <td>{event.date}</td>
            <td>{event.location}</td>
            <td>{event.capacity}</td>
            <td>{event.club_name}</td>
            <td>
              <button onClick={() => onEdit(event)}>Edit</button>
              <button onClick={() => onDelete(event.id)}>Delete</button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}