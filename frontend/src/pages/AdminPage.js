import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { AuthContext } from '../context/AuthContext';
import UserTable from '../components/UserTable';
import UserForm from '../components/UserForm';

const AdminPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await axios.get('/api/auth/users/');
      setUsers(res.data);
    } catch (err) {
      toast.error('Failed to fetch users');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateUser = async (userData) => {
    try {
      await axios.post('/api/auth/register/', userData);
      await fetchUsers();
      setShowForm(false);
      toast.success('User created successfully');
    } catch (err) {
      toast.error('Failed to create user');
      throw err;
    }
  };

  const handleUpdateRole = async (userId, role) => {
    try {
      await axios.patch(`/api/auth/users/${userId}/role/`, { role });
      await fetchUsers();
      toast.success('User role updated successfully');
    } catch (err) {
      toast.error('Failed to update user role');
    }
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Admin Dashboard</h1>
        <div className="flex space-x-4">
          <button
            onClick={() => setShowForm(!showForm)}
            className="px-4 py-2 text-sm font-medium text-white bg-primary rounded-md hover:bg-primary-dark"
          >
            {showForm ? 'Cancel' : 'New User'}
          </button>
        </div>
      </div>

      {showForm && (
        <div className="p-4 mb-6 bg-white rounded-lg shadow">
          <UserForm 
            onSubmit={handleCreateUser} 
            onCancel={() => setShowForm(false)}
          />
        </div>
      )}

      <div className="p-4 bg-white rounded-lg shadow">
        <UserTable
          users={users}
          loading={loading}
          currentUserId={user?.id}
          onRoleChange={handleUpdateRole}
        />
      </div>
    </div>
  );
};

export default AdminPage;