export default function ClubList({ clubs, onJoin, onLeave }) {
  return (
    <div className="table-card">
      <div className="table-card-header">Clubs</div>
      {clubs.length === 0 ? (
        <div className="empty-state">No clubs are available yet.</div>
      ) : (
        <table>
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
                    {!isMember && <button className="btn-join" onClick={() => onJoin(club.id)}>Join</button>}
                    {isMember && <button className="leave-button" onClick={() => onLeave(club.id)}>Leave</button>}
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
