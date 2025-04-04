import React from 'react';
import { format } from 'date-fns';
import { Link } from 'react-router-dom';

const TransactionTable = ({ transactions, loading, onComplete, userRole }) => {
  const formatAmount = (amount) => {
    return new Intl.NumberFormat('en-KE', {
      style: 'currency',
      currency: 'KES'
    }).format(amount);
  };

  const getStatusBadge = (status) => {
    const statusClasses = {
      PENDING: 'bg-yellow-100 text-yellow-800',
      COMPLETED: 'bg-green-100 text-green-800'
    };
    return (
      <span className={`px-2 py-1 text-xs font-semibold rounded-full ${statusClasses[status]}`}>
        {status}
      </span>
    );
  };

  const getCategoryBadge = (category) => {
    const categoryMap = {
      TITHE: 'Tithe',
      OFFERING: 'Offering',
      BUILDING: 'Building'
    };
    return categoryMap[category] || category;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (transactions.length === 0) {
    return (
      <div className="py-12 text-center text-gray-500">
        No transactions found
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
              Member
            </th>
            <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
              Amount
            </th>
            <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
              Category
            </th>
            <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
              Type
            </th>
            <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
              Date
            </th>
            <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
              Status
            </th>
            <th className="px-6 py-3 text-xs font-medium tracking-wider text-right text-gray-500 uppercase">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {transactions.map((transaction) => (
            <tr key={transaction.id} className="hover:bg-gray-50">
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm font-medium text-gray-900">
                  {transaction.member_name}
                </div>
                {transaction.phone_number && (
                  <div className="text-sm text-gray-500">
                    {transaction.phone_number}
                  </div>
                )}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm font-medium text-gray-900">
                  {formatAmount(transaction.amount)}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-900">
                  {getCategoryBadge(transaction.category)}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-900">
                  {transaction.payment_type}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-900">
                  {format(new Date(transaction.created_at), 'MMM d, yyyy')}
                </div>
                <div className="text-sm text-gray-500">
                  {format(new Date(transaction.created_at), 'h:mm a')}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                {getStatusBadge(transaction.status)}
              </td>
              <td className="px-6 py-4 text-sm font-medium text-right whitespace-nowrap">
                <Link
                  to={`/receipts/${transaction.id}`}
                  target="_blank"
                  className="mr-3 text-primary hover:text-primary-dark"
                >
                  View
                </Link>
                {transaction.status === 'PENDING' && userRole === 'ADMIN' && (
                  <button
                    onClick={() => onComplete(transaction.id)}
                    className="text-green-600 hover:text-green-900"
                  >
                    Complete
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TransactionTable;