/**
 * Authentication Context
 * Manages user authentication state throughout the app
 */

import React, { createContext, useContext, useReducer, useEffect } from 'react';

// Initial state
const initialState = {
  user: null,
  token: localStorage.getItem('token'),
  isAuthenticated: false,
  loading: true,
  error: null
};

// Action types
const ActionTypes = {
  LOGIN_START: 'LOGIN_START',
  LOGIN_SUCCESS: 'LOGIN_SUCCESS',
  LOGIN_FAILURE: 'LOGIN_FAILURE',
  LOGOUT: 'LOGOUT',
  UPDATE_PROFILE: 'UPDATE_PROFILE',
  CLEAR_ERROR: 'CLEAR_ERROR',
  SET_LOADING: 'SET_LOADING'
};

// Reducer
const authReducer = (state, action) => {
  switch (action.type) {
    case ActionTypes.LOGIN_START:
      return {
        ...state,
        loading: true,
        error: null
      };
    
    case ActionTypes.LOGIN_SUCCESS:
      return {
        ...state,
        user: action.payload.user,
        token: action.payload.token,
        isAuthenticated: true,
        loading: false,
        error: null
      };
    
    case ActionTypes.LOGIN_FAILURE:
      return {
        ...state,
        user: null,
        token: null,
        isAuthenticated: false,
        loading: false,
        error: action.payload
      };
    
    case ActionTypes.LOGOUT:
      return {
        ...state,
        user: null,
        token: null,
        isAuthenticated: false,
        loading: false,
        error: null
      };
    
    case ActionTypes.UPDATE_PROFILE:
      return {
        ...state,
        user: { ...state.user, ...action.payload }
      };
    
    case ActionTypes.CLEAR_ERROR:
      return {
        ...state,
        error: null
      };
    
    case ActionTypes.SET_LOADING:
      return {
        ...state,
        loading: action.payload
      };
    
    default:
      return state;
  }
};

// Create context
const AuthContext = createContext();

// Custom hook to use auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// API helper function
const apiCall = async (url, options = {}) => {
  const API_BASE_URL = '/api'; // Use the same base URL as in api.js
  const token = localStorage.getItem('token');
  const headers = {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
    ...options.headers
  };

  const fullUrl = url.startsWith('http') ? url : `${API_BASE_URL}${url}`;

  const response = await fetch(fullUrl, {
    ...options,
    headers
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Something went wrong');
  }

  return data;
};

// Auth Provider Component
export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Check if user is authenticated on app load
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const data = await apiCall('/api/auth/profile');
          dispatch({
            type: ActionTypes.LOGIN_SUCCESS,
            payload: {
              user: data.data.user,
              token
            }
          });
        } catch (error) {
          localStorage.removeItem('token');
          dispatch({ type: ActionTypes.LOGOUT });
        }
      } else {
        dispatch({ type: ActionTypes.SET_LOADING, payload: false });
      }
    };

    checkAuth();
  }, []);

  // Login function
  const login = async (credentials) => {
    dispatch({ type: ActionTypes.LOGIN_START });
    
    try {
      const data = await apiCall('/api/auth/login', {
        method: 'POST',
        body: JSON.stringify(credentials)
      });

      localStorage.setItem('token', data.data.token);
      
      dispatch({
        type: ActionTypes.LOGIN_SUCCESS,
        payload: data.data
      });

      return data;
    } catch (error) {
      dispatch({
        type: ActionTypes.LOGIN_FAILURE,
        payload: error.message
      });
      throw error;
    }
  };

  // Register function
  const register = async (userData) => {
    dispatch({ type: ActionTypes.LOGIN_START });
    
    try {
      const data = await apiCall('/api/auth/register', {
        method: 'POST',
        body: JSON.stringify(userData)
      });

      localStorage.setItem('token', data.data.token);
      
      dispatch({
        type: ActionTypes.LOGIN_SUCCESS,
        payload: data.data
      });

      return data;
    } catch (error) {
      dispatch({
        type: ActionTypes.LOGIN_FAILURE,
        payload: error.message
      });
      throw error;
    }
  };

  // Demo login function
  const demoLogin = async () => {
    dispatch({ type: ActionTypes.LOGIN_START });
    
    try {
      const data = await apiCall('/api/auth/demo-login', {
        method: 'POST'
      });

      localStorage.setItem('token', data.data.token);
      
      dispatch({
        type: ActionTypes.LOGIN_SUCCESS,
        payload: data.data
      });

      return data;
    } catch (error) {
      dispatch({
        type: ActionTypes.LOGIN_FAILURE,
        payload: error.message
      });
      throw error;
    }
  };

  // Logout function
  const logout = () => {
    localStorage.removeItem('token');
    dispatch({ type: ActionTypes.LOGOUT });
  };

  // Update profile function
  const updateProfile = async (profileData) => {
    try {
      const data = await apiCall('/api/auth/profile', {
        method: 'PUT',
        body: JSON.stringify(profileData)
      });

      dispatch({
        type: ActionTypes.UPDATE_PROFILE,
        payload: data.data.user
      });

      return data;
    } catch (error) {
      throw error;
    }
  };

  // Change password function
  const changePassword = async (passwordData) => {
    try {
      const data = await apiCall('/api/auth/change-password', {
        method: 'POST',
        body: JSON.stringify(passwordData)
      });

      return data;
    } catch (error) {
      throw error;
    }
  };

  // Clear error function
  const clearError = () => {
    dispatch({ type: ActionTypes.CLEAR_ERROR });
  };

  const value = {
    ...state,
    login,
    register,
    demoLogin,
    logout,
    updateProfile,
    changePassword,
    clearError
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
