export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
export const UPLOADS_BASE_URL = import.meta.env.VITE_UPLOADS_URL || 'http://localhost:5000';

// Configure axios defaults
import axios from 'axios';

if (import.meta.env.PROD) {
  axios.defaults.baseURL = API_BASE_URL;
}
