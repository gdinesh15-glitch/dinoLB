import api from '../axios';

const authService = {
  login: async (userId, password, role) => {
    try {
      const response = await api.post('/auth/login', { userId, password, role });
      const data = response.data;

      // Backend returns { success: true, token, user } on success
      if (data && data.success && data.token) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('session', JSON.stringify(data.user));
        return { success: true, user: data.user };
      }

      return { success: false, error: 'Login failed. Invalid server response.' };
    } catch (error) {
      const msg = error.response?.data?.message || 'Login failed. Check your credentials or backend connection.';
      return { success: false, error: msg };
    }
  },

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('session');
    window.location.href = '/login';
  }
};

export default authService;
