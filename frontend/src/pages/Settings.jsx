import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import API from '../api/api';

export default function Settings() {
  const { user } = useAuth();
  const [settings, setSettings] = useState({
    theme_preference: 'light',
    acknowledged: false
  });
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (user) {
      API.get(`/users/${user.id}/settings`)
        .then(res => {
          setSettings({
            theme_preference: res.data.theme_preference || 'light',
            acknowledged: !!res.data.acknowledged
          });
        })
        .finally(() => setLoading(false));
    }
  }, [user]);

  useEffect(() => {
  document.body.className = settings.theme_preference;
}, [settings.theme_preference]);


  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setSettings(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSave = () => {
    API.put(`/users/${user.id}/settings`, settings)
      .then(() => setMessage('Settings updated successfully'))
      .catch(() => setMessage('Failed to update settings'));
  };

  if (!user) return <p>Please login</p>;
  if (loading) return <p>Loading...</p>;

  return (
    <div>
      <h2>Settings</h2>
      <div>
        <label>
          Theme:
          <select
            name="theme_preference"
            value={settings.theme_preference}
            onChange={handleChange}
          >
            <option value="light">Light</option>
            <option value="dark">Dark</option>
          </select>
        </label>
      </div>

      <div>
        <label>
          <input
            type="checkbox"
            name="acknowledged"
            checked={settings.acknowledged}
            onChange={handleChange}
          />{' '}
          Acknowledged Terms
        </label>
      </div>

      <button onClick={handleSave}>Save Settings</button>
      {message && <p>{message}</p>}
    </div>
  );
}