import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { AuthContext } from '../context/AuthContext';
import TransactionForm from '../components/TransactionForm';
import TransactionTable from '../components/TransactionTable';

const TransactionsPage = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [filters, setFilters] = useState({
    category: '',
    paymentType: '',
    status: '',
    dateFrom: '',
    dateTo: ''
  });
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    fetchTransactions();
  }, [filters]);

  const fetchTransactions = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value) params.append(key, value);
      });
      
      const res = await axios.get(`/api/transactions/?${params.toString()}`);
      setTransactions(res.data);
    } catch (err) {
      toast.error('Failed to fetch transactions');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTransaction = async (transactionData) => {
    try {
      const res = await axios.post('/api/transactions/', transactionData);
      setTransactions([res.data, ...transactions]);
      setShowForm(false);
      toast.success('Transaction recorded successfully');
    } catch (err) {
      toast.error('Failed to create transaction');
      throw err;
    }
  };

  const handleCompleteTransaction = async (id) => {
    try {
      await axios.post(`/api/transactions/${id}/complete/`);
      fetchTransactions();
      toast.success('Transaction completed successfully');
    } catch (err) {
      toast.error('Failed to complete transaction');
    }
  };

  const handleFilterChange = (e) => {
    setFilters({
      ...filters,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Finance Dashboard</h1>
        <div className="flex space-x-4">
          <button
            onClick={() => setShowForm(!showForm)}
            className="px-4 py-2 text-sm font-medium text-white bg-primary rounded-md hover:bg-primary-dark"
          >
            {showForm ? 'Cancel' : 'New Transaction'}
          </button>
          <button
            onClick={logout}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300"
          >
            Logout
          </button>
        </div>
      </div>

      {showForm && (
        <div className="p-4 mb-6 bg-white rounded-lg shadow">
          <TransactionForm 
            onSubmit={handleCreateTransaction} 
            onCancel={() => setShowForm(false)}
          />
        </div>
      )}

      <div className="p-4 mb-6 bg-white rounded-lg shadow">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          <div>
            <label className="block text-sm font-medium text-gray-700">Category</label>
            <select
              name="category"
              value={filters.category}
              onChange={handleFilterChange}
              className="block w-full mt-1 border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary"
            >
              <option value="">All Categories</option>
              <option value="TITHE">Tithe</option>
              <option value="OFFERING">Offering</option>
              <option value="BUILDING">Church Building</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Payment Type</label>
            <select
              name="paymentType"
              value={filters.paymentType}
              onChange={handleFilterChange}
              className="block w-full mt-1 border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary"
            >
              <option value="">All Types</option>
              <option value="CASH">Cash</option>
              <option value="MPESA">M-Pesa</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Status</label>
            <select
              name="status"
              value={filters.status}
              onChange={handleFilterChange}
              className="block w-full mt-1 border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary"
            >
              <option value="">All Statuses</option>
              <option value="PENDING">Pending</option>
              <option value="COMPLETED">Completed</option>
            </select>
          </div>
        </div>
      </div>

      <div className="p-4 bg-white rounded-lg shadow">
        <TransactionTable
          transactions={transactions}
          loading={loading}
          onComplete={handleCompleteTransaction}
          userRole={user?.role}
        />
      </div>
    </div>
  );
};

export default TransactionsPage;