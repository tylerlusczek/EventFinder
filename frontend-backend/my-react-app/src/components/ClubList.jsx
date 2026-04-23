import { useState } from "react";

export default function ClubList({ clubs, onJoin, onLeave, onCreateClub, onDeleteClub, isAdmin }) {
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: "", category: "", description: "" });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name.trim() || !form.category.trim()) return;
    await onCreateClub({ name: form.name.trim(), category: form.category.trim(), description: form.description.trim() });
    setForm({ name: "", category: "", description: "" });
    setShowForm(false);
  };

  return (
    <div className="table-card">
      <div className="table-card-header">Clubs</div>
      {isAdmin && (
        <div className="admin-actions">
          <button type="button" className="btn-add" onClick={() => setShowForm((prev) => !prev)}>
            {showForm ? "Cancel" : "Add Club"}
          </button>
          {showForm && (
            <form className="club-form" onSubmit={handleSubmit}>
              <div className="field">
                <label htmlFor="name">Club Name</label>
                <input id="name" name="name" value={form.name} onChange={handleChange} required placeholder="Tech Club" />
              </div>
              <div className="field">
                <label htmlFor="category">Category</label>
                <input id="category" name="category" value={form.category} onChange={handleChange} required placeholder="Academic" />
              </div>
              <div className="field">
                <label htmlFor="description">Description</label>
                <input id="description" name="description" value={form.description} onChange={handleChange} placeholder="Club description" />
              </div>
              <button type="submit" className="btn-login">
                Save Club
              </button>
            </form>
          )}
        </div>
      )}

      {clubs.length === 0 ? (
        <div className="empty-state">No clubs are available yet.</div>
      ) : (
        <div className="table-scroll">
          <table>
            <thead>
              <tr>
                <th scope="col">Club Name</th>
                {isAdmin && <th scope="col">Category</th>}
                {!isAdmin && <th scope="col">Status</th>}
                <th scope="col">Actions</th>
              </tr>
            </thead>
            <tbody>
              {clubs.map((club) => {
                const isMember = Number(club.is_member) === 1;
                return (
                  <tr key={club.id}>
                    <td>{club.name}</td>
                    {isAdmin && <td>{club.category || "—"}</td>}
                    {!isAdmin && <td>{isMember ? "Joined" : "Not Joined"}</td>}
                    <td>
                      {isAdmin ? (
                        <button type="button" className="leave-button" onClick={() => onDeleteClub(club.id)}>
                          Delete
                        </button>
                      ) : (
                        <>
                          {!isMember && <button className="btn-join" onClick={() => onJoin(club.id)}>Join</button>}
                          {isMember && <button className="leave-button" onClick={() => onLeave(club.id)}>Leave</button>}
                        </>
                      )}
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
