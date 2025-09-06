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
  // API call function
  const apiCall = async (endpoint, method = 'GET', data = null) => {
    const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api'; // Use env variable with fallback
    
    // Ensure endpoint starts with / and doesn't duplicate the /api
    const normalizedEndpoint = endpoint.startsWith('/') 
      ? endpoint 
      : `/${endpoint}`;
    
    const url = `${API_BASE_URL}${normalizedEndpoint}`;
    
    const headers = {
      'Content-Type': 'application/json',
    };

    const token = state.token || localStorage.getItem('token');
    
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    const config = {
      method,
      headers,
      credentials: 'include',
    };

    if (data) {
      config.body = JSON.stringify(data);
    }

    try {
      const response = await fetch(url, config);
      const responseData = await response.json();

      if (!response.ok) {
        throw new Error(responseData.message || 'Something went wrong');
      }

      return responseData;
    } catch (error) {
      console.error('API call error:', error);
      throw error;
    }
  };

// Auth Provider Component
export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Check if user is authenticated on app load
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('token');
      const savedUser = localStorage.getItem('user');
      
      if (token) {
        try {
          // First restore user from localStorage for instant UI update
          if (savedUser) {
            const parsedUser = JSON.parse(savedUser);
            dispatch({
              type: ActionTypes.LOGIN_SUCCESS,
              payload: {
                user: parsedUser,
                token
              }
            });
          }
          
          // Then verify with backend (this will update if necessary)
          const data = await apiCall('/auth/profile');
          if (data && data.data && data.data.user) {
            // Update localStorage with latest user data
            localStorage.setItem('user', JSON.stringify(data.data.user));
            
            dispatch({
              type: ActionTypes.LOGIN_SUCCESS,
              payload: {
                user: data.data.user,
                token
              }
            });
          }
        } catch (error) {
          console.error('Auth verification error:', error);
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          dispatch({ type: ActionTypes.LOGOUT });
        }
      } else {
        localStorage.removeItem('user');
        dispatch({ type: ActionTypes.SET_LOADING, payload: false });
      }
    };

    checkAuth();
  }, []);

  // Login function
  const login = async (credentials) => {
    dispatch({ type: ActionTypes.LOGIN_REQUEST });

    try {
      const response = await apiCall('/auth/login', 'POST', credentials);
      
      if (response.success) {
        const { token, user } = response.data;
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));
        
        dispatch({
          type: ActionTypes.LOGIN_SUCCESS,
          payload: { user, token }
        });

        return { success: true };
      } else {
        dispatch({
          type: ActionTypes.LOGIN_FAILURE,
          payload: response.message || 'Login failed'
        });
        return { success: false, message: response.message || 'Login failed' };
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message || 'Login failed';
      dispatch({
        type: ActionTypes.LOGIN_FAILURE,
        payload: errorMessage
      });
      return { success: false, message: errorMessage };
    }
  };  // Register function
  const register = async (userData) => {
    dispatch({ type: ActionTypes.REGISTER_REQUEST });

    try {
      const response = await apiCall('/auth/register', 'POST', userData);
      
      if (response.success) {
        const { token, user } = response.data;
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));
        
        dispatch({
          type: ActionTypes.REGISTER_SUCCESS,
          payload: { user, token }
        });

        return { success: true };
      } else {
        dispatch({
          type: ActionTypes.REGISTER_FAILURE,
          payload: response.message || 'Registration failed'
        });
        return { success: false, message: response.message || 'Registration failed' };
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message || 'Registration failed';
      dispatch({
        type: ActionTypes.REGISTER_FAILURE,
        payload: errorMessage
      });
      return { success: false, message: errorMessage };
    }
  };

  // Demo login function
  const demoLogin = async () => {
    dispatch({ type: ActionTypes.LOGIN_START });
    
    try {
      // First try demo-login endpoint if available
      try {
        const response = await apiCall('/auth/demo-login', 'POST');
        
        if (response.success) {
          const { token, user } = response.data;
          localStorage.setItem('token', token);
          localStorage.setItem('user', JSON.stringify(user));
          
          dispatch({
            type: ActionTypes.LOGIN_SUCCESS,
            payload: { user, token }
          });
          
          return { success: true };
        }
      } catch (err) {
        console.log("Demo endpoint not available, falling back to credentials");
      }
      
      // Fall back to regular login with demo credentials
      return await login({
        email: 'demo@ecosearch.com',
        password: 'demo123'
      });
    } catch (error) {
      const errorMessage = error.message || 'Demo login failed';
      dispatch({
        type: ActionTypes.LOGIN_FAILURE,
        payload: errorMessage
      });
      return { success: false, message: errorMessage };
    }
  };

  // Logout function
  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
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
