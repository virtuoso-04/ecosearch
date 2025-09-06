/**
 * Reusable UI Components with consistent styling
 */

import React from 'react';

export function Button({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  loading = false, 
  disabled = false,
  className = '',
  ...props 
}) {
  const baseClasses = 'font-semibold rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2';
  
  const variants = {
    primary: 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500 active:scale-95',
    secondary: 'bg-gray-100 text-gray-800 hover:bg-gray-200 focus:ring-gray-500 active:scale-95',
    success: 'bg-green-600 text-white hover:bg-green-700 focus:ring-green-500 active:scale-95',
    danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500 active:scale-95',
    outline: 'border-2 border-blue-600 text-blue-600 hover:bg-blue-50 focus:ring-blue-500'
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2',
    lg: 'px-6 py-3 text-lg'
  };

  const classes = `
    ${baseClasses} 
    ${variants[variant]} 
    ${sizes[size]} 
    ${(disabled || loading) ? 'opacity-50 cursor-not-allowed' : ''} 
    ${className}
  `.trim();

  return (
    <button 
      className={classes} 
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <span className="flex items-center gap-2">
          <Spinner size="sm" />
          Loading...
        </span>
      ) : children}
    </button>
  );
}

export function Input({ 
  label, 
  error, 
  touched, 
  className = '',
  ...props 
}) {
  const inputClasses = `
    w-full p-3 rounded-lg border transition-colors
    ${error && touched ? 'border-red-500 focus:border-red-500' : 'border-gray-300 focus:border-blue-500'}
    focus:outline-none
    ${className}
  `.trim();

  return (
    <div className="space-y-1">
      {label && (
        <label className="block text-sm font-medium text-gray-700">
          {label}
          {props.required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <input className={inputClasses} {...props} />
      {error && touched && (
        <p className="text-red-500 text-sm">{error}</p>
      )}
    </div>
  );
}

export function Textarea({ 
  label, 
  error, 
  touched, 
  className = '',
  ...props 
}) {
  const textareaClasses = `
    w-full p-3 rounded-lg border transition-colors resize-none
    ${error && touched ? 'border-red-500 focus:border-red-500' : 'border-gray-300 focus:border-blue-500'}
    focus:outline-none
    ${className}
  `.trim();

  return (
    <div className="space-y-1">
      {label && (
        <label className="block text-sm font-medium text-gray-700">
          {label}
          {props.required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <textarea className={textareaClasses} {...props} />
      {error && touched && (
        <p className="text-red-500 text-sm">{error}</p>
      )}
    </div>
  );
}

export function Select({ 
  label, 
  error, 
  touched, 
  children, 
  className = '',
  ...props 
}) {
  const selectClasses = `
    w-full p-3 rounded-lg border transition-colors
    ${error && touched ? 'border-red-500 focus:border-red-500' : 'border-gray-300 focus:border-blue-500'}
    focus:outline-none
    ${className}
  `.trim();

  return (
    <div className="space-y-1">
      {label && (
        <label className="block text-sm font-medium text-gray-700">
          {label}
          {props.required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <select className={selectClasses} {...props}>
        {children}
      </select>
      {error && touched && (
        <p className="text-red-500 text-sm">{error}</p>
      )}
    </div>
  );
}

export function Card({ children, className = '', ...props }) {
  return (
    <div 
      className={`bg-white rounded-xl shadow-lg border border-gray-100 ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}

export function Spinner({ size = 'md' }) {
  const sizes = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8'
  };

  return (
    <div className={`${sizes[size]} animate-spin`}>
      <div className="w-full h-full border-2 border-blue-600 border-t-transparent rounded-full"></div>
    </div>
  );
}

export function LoadingScreen({ message = 'Loading...' }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-96 space-y-4">
      <Spinner size="lg" />
      <p className="text-lg text-gray-600">{message}</p>
    </div>
  );
}

export function ErrorMessage({ message, onRetry }) {
  return (
    <div className="bg-red-50 border border-red-200 rounded-lg p-4">
      <div className="flex items-center gap-3">
        <div className="text-red-500 text-xl">⚠️</div>
        <div className="flex-1">
          <p className="text-red-700 font-medium">Error</p>
          <p className="text-red-600">{message}</p>
        </div>
        {onRetry && (
          <Button variant="outline" size="sm" onClick={onRetry}>
            Retry
          </Button>
        )}
      </div>
    </div>
  );
}

export function EmptyState({ icon, title, description, action }) {
  return (
    <div className="text-center py-12">
      <div className="text-6xl mb-4">{icon}</div>
      <h3 className="text-xl font-semibold mb-2 text-gray-900">{title}</h3>
      <p className="text-gray-600 mb-6">{description}</p>
      {action}
    </div>
  );
}

export function Modal({ isOpen, onClose, title, children }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen p-4">
        <div className="fixed inset-0 bg-black opacity-50" onClick={onClose}></div>
        <div className="relative bg-white rounded-xl shadow-xl max-w-md w-full p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">{title}</h3>
            <button 
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 text-xl"
            >
              ×
            </button>
          </div>
          {children}
        </div>
      </div>
    </div>
  );
}
