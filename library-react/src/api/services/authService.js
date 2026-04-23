import api from '../axios';

const authService = {
  login: async (userId, password) => {
    try {
      const response = await api.post('/auth/login', { userId, password });
      if (response.data.success) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('session', JSON.stringify(response.data.user));
      }
      return response.data;
    } catch (error) {
      console.warn('Backend login failed, attempting mock fallback...');
      
      // MOCK FALLBACK
      const { DB } = await import('../../utils/db');
      const users = DB.get('users') || [];
      const user = users.find(u => u.id === userId && u.password === password);
      
      if (user) {
        localStorage.setItem('token', 'mock-token-' + Date.now());
        localStorage.setItem('session', JSON.stringify(user));
        return { success: true, user };
      }

      return {
        success: false,
        error: error.response?.data?.message || 'Login failed. Please check your credentials or backend connection.'
      };
    }
  },

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('session');
  }
};

export default authService;
