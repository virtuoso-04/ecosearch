import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext'; // HACKATHON MOD: Added AuthProvider
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import ProductsPage from './pages/ProductsPage';
import ProductDetailPage from './pages/ProductDetailPage';
import LoginPage from './pages/LoginPage';
import CreateProductPage from './pages/CreateProductPage'; // HACKATHON MOD: Added create product page
import MyListingsPage from './pages/MyListingsPage'; // HACKATHON MOD: Added my listings page
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
                  <Route path="/create-product" element={<CreateProductPage />} /> {/* HACKATHON MOD: Added route */}
                  <Route path="/sell" element={<Navigate to="/create-product" replace />} /> {/* Redirect /sell to /create-product */}
                  <Route path="/my-listings" element={<MyListingsPage />} /> {/* HACKATHON MOD: Added my listings route */}
                  <Route path="/cart" element={<CartPage />} />
                  <Route path="/purchases" element={<PreviousPurchasesPage />} />
                  <Route path="/dashboard" element={<DashboardPage />} />
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
