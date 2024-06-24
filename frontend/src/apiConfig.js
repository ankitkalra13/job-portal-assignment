const API_BASE_URL = 'http://localhost:5001';

const API_ENDPOINTS = {
  SIGNUP: `${API_BASE_URL}/auth/signup`,
  SIGNIN: `${API_BASE_URL}/auth/signin`,
  REQUEST_PASSWORD_RESET: `${API_BASE_URL}/auth/request-password-reset`,
  VERIFY_TOKEN: `${API_BASE_URL}/auth/verify-token`,
  RESET_PASSWORD: `${API_BASE_URL}/auth/reset-password`,
  VERIFY_USER: `${API_BASE_URL}/auth/verify-user-authorization`,
  LOGOUT: `${API_BASE_URL}/auth/logout`
};

export default API_ENDPOINTS;
