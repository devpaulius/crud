import React from 'react';
import './UserForm.css';

export default function UserForm({ form, onChange, onSubmit, isEditing }) {
  return (
    <form className="user-form" onSubmit={onSubmit}>
      <input
        type="text" placeholder="Name" required
        value={form.name} onChange={e => onChange({ ...form, name: e.target.value })}
      />
      <input
        type="email" placeholder="Email" required
        value={form.email} onChange={e => onChange({ ...form, email: e.target.value })}
      />
      <button type="submit">{isEditing ? 'Update' : 'Add'}</button>
    </form>
  );
}