import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

const TransactionForm = ({ onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    memberName: '',
    phoneNumber: '',
    amount: '',
    category: 'TITHE',
    paymentType: 'CASH'
  });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    // Clear error when field changes
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: null
      });
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.memberName) newErrors.memberName = 'Member name is required';
    if (!formData.amount || isNaN(formData.amount) || parseFloat(formData.amount) <= 0) {
      newErrors.amount = 'Valid amount is required';
    }
    if (formData.paymentType === 'MPESA' && !formData.phoneNumber) {
      newErrors.phoneNumber = 'Phone number is required for M-Pesa';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setSubmitting(true);
    try {
      const transactionData = {
        member_name: formData.memberName,
        phone_number: formData.phoneNumber,
        amount: parseFloat(formData.amount),
        category: formData.category,
        payment_type: formData.paymentType
      };
      await onSubmit(transactionData);
      // Reset form after successful submission
      setFormData({
        memberName: '',
        phoneNumber: '',
        amount: '',
        category: 'TITHE',
        paymentType: 'CASH'
      });
    } catch (err) {
      if (err.response?.data) {
        setErrors(err.response.data);
      } else {
        toast.error('An unexpected error occurred');
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Member Name *
          </label>
          <input
            type="text"
            name="memberName"
            value={formData.memberName}
            onChange={handleChange}
            className={`block w-full mt-1 border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary ${errors.memberName ? 'border-red-500' : ''}`}
          />
          {errors.memberName && (
            <p className="mt-1 text-sm text-red-600">{errors.memberName}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Amount (KSh) *
          </label>
          <input
            type="number"
            name="amount"
            min="0"
            step="0.01"
            value={formData.amount}
            onChange={handleChange}
            className={`block w-full mt-1 border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary ${errors.amount ? 'border-red-500' : ''}`}
          />
          {errors.amount && (
            <p className="mt-1 text-sm text-red-600">{errors.amount}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Payment Type *
          </label>
          <div className="mt-1 space-y-2">
            <label className="inline-flex items-center">
              <input
                type="radio"
                name="paymentType"
                value="CASH"
                checked={formData.paymentType === 'CASH'}
                onChange={handleChange}
                className="text-primary focus:ring-primary"
              />
              <span className="ml-2">Cash</span>
            </label>
            <label className="inline-flex items-center ml-4">
              <input
                type="radio"
                name="paymentType"
                value="MPESA"
                checked={formData.paymentType === 'MPESA'}
                onChange={handleChange}
                className="text-primary focus:ring-primary"
              />
              <span className="ml-2">M-Pesa</span>
            </label>
          </div>
        </div>

        {formData.paymentType === 'MPESA' && (
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Phone Number *
            </label>
            <input
              type="tel"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleChange}
              placeholder="e.g. 254712345678"
              className={`block w-full mt-1 border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary ${errors.phoneNumber ? 'border-red-500' : ''}`}
            />
            {errors.phoneNumber && (
              <p className="mt-1 text-sm text-red-600">{errors.phoneNumber}</p>
            )}
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Category *
          </label>
          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            className="block w-full mt-1 border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary"
          >
            <option value="TITHE">Tithe</option>
            <option value="OFFERING">Offering</option>
            <option value="BUILDING">Church Building</option>
          </select>
        </div>
      </div>

      <div className="flex justify-end mt-6 space-x-3">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={submitting}
          className={`px-4 py-2 text-sm font-medium text-white bg-primary rounded-md hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary ${submitting ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          {submitting ? 'Submitting...' : 'Record Payment'}
        </button>
      </div>
    </form>
  );
};

export default TransactionForm;