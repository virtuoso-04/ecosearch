import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../App';
import { useApi, useFormValidation } from '../hooks';
import { Button, Card, Input, ErrorMessage, LoadingScreen, Badge } from '../components/ui';
import apiService from '../services/apiService';

const profileValidationRules = {
  name: { required: true, minLength: 2, maxLength: 50 },
  avatarUrl: { pattern: /^https?:\/\/.+\.(jpg|jpeg|png|gif|webp)$/i }
};

function DashboardScreen() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [editing, setEditing] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [stats, setStats] = useState(null);
  
  const { 
    loading: profileLoading, 
    error: profileError, 
    execute: loadProfile 
  } = useApi(apiService.getProfile);

  const {
    values,
    errors: validationErrors,
    touched,
    isValid,
    handleChange,
    handleBlur,
    setValues,
    validateForm
  } = useFormValidation({
    name: user?.name || '',
    avatarUrl: user?.avatarUrl || ''
  }, profileValidationRules);

  useEffect(() => {
    loadDashboardData();
  }, []);

  useEffect(() => {
    if (user) {
      setValues({
        name: user.name || '',
        avatarUrl: user.avatarUrl || ''
      });
    }
  }, [user]);

  const loadDashboardData = async () => {
    try {
      const [userProducts, purchases] = await Promise.all([
        apiService.getUserProducts(user.id),
        apiService.getPurchases()
      ]);
      
      setStats({
        totalListings: userProducts.length,
        totalPurchases: purchases.length,
        totalEarnings: userProducts.reduce((sum, p) => sum + (p.sold ? p.price : 0), 0)
      });
    } catch (err) {
      console.error('Failed to load dashboard data:', err);
    }
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      setUpdating(true);
      await apiService.updateProfile({
        name: values.name.trim(),
        avatarUrl: values.avatarUrl.trim() || null
      });
      
      // Refresh user data
      await loadProfile();
      setEditing(false);
    } catch (err) {
      alert('Failed to update profile: ' + err.message);
    } finally {
      setUpdating(false);
    }
  };

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to logout?')) {
      logout();
    }
  };

  if (profileLoading) {
    return <LoadingScreen message="Loading dashboard..." />;
  }

  if (profileError) {
    return (
      <div className="p-4">
        <ErrorMessage 
          message={profileError} 
          onRetry={loadDashboardData} 
        />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-6">
      {/* Profile Section */}
      <Card className="p-6">
        <div className="flex flex-col items-center text-center">
          {/* Avatar */}
          <div className="w-24 h-24 bg-gray-200 rounded-full mb-4 overflow-hidden">
            {user?.avatarUrl ? (
              <img 
                src={user.avatarUrl} 
                alt={user.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-2xl font-bold text-gray-500">
                {user?.name?.charAt(0).toUpperCase()}
              </div>
            )}
          </div>

          {editing ? (
            <form onSubmit={handleUpdateProfile} className="w-full max-w-md space-y-4">
              <Input
                label="Name"
                name="name"
                value={values.name}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.name ? validationErrors.name : ''}
                required
              />
              
              <Input
                label="Avatar URL"
                name="avatarUrl"
                type="url"
                value={values.avatarUrl}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.avatarUrl ? validationErrors.avatarUrl : ''}
                placeholder="https://example.com/avatar.jpg"
              />

              <div className="flex gap-2">
                <Button
                  type="submit"
                  disabled={updating || !isValid}
                  loading={updating}
                  className="flex-1"
                >
                  Save Changes
                </Button>
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => setEditing(false)}
                  className="flex-1"
                >
                  Cancel
                </Button>
              </div>
            </form>
          ) : (
            <>
              <h2 className="text-2xl font-bold mb-2">{user?.name}</h2>
              <p className="text-gray-600 mb-4">{user?.email}</p>
              <div className="flex gap-2">
                <Button
                  onClick={() => setEditing(true)}
                  variant="secondary"
                >
                  Edit Profile
                </Button>
                <Button
                  onClick={handleLogout}
                  variant="danger"
                >
                  Logout
                </Button>
              </div>
            </>
          )}
        </div>
      </Card>

      {/* Stats Section */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="p-6 text-center">
            <div className="text-3xl font-bold text-blue-600 mb-2">
              {stats.totalListings}
            </div>
            <div className="text-gray-600">Total Listings</div>
          </Card>
          
          <Card className="p-6 text-center">
            <div className="text-3xl font-bold text-green-600 mb-2">
              {stats.totalPurchases}
            </div>
            <div className="text-gray-600">Purchases Made</div>
          </Card>
          
          <Card className="p-6 text-center">
            <div className="text-3xl font-bold text-purple-600 mb-2">
              ${stats.totalEarnings.toFixed(2)}
            </div>
            <div className="text-gray-600">Total Earnings</div>
          </Card>
        </div>
      )}

      {/* Quick Actions */}
      <Card className="p-6">
        <h3 className="text-xl font-semibold mb-4">Quick Actions</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Button
            onClick={() => navigate('/add-product')}
            variant="secondary"
            className="h-16"
          >
            Add Product
          </Button>
          <Button
            onClick={() => navigate('/my-listings')}
            variant="secondary"
            className="h-16"
          >
            My Listings
          </Button>
          <Button
            onClick={() => navigate('/cart')}
            variant="secondary"
            className="h-16"
          >
            View Cart
          </Button>
          <Button
            onClick={() => navigate('/purchases')}
            variant="secondary"
            className="h-16"
          >
            Purchase History
          </Button>
        </div>
      </Card>
    </div>
  );
}

export default DashboardScreen;
