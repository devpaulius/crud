import React from 'react';
import './UserList.css';

export default function UserList({ users, onEdit, onDelete }) {
  return (
    <ul className="user-list">
      {users.map(u => (
        <li key={u.id}>
          <div><strong>{u.name}</strong> ({u.email})</div>
          <div>
            <button onClick={() => onEdit(u)}>Edit</button>
            <button onClick={() => onDelete(u.id)}>Delete</button>
          </div>
        </li>
      ))}
    </ul>
  );
}