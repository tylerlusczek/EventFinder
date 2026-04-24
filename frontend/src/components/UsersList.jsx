import { useState } from "react";

export default function UsersList({ users, onEditUser }) {
  return (
    <div className="table-card">
      <div className="table-card-header">All Users</div>
      {users.length === 0 ? (
        <div className="empty-state">No users found</div>
      ) : (
        <div className="table-scroll">
          <table>
            <thead>
              <tr>
                <th scope="col">Email</th>
                <th scope="col">First Name</th>
                <th scope="col">Last Name</th>
                <th scope="col">Grad Year</th>
                <th scope="col">Major</th>
                <th scope="col">Admin</th>
                <th scope="col">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id}>
                  <td>{user.email}</td>
                  <td>{user.first_name}</td>
                  <td>{user.last_name}</td>
                  <td>{user.grad_year || "—"}</td>
                  <td>{user.major || "—"}</td>
                  <td>{user.isAdmin ? "Yes" : "No"}</td>
                  <td>
                    <button className="btn-edit" onClick={() => onEditUser(user)}>Edit</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}