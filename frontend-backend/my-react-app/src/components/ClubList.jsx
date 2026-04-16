export default function ClubList({ clubs, onJoin, onLeave }) {
  return (
    <div className="club-list-card">
      <h2>Clubs</h2>
      {clubs.length === 0 ? (
        <p>No clubs are available yet.</p>
      ) : (
        <div className="table-container">
          <table className="event-table">
            <thead>
              <tr>
                <th>Club Name</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {clubs.map((club) => {
                const isMember = Number(club.is_member) === 1;
                return (
                  <tr key={club.id}>
                    <td>{club.name}</td>
                    <td>{isMember ? "Joined" : "Not Joined"}</td>
                    <td>
                      {!isMember && <button onClick={() => onJoin(club.id)}>Join</button>}
                      {isMember && <button className="leave-button" onClick={() => onLeave(club.id)}>Leave</button>}
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
