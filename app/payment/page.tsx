'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../context/AuthContext';
import { 
  CreditCardIcon, 
  PlusIcon, 
  PencilIcon, 
  TrashIcon,
  StarIcon
} from '@heroicons/react/24/outline';
import { StarIcon as StarIconSolid } from '@heroicons/react/24/solid';

interface PaymentMethod {
  id: string;
  type: 'credit' | 'debit' | 'paypal';
  isDefault: boolean;
  cardName: string;
  cardNumber: string;
  expiryDate: string;
  cardType: string;
  createdAt: string;
}

export default function PaymentMethodsPage() {
  const { user, isLoading: authLoading } = useAuth();
  const router = useRouter();
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingMethod, setEditingMethod] = useState<PaymentMethod | null>(null);
  const [formData, setFormData] = useState({
    type: 'credit' as 'credit' | 'debit' | 'paypal',
    cardName: '',
    cardNumber: '',
    expiryDate: '',
    isDefault: false
  });

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/auth/login');
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    if (user) {
      fetchPaymentMethods();
    }
  }, [user]);

  const fetchPaymentMethods = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch('/api/payment-methods');
      if (!response.ok) {
        throw new Error('Failed to fetch payment methods');
      }

      const data = await response.json();
      setPaymentMethods(data.paymentMethods);
    } catch (error) {
      console.error('Error fetching payment methods:', error);
      setError('Failed to load payment methods. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
  };

  const handleAddPaymentMethod = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/payment-methods', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to add payment method');
      }

      await fetchPaymentMethods();
      setShowAddForm(false);
      setFormData({
        type: 'credit',
        cardName: '',
        cardNumber: '',
        expiryDate: '',
        isDefault: false
      });
    } catch (error) {
      console.error('Error adding payment method:', error);
      setError(error instanceof Error ? error.message : 'Failed to add payment method');
    }
  };

  const handleUpdatePaymentMethod = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingMethod) return;

    try {
      const response = await fetch('/api/payment-methods', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: editingMethod.id,
          cardName: formData.cardName,
          expiryDate: formData.expiryDate,
          isDefault: formData.isDefault
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update payment method');
      }

      await fetchPaymentMethods();
      setEditingMethod(null);
      setFormData({
        type: 'credit',
        cardName: '',
        cardNumber: '',
        expiryDate: '',
        isDefault: false
      });
    } catch (error) {
      console.error('Error updating payment method:', error);
      setError(error instanceof Error ? error.message : 'Failed to update payment method');
    }
  };

  const handleDeletePaymentMethod = async (id: string) => {
    if (!confirm('Are you sure you want to delete this payment method?')) {
      return;
    }

    try {
      const response = await fetch(`/api/payment-methods?id=${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to delete payment method');
      }

      await fetchPaymentMethods();
    } catch (error) {
      console.error('Error deleting payment method:', error);
      setError(error instanceof Error ? error.message : 'Failed to delete payment method');
    }
  };

  const handleSetDefault = async (id: string) => {
    try {
      const response = await fetch('/api/payment-methods', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id,
          isDefault: true
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to set default payment method');
      }

      await fetchPaymentMethods();
    } catch (error) {
      console.error('Error setting default payment method:', error);
      setError(error instanceof Error ? error.message : 'Failed to set default payment method');
    }
  };

  const startEdit = (method: PaymentMethod) => {
    setEditingMethod(method);
    setFormData({
      type: method.type,
      cardName: method.cardName,
      cardNumber: '', // Don't pre-fill card number for security
      expiryDate: method.expiryDate,
      isDefault: method.isDefault
    });
    setShowAddForm(false);
  };

  const cancelEdit = () => {
    setEditingMethod(null);
    setShowAddForm(false);
    setFormData({
      type: 'credit',
      cardName: '',
      cardNumber: '',
      expiryDate: '',
      isDefault: false
    });
  };

  const getCardIcon = (cardType: string) => {
    // In a real app, you'd have actual card brand icons
    return <CreditCardIcon className="h-8 w-8 text-gray-600" />;
  };

  // Show loading while checking authentication
  if (authLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Show login prompt if user is not authenticated
  if (!user) {
    return null; // Will redirect to login
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Payment Methods</h1>
            <p className="text-gray-600 mt-2">Manage your saved payment methods</p>
          </div>
          <button
            onClick={() => router.push('/account')}
            className="px-6 py-3 bg-white text-gray-700 font-medium rounded-xl border-2 border-gray-200 hover:border-gray-300 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-all duration-200"
          >
            Back to Account
          </button>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-600">{error}</p>
          </div>
        )}

        {/* Add New Payment Method Button */}
        {!showAddForm && !editingMethod && (
          <button
            onClick={() => setShowAddForm(true)}
            className="mb-6 flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-primary to-accent text-white font-medium rounded-xl hover:from-primary/90 hover:to-accent/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] shadow-lg hover:shadow-xl"
          >
            <PlusIcon className="h-5 w-5" />
            <span>Add New Payment Method</span>
          </button>
        )}

        {/* Add/Edit Form */}
        {(showAddForm || editingMethod) && (
          <div className="mb-8 bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">
              {editingMethod ? 'Edit Payment Method' : 'Add New Payment Method'}
            </h2>
            <form onSubmit={editingMethod ? handleUpdatePaymentMethod : handleAddPaymentMethod} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="type" className="block text-sm font-medium text-gray-700">
                    Card Type
                  </label>
                  <select
                    id="type"
                    name="type"
                    required
                    value={formData.type}
                    onChange={handleInputChange}
                    disabled={!!editingMethod}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-200 disabled:bg-gray-100"
                  >
                    <option value="credit">Credit Card</option>
                    <option value="debit">Debit Card</option>
                    <option value="paypal">PayPal</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="cardName" className="block text-sm font-medium text-gray-700">
                    Name on Card
                  </label>
                  <input
                    type="text"
                    id="cardName"
                    name="cardName"
                    required
                    value={formData.cardName}
                    onChange={handleInputChange}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-200"
                  />
                </div>

                {!editingMethod && (
                  <div>
                    <label htmlFor="cardNumber" className="block text-sm font-medium text-gray-700">
                      Card Number
                    </label>
                    <input
                      type="text"
                      id="cardNumber"
                      name="cardNumber"
                      required
                      placeholder="1234 5678 9012 3456"
                      value={formData.cardNumber}
                      onChange={handleInputChange}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-200"
                    />
                  </div>
                )}

                <div>
                  <label htmlFor="expiryDate" className="block text-sm font-medium text-gray-700">
                    Expiry Date
                  </label>
                  <input
                    type="text"
                    id="expiryDate"
                    name="expiryDate"
                    required
                    placeholder="MM/YY"
                    value={formData.expiryDate}
                    onChange={handleInputChange}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-200"
                  />
                </div>
              </div>

              <div className="flex items-center">
                <input
                  id="isDefault"
                  name="isDefault"
                  type="checkbox"
                  checked={formData.isDefault}
                  onChange={handleInputChange}
                  className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                />
                <label htmlFor="isDefault" className="ml-2 block text-sm text-gray-900">
                  Set as default payment method
                </label>
              </div>

              <div className="flex space-x-4">
                <button
                  type="submit"
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-primary to-accent text-white font-medium rounded-xl hover:from-primary/90 hover:to-accent/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] shadow-lg hover:shadow-xl"
                >
                  {editingMethod ? 'Update Payment Method' : 'Add Payment Method'}
                </button>
                <button
                  type="button"
                  onClick={cancelEdit}
                  className="px-6 py-3 bg-white text-gray-700 font-medium rounded-xl border-2 border-gray-200 hover:border-gray-300 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-all duration-200"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading payment methods...</p>
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && paymentMethods.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <CreditCardIcon className="mx-auto h-12 w-12" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No payment methods</h3>
            <p className="text-gray-500 mb-6">Add a payment method to make checkout faster.</p>
          </div>
        )}

        {/* Payment Methods List */}
        {!loading && !error && paymentMethods.length > 0 && (
          <div className="space-y-4">
            {paymentMethods.map((method) => (
              <div key={method.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    {getCardIcon(method.cardType)}
                    <div>
                      <div className="flex items-center space-x-2">
                        <h3 className="font-medium text-gray-900">{method.cardType}</h3>
                        {method.isDefault && (
                          <div className="flex items-center space-x-1">
                            <StarIconSolid className="h-4 w-4 text-yellow-400" />
                            <span className="text-xs font-medium text-yellow-600">Default</span>
                          </div>
                        )}
                      </div>
                      <p className="text-sm text-gray-600">{method.cardNumber}</p>
                      <p className="text-sm text-gray-600">Expires {method.expiryDate}</p>
                      <p className="text-sm text-gray-600">{method.cardName}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    {!method.isDefault && (
                      <button
                        onClick={() => handleSetDefault(method.id)}
                        className="p-2 text-gray-400 hover:text-yellow-600 transition-colors"
                        title="Set as default"
                      >
                        <StarIcon className="h-5 w-5" />
                      </button>
                    )}
                    <button
                      onClick={() => startEdit(method)}
                      className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
                      title="Edit"
                    >
                      <PencilIcon className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() => handleDeletePaymentMethod(method.id)}
                      className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                      title="Delete"
                    >
                      <TrashIcon className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
} 