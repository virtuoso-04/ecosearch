import React, { useState, useEffect, createContext, useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { LoadingScreen, ErrorMessage } from './components/ui';
import Navigation from './components/Navigation';
import LoginScreen from './screens/LoginScreen';
import ProductFeedScreen from './screens/ProductFeedScreen';
import AddEditProductScreen from './screens/AddEditProductScreen';
import MyListingsScreen from './screens/MyListingsScreen';
import ProductDetailScreen from './screens/ProductDetailScreen';
import DashboardScreen from './screens/DashboardScreen';
import CartScreen from './screens/CartScreen';
import PreviousPurchasesScreen from './screens/PreviousPurchasesScreen';
import apiService from './services/apiService';

// Auth Context
const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Protected Route Component
function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  
  if (loading) {
    return <LoadingScreen />;
  }
  
  return user ? children : <Navigate to="/login" replace />;
}

// Public Route Component (redirect if authenticated)
function PublicRoute({ children }) {
  const { user, loading } = useAuth();
  
  if (loading) {
    return <LoadingScreen />;
  }
  
  return user ? <Navigate to="/products" replace /> : children;
}

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    initializeAuth();
  }, []);

  const initializeAuth = async () => {
    try {
      if (apiService.isAuthenticated()) {
        const userData = await apiService.getProfile();
        setUser(userData);
      }
    } catch (err) {
      // Token might be invalid, clear it
      apiService.logout();
      console.warn('Failed to verify authentication:', err.message);
    } finally {
      setLoading(false);
    }
  };

  const login = (authData) => {
    setUser(authData.user);
    apiService.setToken(authData.token);
    setError(null);
  };

  const logout = () => {
    setUser(null);
    apiService.logout();
    setError(null);
  };

  const authValue = {
    user,
    loading,
    error,
    login,
    logout,
    isAuthenticated: !!user
  };

  if (loading) {
    return <LoadingScreen message="Initializing EcoFinds..." />;
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <ErrorMessage 
          message={error} 
          onRetry={() => window.location.reload()} 
        />
      </div>
    );
  }

  return (
    <AuthContext.Provider value={authValue}>
      <Router>
        <div className="min-h-screen bg-gray-50">
          {user && <Navigation />}
          
          <main className={user ? 'pt-0' : ''}>
            <Routes>
              {/* Public Routes */}
              <Route 
                path="/login" 
                element={
                  <PublicRoute>
                    <LoginScreen />
                  </PublicRoute>
                } 
              />
              
              {/* Protected Routes */}
              <Route 
                path="/products" 
                element={
                  <ProtectedRoute>
                    <ProductFeedScreen />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/add-product" 
                element={
                  <ProtectedRoute>
                    <AddEditProductScreen />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/my-listings" 
                element={
                  <ProtectedRoute>
                    <MyListingsScreen />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/product/:id" 
                element={
                  <ProtectedRoute>
                    <ProductDetailScreen />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/dashboard" 
                element={
                  <ProtectedRoute>
                    <DashboardScreen />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/cart" 
                element={
                  <ProtectedRoute>
                    <CartScreen />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/purchases" 
                element={
                  <ProtectedRoute>
                    <PreviousPurchasesScreen />
                  </ProtectedRoute>
                } 
              />
              
              {/* Default redirect */}
              <Route 
                path="/" 
                element={<Navigate to={user ? "/products" : "/login"} replace />} 
              />
              
              {/* Catch all route */}
              <Route 
                path="*" 
                element={<Navigate to={user ? "/products" : "/login"} replace />} 
              />
            </Routes>
          </main>
        </div>
      </Router>
    </AuthContext.Provider>
  );
}

export default App;
