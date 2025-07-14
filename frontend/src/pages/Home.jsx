import React, { useState, useEffect } from 'react';
import UserForm from '../components/UserForm';
import UserList from '../components/UserList';
import { getUsers, createUser, updateUser, deleteUser } from '../services/userService';

export default function Home() {
  const [users, setUsers] = useState([]);
  const [form, setForm] = useState({ name: '', email: '' });
  const [editingId, setEditingId] = useState(null);

  const fetch = () => getUsers().then(res => setUsers(res.data));

  useEffect(() => { fetch(); }, []);

  const handleSubmit = e => {
    e.preventDefault();
    const promise = editingId
      ? updateUser(editingId, form)
      : createUser(form);
    promise.then(() => {
      fetch();
      setForm({ name: '', email: '' });
      setEditingId(null);
    });
  };

  const handleEdit = u => {
    setForm({ name: u.name, email: u.email });
    setEditingId(u.id);
  };
  const handleDelete = id => deleteUser(id).then(fetch);

  return (
    <div>
      <img src="/src/assets/images/logo.jpg" alt="Logo" width={100}/>
      {/* Comp */}
      <UserForm form={form} onChange={setForm} onSubmit={handleSubmit} isEditing={!!editingId} />
      <UserList users={users} onEdit={handleEdit} onDelete={handleDelete} />
    </div>
  );
}