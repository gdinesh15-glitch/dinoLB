import api from '../axios';

const userService = {
  getStats: async () => {
    try {
      const response = await api.get('/users/stats');
      return response.data;
    } catch (error) {
      console.warn('Backend getStats failed, using mock data...');
      const { DB } = await import('../../utils/db');
      const users = DB.get('users') || [];
      const books = DB.get('books') || [];
      const issued = DB.get('issued') || [];
      
      return {
        success: true,
        data: {
          librarians: users.filter(u => u.role === 'librarian').length,
          faculty: users.filter(u => u.role === 'faculty').length,
          students: users.filter(u => u.role === 'student').length,
          books: books.reduce((a, b) => a + (b.qty || 1), 0),
          issued: issued.filter(i => i.status !== 'returned').length,
          donations: 12
        }
      };
    }
  },

  getAllUsers: async () => {
    try {
      const response = await api.get('/users');
      return response.data;
    } catch (error) {
      console.warn('Backend getAllUsers failed, using mock data...');
      const { DB } = await import('../../utils/db');
      return { success: true, data: DB.get('users') || [] };
    }
  },

  addUser: async (userData) => {
    try {
      const response = await api.post('/users', userData);
      const { pushNotif } = await import('../../utils/db');
      pushNotif('fa-user-plus', 'rgba(110,231,183,.15)', '#6ee7b7', `New ${userData.role} added: ${userData.name}`, 'success');
      return response.data;
    } catch (error) {
      console.warn('Backend addUser failed, using mock data...');
      const { DB, pushNotif } = await import('../../utils/db');
      const users = DB.get('users') || [];
      const newUser = { ...userData, id: userData.userId || 'MOCK' + Date.now().toString().slice(-4), status: 'Active', created_at: new Date().toISOString() };
      DB.set('users', [...users, newUser]);
      pushNotif('fa-user-plus', 'rgba(110,231,183,.15)', '#6ee7b7', `New ${userData.role} registered: ${userData.name}`, 'success');
      return { success: true, data: newUser };
    }
  },

  updateUser: async (id, userData) => {
    try {
      const response = await api.put(`/users/${id}`, userData);
      const { pushNotif } = await import('../../utils/db');
      pushNotif('fa-user-edit', 'rgba(129,140,248,.15)', '#818cf8', `Profile updated for: ${userData.name}`, 'info');
      return response.data;
    } catch (error) {
      console.warn('Backend updateUser failed, using mock data...');
      const { DB, pushNotif } = await import('../../utils/db');
      const users = DB.get('users') || [];
      const updated = users.map(u => (u.id === id || u.userId === id) ? { ...u, ...userData } : u);
      DB.set('users', updated);
      pushNotif('fa-user-edit', 'rgba(129,140,248,.15)', '#818cf8', `Modified record: ${userData.name}`, 'info');
      return { success: true };
    }
  },

  deleteUser: async (id) => {
    try {
      const response = await api.delete(`/users/${id}`);
      return response.data;
    } catch (error) {
      console.warn('Backend deleteUser failed, using mock data...');
      const { DB, pushNotif } = await import('../../utils/db');
      const users = DB.get('users') || [];
      const user = users.find(u => u.id === id || u.userId === id);
      DB.set('users', users.filter(u => u.id !== id && u.userId !== id));
      if (user) pushNotif('fa-trash-alt', 'rgba(248,113,113,.15)', '#f87171', `Identity purged: ${user.name}`, 'warning');
      return { success: true };
    }
  },

  toggleUserStatus: async (userId) => {
    try {
      const response = await api.put(`/users/${userId}/status`);
      return { success: true, data: response.data };
    } catch (error) {
      console.warn('Backend toggleUserStatus failed, using mock data...');
      const { DB, pushNotif } = await import('../../utils/db');
      const users = DB.get('users') || [];
      const updated = users.map(u => (u.id === userId || u.userId === userId) ? { ...u, status: u.status === 'Active' ? 'Inactive' : 'Active' } : u);
      const user = updated.find(u => u.id === userId || u.userId === userId);
      DB.set('users', updated);
      if (user) pushNotif('fa-shield-alt', 'rgba(251,191,36,.15)', '#fbbf24', `${user.name} access state changed to ${user.status}`, 'info');
      return { success: true };
    }
  }
};

export default userService;
