// frontend/src/pages/Settings.jsx

import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { updateUserProfile, changeUserPassword } from '../api/apiService';
import { LuUser, LuLock, LuSave } from 'react-icons/lu';
import './Settings.css';

function Settings() {
  const { user, refreshUser } = useAuth();

  // Profile State
  const [formData, setFormData] = useState({
    full_name: '',
    age: '',
    username: '' // Read-only
  });

  // Password State
  const [passData, setPassData] = useState({
    current_password: '',
    new_password: '',
    confirm_password: ''
  });

  // UI State
  const [loadingProfile, setLoadingProfile] = useState(false);
  const [loadingPass, setLoadingPass] = useState(false);
  const [message, setMessage] = useState(null); // { type: 'success' | 'error', text: '' }

  // Load user data on mount
  useEffect(() => {
    if (user) {
      setFormData({
        full_name: user.full_name || '',
        age: user.age || '',
        username: user.username || ''
      });
    }
  }, [user]);

  // --- Handlers ---

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setLoadingProfile(true);
    setMessage(null);

    try {
      await updateUserProfile({
        full_name: formData.full_name,
        age: parseInt(formData.age)
      });

      // Refresh context so Sidebar avatar updates immediately
      await refreshUser();

      setMessage({ type: 'success', text: 'Profile updated successfully!' });
    } catch (err) {
      setMessage({ type: 'error', text: 'Failed to update profile. Please try again.' });
    } finally {
      setLoadingProfile(false);
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    if (passData.new_password !== passData.confirm_password) {
      setMessage({ type: 'error', text: "New passwords do not match." });
      return;
    }

    setLoadingPass(true);
    setMessage(null);

    try {
      await changeUserPassword({
        current_password: passData.current_password,
        new_password: passData.new_password
      });

      setMessage({ type: 'success', text: 'Password changed successfully!' });
      setPassData({ current_password: '', new_password: '', confirm_password: '' });
    } catch (err) {
      const errorMsg = err.response?.data?.detail || 'Incorrect current password.';
      setMessage({ type: 'error', text: errorMsg });
    } finally {
      setLoadingPass(false);
    }
  };

  return (
    <div className="settings-container">
      <h1>Settings</h1>
      <p className="subtitle">Manage your account preferences and security.</p>

      {/* Notification Banner */}
      {message && (
        <div className={`message-banner ${message.type}`}>
          {message.text}
        </div>
      )}

      <div className="settings-grid">

        {/* Card 1: Profile Settings */}
        <div className="settings-card">
          <h2><LuUser /> Profile Information</h2>
          <form onSubmit={handleProfileUpdate}>
            <div className="form-group">
              <label>Username</label>
              <input
                type="text"
                value={formData.username}
                disabled
                style={{ opacity: 0.6, cursor: 'not-allowed' }}
              />
            </div>
            <div className="form-group">
              <label>Full Name</label>
              <input
                type="text"
                value={formData.full_name}
                onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                required
              />
            </div>
            <div className="form-group">
              <label>Age</label>
              <input
                type="number"
                value={formData.age}
                onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                required
              />
            </div>
            <button type="submit" disabled={loadingProfile}>
              {loadingProfile ? 'Saving...' : <><LuSave /> Save Changes</>}
            </button>
          </form>
        </div>

        {/* Card 2: Security Settings */}
        <div className="settings-card">
          <h2><LuLock /> Security</h2>
          <form onSubmit={handlePasswordChange}>
            <div className="form-group">
              <label>Current Password</label>
              <input
                type="password"
                value={passData.current_password}
                onChange={(e) => setPassData({ ...passData, current_password: e.target.value })}
                required
              />
            </div>
            <div className="form-group">
              <label>New Password</label>
              <input
                type="password"
                value={passData.new_password}
                onChange={(e) => setPassData({ ...passData, new_password: e.target.value })}
                required
              />
            </div>
            <div className="form-group">
              <label>Confirm New Password</label>
              <input
                type="password"
                value={passData.confirm_password}
                onChange={(e) => setPassData({ ...passData, confirm_password: e.target.value })}
                required
              />
            </div>
            <button type="submit" disabled={loadingPass}>
              {loadingPass ? 'Updating...' : 'Change Password'}
            </button>
          </form>
        </div>

      </div>
    </div>
  );
}

export default Settings;