import api from '../axios';

const bookService = {
  getAllBooks: async () => {
    try {
      const response = await api.get('/books');
      return response.data;
    } catch (error) {
      console.warn('Backend getAllBooks failed, using mock data...');
      const { DB } = await import('../../utils/db');
      return { success: true, data: DB.get('books') || [] };
    }
  },

  getPopularBooks: async () => {
    try {
      const response = await api.get('/books/popular');
      return response.data;
    } catch (error) {
      console.warn('Backend getPopularBooks failed, using mock data...');
      const { DB } = await import('../../utils/db');
      const books = DB.get('books') || [];
      const popular = [...books].sort((a, b) => (b.borrow || 0) - (a.borrow || 0)).slice(0, 6);
      return { success: true, data: popular };
    }
  },

  addBook: async (bookData) => {
    try {
      const response = await api.post('/books', bookData);
      const { pushNotif } = await import('../../utils/db');
      pushNotif('fa-book', 'rgba(129,140,248,.15)', '#818cf8', `New book added: ${bookData.title}`, 'success');
      return response.data;
    } catch (error) {
      console.warn('Backend addBook failed, using mock data...');
      const { DB, pushNotif } = await import('../../utils/db');
      const books = DB.get('books') || [];
      const newBook = { ...bookData, id: 'BK' + Date.now().toString().slice(-4), available: bookData.qty || 1 };
      DB.set('books', [...books, newBook]);
      pushNotif('fa-book', 'rgba(129,140,248,.15)', '#818cf8', `New asset registered: ${bookData.title}`, 'success');
      return { success: true, data: newBook };
    }
  },

  deleteBook: async (id) => {
    try {
      const response = await api.delete(`/books/${id}`);
      return response.data;
    } catch (error) {
      console.warn('Backend deleteBook failed, using mock data...');
      const { DB, pushNotif } = await import('../../utils/db');
      const books = DB.get('books') || [];
      const book = books.find(b => b.id === id);
      DB.set('books', books.filter(b => b.id !== id));
      if (book) pushNotif('fa-trash-alt', 'rgba(248,113,113,.15)', '#f87171', `Book removed: ${book.title}`, 'warning');
      return { success: true };
    }
  }
};

export default bookService;
