import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import HomePage from './pages/HomePage';
import ProductsPage from './pages/ProductsPage';
import ProductDetailPage from './pages/ProductDetailPage';
import LoginPage from './pages/LoginPage';
import CreateProductPage from './pages/CreateProductPage';
import MyListingsPage from './pages/MyListingsPage';
import CartPage from './pages/CartPage';
import DashboardPage from './pages/DashboardPage';
import PreviousPurchasesPage from './pages/PreviousPurchasesPage';

function App() {
  return (
    <AuthProvider> {/* HACKATHON MOD: Wrapped app with AuthProvider */}
      <Router>
        <div className="min-h-screen bg-gray-50">
          <Routes>
            {/* Login page without navbar */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<LoginPage />} />
            
            {/* All other pages with navbar */}
            <Route path="/*" element={
              <>
                <Navbar />
                <Routes>
                  <Route path="/" element={<HomePage />} />
                  <Route path="/products" element={<ProductsPage />} />
                  <Route path="/products/:id" element={<ProductDetailPage />} />
                  <Route path="/create-product" element={
                    <ProtectedRoute>
                      <CreateProductPage />
                    </ProtectedRoute>
                  } />
                  <Route path="/sell" element={<Navigate to="/create-product" replace />} />
                  <Route path="/my-listings" element={
                    <ProtectedRoute>
                      <MyListingsPage />
                    </ProtectedRoute>
                  } />
                  <Route path="/cart" element={
                    <ProtectedRoute>
                      <CartPage />
                    </ProtectedRoute>
                  } />
                  <Route path="/purchases" element={
                    <ProtectedRoute>
                      <PreviousPurchasesPage />
                    </ProtectedRoute>
                  } />
                  <Route path="/dashboard" element={
                    <ProtectedRoute>
                      <DashboardPage />
                    </ProtectedRoute>
                  } />
                  <Route path="*" element={<div className="min-h-screen flex items-center justify-center"><h1 className="text-2xl font-bold">Page Not Found</h1></div>} />
                </Routes>
              </>
            } />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
