'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../context/AuthContext';
import { 
  MapPinIcon, 
  PlusIcon, 
  PencilIcon, 
  TrashIcon,
  StarIcon,
  HomeIcon,
  BuildingOfficeIcon
} from '@heroicons/react/24/outline';
import { StarIcon as StarIconSolid } from '@heroicons/react/24/solid';

interface Address {
  id: string;
  type: 'home' | 'work' | 'other';
  isDefault: boolean;
  firstName: string;
  lastName: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  createdAt: string;
}

export default function AddressesPage() {
  const { user, isLoading: authLoading } = useAuth();
  const router = useRouter();
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);
  const [formData, setFormData] = useState({
    type: 'home' as 'home' | 'work' | 'other',
    firstName: '',
    lastName: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'United States',
    isDefault: false
  });

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/auth/login');
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    if (user) {
      fetchAddresses();
    }
  }, [user]);

  const fetchAddresses = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch('/api/addresses');
      if (!response.ok) {
        throw new Error('Failed to fetch addresses');
      }

      const data = await response.json();
      setAddresses(data.addresses);
    } catch (error) {
      console.error('Error fetching addresses:', error);
      setError('Failed to load addresses. Please try again.');
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

  const handleAddAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/addresses', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to add address');
      }

      await fetchAddresses();
      setShowAddForm(false);
      resetForm();
    } catch (error) {
      console.error('Error adding address:', error);
      setError(error instanceof Error ? error.message : 'Failed to add address');
    }
  };

  const handleUpdateAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingAddress) return;

    try {
      const response = await fetch('/api/addresses', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: editingAddress.id,
          ...formData
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update address');
      }

      await fetchAddresses();
      setEditingAddress(null);
      resetForm();
    } catch (error) {
      console.error('Error updating address:', error);
      setError(error instanceof Error ? error.message : 'Failed to update address');
    }
  };

  const handleDeleteAddress = async (id: string) => {
    if (!confirm('Are you sure you want to delete this address?')) {
      return;
    }

    try {
      const response = await fetch(`/api/addresses?id=${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to delete address');
      }

      await fetchAddresses();
    } catch (error) {
      console.error('Error deleting address:', error);
      setError(error instanceof Error ? error.message : 'Failed to delete address');
    }
  };

  const handleSetDefault = async (id: string) => {
    try {
      const response = await fetch('/api/addresses', {
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
        throw new Error(errorData.error || 'Failed to set default address');
      }

      await fetchAddresses();
    } catch (error) {
      console.error('Error setting default address:', error);
      setError(error instanceof Error ? error.message : 'Failed to set default address');
    }
  };

  const startEdit = (address: Address) => {
    setEditingAddress(address);
    setFormData({
      type: address.type,
      firstName: address.firstName,
      lastName: address.lastName,
      address: address.address,
      city: address.city,
      state: address.state,
      zipCode: address.zipCode,
      country: address.country,
      isDefault: address.isDefault
    });
    setShowAddForm(false);
  };

  const cancelEdit = () => {
    setEditingAddress(null);
    setShowAddForm(false);
    resetForm();
  };

  const resetForm = () => {
    setFormData({
      type: 'home',
      firstName: '',
      lastName: '',
      address: '',
      city: '',
      state: '',
      zipCode: '',
      country: 'United States',
      isDefault: false
    });
  };

  const getAddressIcon = (type: string) => {
    switch (type) {
      case 'home':
        return <HomeIcon className="h-8 w-8 text-blue-600" />;
      case 'work':
        return <BuildingOfficeIcon className="h-8 w-8 text-green-600" />;
      default:
        return <MapPinIcon className="h-8 w-8 text-gray-600" />;
    }
  };

  const getAddressTypeLabel = (type: string) => {
    switch (type) {
      case 'home':
        return 'Home';
      case 'work':
        return 'Work';
      default:
        return 'Other';
    }
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
            <h1 className="text-3xl font-bold text-gray-900">Addresses</h1>
            <p className="text-gray-600 mt-2">Manage your delivery addresses</p>
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

        {/* Add New Address Button */}
        {!showAddForm && !editingAddress && (
          <button
            onClick={() => setShowAddForm(true)}
            className="mb-6 flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-primary to-accent text-white font-medium rounded-xl hover:from-primary/90 hover:to-accent/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] shadow-lg hover:shadow-xl"
          >
            <PlusIcon className="h-5 w-5" />
            <span>Add New Address</span>
          </button>
        )}

        {/* Add/Edit Form */}
        {(showAddForm || editingAddress) && (
          <div className="mb-8 bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">
              {editingAddress ? 'Edit Address' : 'Add New Address'}
            </h2>
            <form onSubmit={editingAddress ? handleUpdateAddress : handleAddAddress} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="type" className="block text-sm font-medium text-gray-700">
                    Address Type
                  </label>
                  <select
                    id="type"
                    name="type"
                    required
                    value={formData.type}
                    onChange={handleInputChange}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-200"
                  >
                    <option value="home">Home</option>
                    <option value="work">Work</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">
                    First Name
                  </label>
                  <input
                    type="text"
                    id="firstName"
                    name="firstName"
                    required
                    value={formData.firstName}
                    onChange={handleInputChange}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-200"
                  />
                </div>

                <div>
                  <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">
                    Last Name
                  </label>
                  <input
                    type="text"
                    id="lastName"
                    name="lastName"
                    required
                    value={formData.lastName}
                    onChange={handleInputChange}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-200"
                  />
                </div>

                <div className="md:col-span-2">
                  <label htmlFor="address" className="block text-sm font-medium text-gray-700">
                    Street Address
                  </label>
                  <input
                    type="text"
                    id="address"
                    name="address"
                    required
                    value={formData.address}
                    onChange={handleInputChange}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-200"
                  />
                </div>

                <div>
                  <label htmlFor="city" className="block text-sm font-medium text-gray-700">
                    City
                  </label>
                  <input
                    type="text"
                    id="city"
                    name="city"
                    required
                    value={formData.city}
                    onChange={handleInputChange}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-200"
                  />
                </div>

                <div>
                  <label htmlFor="state" className="block text-sm font-medium text-gray-700">
                    State
                  </label>
                  <input
                    type="text"
                    id="state"
                    name="state"
                    required
                    value={formData.state}
                    onChange={handleInputChange}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-200"
                  />
                </div>

                <div>
                  <label htmlFor="zipCode" className="block text-sm font-medium text-gray-700">
                    ZIP Code
                  </label>
                  <input
                    type="text"
                    id="zipCode"
                    name="zipCode"
                    required
                    placeholder="12345"
                    value={formData.zipCode}
                    onChange={handleInputChange}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-200"
                  />
                </div>

                <div>
                  <label htmlFor="country" className="block text-sm font-medium text-gray-700">
                    Country
                  </label>
                  <input
                    type="text"
                    id="country"
                    name="country"
                    required
                    value={formData.country}
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
                  Set as default address
                </label>
              </div>

              <div className="flex space-x-4">
                <button
                  type="submit"
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-primary to-accent text-white font-medium rounded-xl hover:from-primary/90 hover:to-accent/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] shadow-lg hover:shadow-xl"
                >
                  {editingAddress ? 'Update Address' : 'Add Address'}
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
            <p className="mt-4 text-gray-600">Loading addresses...</p>
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && addresses.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <MapPinIcon className="mx-auto h-12 w-12" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No addresses</h3>
            <p className="text-gray-500 mb-6">Add an address to make checkout faster.</p>
          </div>
        )}

        {/* Addresses List */}
        {!loading && !error && addresses.length > 0 && (
          <div className="space-y-4">
            {addresses.map((address) => (
              <div key={address.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-4">
                    {getAddressIcon(address.type)}
                    <div>
                      <div className="flex items-center space-x-2 mb-2">
                        <h3 className="font-medium text-gray-900">{getAddressTypeLabel(address.type)}</h3>
                        {address.isDefault && (
                          <div className="flex items-center space-x-1">
                            <StarIconSolid className="h-4 w-4 text-yellow-400" />
                            <span className="text-xs font-medium text-yellow-600">Default</span>
                          </div>
                        )}
                      </div>
                      <div className="text-sm text-gray-600 space-y-1">
                        <p className="font-medium text-gray-900">{address.firstName} {address.lastName}</p>
                        <p>{address.address}</p>
                        <p>{address.city}, {address.state} {address.zipCode}</p>
                        <p>{address.country}</p>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    {!address.isDefault && (
                      <button
                        onClick={() => handleSetDefault(address.id)}
                        className="p-2 text-gray-400 hover:text-yellow-600 transition-colors"
                        title="Set as default"
                      >
                        <StarIcon className="h-5 w-5" />
                      </button>
                    )}
                    <button
                      onClick={() => startEdit(address)}
                      className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
                      title="Edit"
                    >
                      <PencilIcon className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() => handleDeleteAddress(address.id)}
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