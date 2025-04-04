import React from 'react';

const UserTable = ({ users, loading, currentUserId, onRoleChange }) => {
  const getRoleBadge = (role) => {
    const roleClasses = {
      ADMIN: 'bg-purple-100 text-purple-800',
      FINANCE: 'bg-blue-100 text-blue-800'
    };
    return (
      <span className={`px-2 py-1 text-xs font-semibold rounded-full ${roleClasses[role]}`}>
        {role}
      </span>
    );
  };

  const getStatusBadge = (isActive) => {
    return isActive ? (
      <span className="px-2 py-1 text-xs font-semibold text-green-800 bg-green-100 rounded-full">
        Active
      </span>
    ) : (
      <span className="px-2 py-1 text-xs font-semibold text-red-800 bg-red-100 rounded-full">
        Inactive
      </span>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (users.length === 0) {
    return (
      <div className="py-12 text-center text-gray-500">
        No users found
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
              Username
            </th>
            <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
              Email
            </th>
            <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
              Status
            </th>
            <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
              Role
            </th>
            <th className="px-6 py-3 text-xs font-medium tracking-wider text-right text-gray-500 uppercase">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {users.map((user) => (
            <tr key={user.id} className="hover:bg-gray-50">
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm font-medium text-gray-900">
                  {user.username}
                </div>
                <div className="text-sm text-gray-500">
                  {user.first_name} {user.last_name}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-900">
                  {user.email}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                {getStatusBadge(user.is_active)}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                {getRoleBadge(user.role)}
              </td>
              <td className="px-6 py-4 text-sm font-medium text-right whitespace-nowrap">
                {user.id !== currentUserId && (
                  <select
                    value={user.role}
                    onChange={(e) => onRoleChange(user.id, e.target.value)}
                    className="text-sm border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary"
                  >
                    <option value="FINANCE">Finance</option>
                    <option value="ADMIN">Admin</option>
                  </select>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UserTable;