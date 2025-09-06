import React, { useState } from 'react';
import { useAuth } from '../App';
import { useFormValidation } from '../hooks';
import { Button, Input, Card } from '../components/ui';
import apiService, { ApiError } from '../services/apiService';

const validationRules = {
  email: { required: true, email: true },
  password: { required: true, minLength: 6 },
  name: { required: true, minLength: 2 }
};

function LoginScreen() {
  const { login } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const currentRules = isLogin 
    ? { email: validationRules.email, password: { required: true } }
    : validationRules;

  const {
    values,
    errors,
    touched,
    setValue,
    setFieldTouched,
    validateAll,
    isValid
  } = useFormValidation(
    { email: '', password: '', name: '' },
    currentRules
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!validateAll()) {
      return;
    }

    setLoading(true);

    try {
      if (isLogin) {
        const data = await apiService.login({
          email: values.email,
          password: values.password
        });
        login(data);
      } else {
        await apiService.register({
          email: values.email,
          password: values.password,
          name: values.name
        });
        setIsLogin(true);
        setValue('password', '');
        setError('Registration successful! Please log in.');
      }
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  const toggleMode = () => {
    setIsLogin(!isLogin);
    setError('');
    setValue('password', '');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-blue-50 p-4">
      <Card className="p-8 w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-green-600 mb-2">EcoFinds</h1>
          <p className="text-gray-600">Sustainable marketplace for everyone</p>
        </div>

        {/* Mode Toggle */}
        <div className="flex rounded-lg bg-gray-100 p-1 mb-6">
          <button
            type="button"
            onClick={toggleMode}
            className={`flex-1 py-2 px-4 rounded-md transition-all ${
              isLogin ? 'bg-white shadow-sm font-medium' : 'text-gray-600'
            }`}
          >
            Login
          </button>
          <button
            type="button"
            onClick={toggleMode}
            className={`flex-1 py-2 px-4 rounded-md transition-all ${
              !isLogin ? 'bg-white shadow-sm font-medium' : 'text-gray-600'
            }`}
          >
            Sign Up
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <Input
              label="Full Name"
              type="text"
              placeholder="Enter your full name"
              value={values.name}
              onChange={e => setValue('name', e.target.value)}
              onBlur={() => setFieldTouched('name')}
              error={errors.name}
              touched={touched.name}
              required
            />
          )}
          
          <Input
            label="Email"
            type="email"
            placeholder="Enter your email"
            value={values.email}
            onChange={e => setValue('email', e.target.value)}
            onBlur={() => setFieldTouched('email')}
            error={errors.email}
            touched={touched.email}
            required
          />
          
          <Input
            label="Password"
            type="password"
            placeholder={isLogin ? "Enter your password" : "Choose a password (min 6 characters)"}
            value={values.password}
            onChange={e => setValue('password', e.target.value)}
            onBlur={() => setFieldTouched('password')}
            error={errors.password}
            touched={touched.password}
            required
          />

          {error && (
            <div className={`text-sm text-center p-3 rounded-lg ${
              error.includes('successful') 
                ? 'text-green-700 bg-green-50' 
                : 'text-red-700 bg-red-50'
            }`}>
              {error}
            </div>
          )}

          <Button
            type="submit"
            loading={loading}
            disabled={!isValid}
            className="w-full"
          >
            {isLogin ? 'Sign In' : 'Create Account'}
          </Button>
        </form>

        {/* Demo Info */}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            <strong>Demo:</strong> demo@ecofinds.com / demo123
          </p>
        </div>
      </Card>
    </div>
  );
}

export default LoginScreen;
