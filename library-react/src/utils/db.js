// ═══════════════════════════════════════════════════════════
//  BiblioTech LMS — Database Utility (LocalStorage ORM)
// ═══════════════════════════════════════════════════════════

const PREFIX = 'lms_';

export const DB = {
  get(k) { try { return JSON.parse(localStorage.getItem(PREFIX + k)); } catch { return null; } },
  set(k, v) { localStorage.setItem(PREFIX + k, JSON.stringify(v)); },
  del(k) { localStorage.removeItem(PREFIX + k); },
  keys() { return Object.keys(localStorage).filter(k => k.startsWith(PREFIX)).map(k => k.slice(PREFIX.length)); },
  clear() { Object.keys(localStorage).forEach(k => k.startsWith(PREFIX) && localStorage.removeItem(k)); }
};

// ── Date Helpers ──────────────────────────────────────────
export const today = () => new Date().toISOString().split('T')[0];
export const addDays = (d, n) => { const dt = new Date(d); dt.setDate(dt.getDate() + n); return dt.toISOString().split('T')[0]; };
export const daysDiff = (a, b) => Math.round((new Date(b) - new Date(a)) / 86400000);
export const fmtDate = s => { if (!s) return '—'; return new Date(s).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }); };
export const timeAgo = ts => {
  if (!ts) return 'just now';
  const s = Math.floor((Date.now() - ts) / 1000);
  if (s < 60) return s + 's ago';
  if (s < 3600) return Math.floor(s / 60) + 'm ago';
  if (s < 86400) return Math.floor(s / 3600) + 'h ago';
  return Math.floor(s / 86400) + 'd ago';
};

// ── ID Generator ──────────────────────────────────────────
export const genId = (prefix = '') => prefix + Date.now().toString(36) + Math.random().toString(36).slice(2, 6);

// ── Seed Data ─────────────────────────────────────────────
export function seedData() {
  if (DB.get('seeded')) return;
  const t = today();

  // ── Users ──
  DB.set('users', [
    { id: 'ADMIN01', role: 'admin', name: 'Dr. K. Subba Reddy', email: 'admin@library.edu', password: 'admin123', dept: 'Administration', phone: '9876543200', status: 'Active', created_at: '2020-01-01' },
    { id: 'LIB001', role: 'librarian', name: 'Jane Doe', email: 'librarian@library.edu', password: 'lib123', dept: 'Library Sciences', phone: '9876543201', status: 'Active', created_at: '2021-03-15' },
    { id: 'LIB002', role: 'librarian', name: 'Smt. Padmavathi', email: 'padma@library.edu', password: 'lib123', dept: 'Library Sciences', phone: '9876543202', status: 'Active', created_at: '2022-01-10' },
    { id: 'FAC001', role: 'faculty', name: 'Dr. Ramesh Kumar', email: 'ramesh@university.edu', password: 'fac123', dept: 'Computer Science', phone: '9876543203', status: 'Active', created_at: '2019-07-01' },
    { id: 'FAC002', role: 'faculty', name: 'Dr. Anitha Devi', email: 'anitha@university.edu', password: 'fac123', dept: 'Electronics', phone: '9876543204', status: 'Active', created_at: '2020-06-01' },
    { id: 'STU001', role: 'student', name: 'Aditya Sharma', email: 'aditya@student.edu', password: 'stu123', dept: 'B.Tech CSE', year: '3rd Year', phone: '9876543210', status: 'Active', created_at: '2021-11-01' },
    { id: 'STU002', role: 'student', name: 'Priya Nair', email: 'priya@student.edu', password: 'stu123', dept: 'B.Tech CSE', year: '3rd Year', phone: '9876543211', status: 'Active', created_at: '2021-11-01' },
    { id: 'STU003', role: 'student', name: 'Suresh Babu', email: 'suresh@student.edu', password: 'stu123', dept: 'B.Tech ECE', year: '2nd Year', phone: '9876543212', status: 'Active', created_at: '2022-08-01' },
    { id: 'STU004', role: 'student', name: 'Meera Patel', email: 'meera@student.edu', password: 'stu123', dept: 'B.Tech IT', year: '4th Year', phone: '9876543213', status: 'Active', created_at: '2020-11-01' },
  ]);

  // ── System Config ──
  DB.set('system_config', [
    { id: 'c1', config_key: 'STUDENT_MAX_BORROW', config_value: '3', description: 'Max items a student can borrow' },
    { id: 'c2', config_key: 'FACULTY_MAX_BORROW', config_value: '10', description: 'Max items a faculty can borrow' },
    { id: 'c3', config_key: 'STUDENT_LOAN_PERIOD', config_value: '14', description: 'Loan period for students (days)' },
    { id: 'c4', config_key: 'FACULTY_LOAN_PERIOD', config_value: '45', description: 'Loan period for faculty (days)' },
    { id: 'c5', config_key: 'FINE_RATE_PER_DAY', config_value: '5', description: 'Fine per overdue day (₹)' },
    { id: 'c6', config_key: 'SYSTEM_NAME', config_value: 'BiblioTech LMS', description: 'Application name' },
  ]);

  // ── Books (Catalog Metadata) ──
  DB.set('books', [
    { id: 'BK001', isbn: '978-0071606301', title: 'Java: The Complete Reference', author: 'Herbert Schildt', genre: 'Programming', category: 'Java', cover_image_url: '', is_digital: false, digital_asset_url: '', is_course_reserve: false, qty: 5, available: 3, shelf: 'A-01', year: 2018, borrow: 32, publisher: 'McGraw-Hill' },
    { id: 'BK002', isbn: '978-0596009205', title: 'Head First Java', author: 'Kathy Sierra', genre: 'Programming', category: 'Java', cover_image_url: '', is_digital: true, digital_asset_url: 'https://example.com/headfirst.pdf', is_course_reserve: false, qty: 4, available: 2, shelf: 'A-02', year: 2015, borrow: 27, publisher: "O'Reilly" },
    { id: 'BK003', isbn: '978-1593279288', title: 'Python Crash Course', author: 'Eric Matthes', genre: 'Programming', category: 'Python', cover_image_url: '', is_digital: false, digital_asset_url: '', is_course_reserve: false, qty: 5, available: 4, shelf: 'B-01', year: 2019, borrow: 28, publisher: 'No Starch Press' },
    { id: 'BK004', isbn: '978-0134685991', title: 'Effective Java', author: 'Joshua Bloch', genre: 'Programming', category: 'Java', cover_image_url: '', is_digital: true, digital_asset_url: 'https://example.com/effectivejava.pdf', is_course_reserve: true, qty: 3, available: 1, shelf: 'A-03', year: 2018, borrow: 15, publisher: 'Addison-Wesley' },
    { id: 'BK005', isbn: '978-0136042594', title: 'AI: A Modern Approach', author: 'Russell & Norvig', genre: 'AI/ML', category: 'AI/ML', cover_image_url: '', is_digital: false, digital_asset_url: '', is_course_reserve: true, qty: 4, available: 2, shelf: 'C-01', year: 2020, borrow: 25, publisher: 'Pearson' },
    { id: 'BK006', isbn: '978-0321125217', title: 'Domain-Driven Design', author: 'Eric Evans', genre: 'Software Engineering', category: 'Architecture', cover_image_url: '', is_digital: false, digital_asset_url: '', is_course_reserve: false, qty: 2, available: 2, shelf: 'D-03', year: 2004, borrow: 8, publisher: 'Addison-Wesley' },
    { id: 'BK007', isbn: '978-0262033848', title: 'Introduction to Algorithms', author: 'Cormen et al.', genre: 'Computer Science', category: 'Data Structures', cover_image_url: '', is_digital: false, digital_asset_url: '', is_course_reserve: false, qty: 6, available: 5, shelf: 'D-01', year: 2009, borrow: 22, publisher: 'MIT Press' },
    { id: 'BK008', isbn: '978-0131103627', title: 'The C Programming Language', author: 'Kernighan & Ritchie', genre: 'Programming', category: 'C', cover_image_url: '', is_digital: true, digital_asset_url: 'https://example.com/cprog.pdf', is_course_reserve: false, qty: 4, available: 3, shelf: 'A-05', year: 1988, borrow: 40, publisher: 'Prentice Hall' },
    { id: 'BK009', isbn: '978-0596517748', title: 'JavaScript: The Good Parts', author: 'Douglas Crockford', genre: 'Web Development', category: 'Web Development', cover_image_url: '', is_digital: false, digital_asset_url: '', is_course_reserve: false, qty: 3, available: 1, shelf: 'E-01', year: 2008, borrow: 19, publisher: "O'Reilly" },
    { id: 'BK010', isbn: '978-1491950357', title: 'Learning React', author: 'Alex Banks', genre: 'Web Development', category: 'Web Development', cover_image_url: '', is_digital: true, digital_asset_url: 'https://example.com/react.pdf', is_course_reserve: false, qty: 3, available: 2, shelf: 'E-02', year: 2020, borrow: 14, publisher: "O'Reilly" },
    { id: 'BK011', isbn: '978-0134757599', title: 'Refactoring', author: 'Martin Fowler', genre: 'Software Engineering', category: 'Architecture', cover_image_url: '', is_digital: false, digital_asset_url: '', is_course_reserve: false, qty: 2, available: 2, shelf: 'D-04', year: 2019, borrow: 6, publisher: 'Addison-Wesley' },
    { id: 'BK012', isbn: '978-0135166307', title: 'Clean Architecture', author: 'Robert C. Martin', genre: 'Software Engineering', category: 'Architecture', cover_image_url: '', is_digital: false, digital_asset_url: '', is_course_reserve: false, qty: 3, available: 3, shelf: 'D-05', year: 2018, borrow: 11, publisher: 'Pearson' },
    { id: 'BK013', isbn: '978-8121902915', title: 'Engineering Mathematics', author: 'B.S. Grewal', genre: 'Mathematics', category: 'Mathematics', cover_image_url: '', is_digital: false, digital_asset_url: '', is_course_reserve: false, qty: 6, available: 6, shelf: 'H-01', year: 2020, borrow: 30, publisher: 'Khanna Publishers' },
  ]);

  // ── Branches ──
  DB.set('branches', [
    { id: 'BR01', name: 'Main Campus Library', location: 'Building A, Ground Floor' },
    { id: 'BR02', name: 'Science Block Library', location: 'Building C, 2nd Floor' },
    { id: 'BR03', name: 'Digital Resource Center', location: 'Building B, 1st Floor' },
  ]);

  // ── Circulation Loans (Issued Books) ──
  DB.set('issued', [
    { txId: 'TX0000001', userId: 'STU001', userName: 'Aditya Sharma', bookId: 'BK001', bookTitle: 'Java: The Complete Reference', issueDate: addDays(t, -20), dueDate: addDays(t, -6), returnDate: null, status: 'issued', fine: 0, issuedBy: 'LIB001', ts: Date.now() - 20 * 86400000 },
    { txId: 'TX0000002', userId: 'STU002', userName: 'Priya Nair', bookId: 'BK005', bookTitle: 'AI: A Modern Approach', issueDate: addDays(t, -8), dueDate: addDays(t, 6), returnDate: null, status: 'issued', fine: 0, issuedBy: 'LIB001', ts: Date.now() - 8 * 86400000 },
    { txId: 'TX0000003', userId: 'STU003', userName: 'Suresh Babu', bookId: 'BK009', bookTitle: 'JavaScript: The Good Parts', issueDate: addDays(t, -30), dueDate: addDays(t, -16), returnDate: null, status: 'issued', fine: 0, issuedBy: 'LIB002', ts: Date.now() - 30 * 86400000 },
    { txId: 'TX0000004', userId: 'FAC001', userName: 'Dr. Ramesh Kumar', bookId: 'BK004', bookTitle: 'Effective Java', issueDate: addDays(t, -10), dueDate: addDays(t, 35), returnDate: null, status: 'issued', fine: 0, issuedBy: 'LIB001', ts: Date.now() - 10 * 86400000 },
  ]);

  // ── Fines ──
  DB.set('fines', [
    { id: 'FN001', userId: 'STU001', loanId: 'TX0000001', amount: 30, status: 'Unpaid', waive_reason: null },
    { id: 'FN002', userId: 'STU003', loanId: 'TX0000003', amount: 80, status: 'Unpaid', waive_reason: null },
  ]);

  // ── Hold Queue ──
  DB.set('hold_queue', [
    { id: 'HQ001', userId: 'STU004', bookId: 'BK009', requestDate: addDays(t, -5), status: 'Pending', position: 1 },
  ]);

  // ── Procurement Requests ──
  DB.set('procurement_requests', [
    { id: 'PR001', facultyId: 'FAC001', facultyName: 'Dr. Ramesh Kumar', resourceType: 'Book', title: 'Deep Learning with Python', details: 'Required for AI elective course next semester', status: 'Pending', date: addDays(t, -3) },
    { id: 'PR002', facultyId: 'FAC002', facultyName: 'Dr. Anitha Devi', resourceType: 'Journal', title: 'IEEE Transactions on VLSI Systems', details: 'Annual subscription renewal needed', status: 'Approved', date: addDays(t, -10) },
  ]);

  // ── Course Reserve Requests ──
  DB.set('course_reserves', [
    { id: 'CR001', facultyId: 'FAC001', bookId: 'BK005', bookTitle: 'AI: A Modern Approach', courseName: 'CS601 - Artificial Intelligence', semester: 'Fall 2026', status: 'Active', date: addDays(t, -15) },
    { id: 'CR002', facultyId: 'FAC001', bookId: 'BK004', bookTitle: 'Effective Java', courseName: 'CS301 - OOP', semester: 'Fall 2026', status: 'Active', date: addDays(t, -12) },
  ]);

  // ── ILL Requests ──
  DB.set('ill_requests', [
    { id: 'ILL001', facultyId: 'FAC002', title: 'Quantum Computing: An Applied Approach', author: 'Jack Hidary', institution: '', status: 'Pending', date: addDays(t, -2), notes: 'Not available in our library, needed for advanced research' },
  ]);

  // ── Wishlist (Student) ──
  DB.set('wishlists', {
    STU001: ['BK010', 'BK012'],
    STU002: ['BK003'],
  });

  // ── Audit Logs ──
  DB.set('audit_logs', [
    { id: 'AL001', userId: 'ADMIN01', action: 'SYSTEM_SEED', target: 'Database', details: 'Initial data seeded', timestamp: Date.now() },
    { id: 'AL002', userId: 'LIB001', action: 'BOOK_ISSUE', target: 'TX0000001', details: 'Issued BK001 to STU001', timestamp: Date.now() - 20 * 86400000 },
  ]);

  // ── Activity Feed ──
  DB.set('activity', [
    { icon: 'fa-book', bg: 'rgba(125,211,252,.15)', color: '#7dd3fc', text: 'System initialized with 13 books', ts: Date.now() - 5 * 86400000 },
    { icon: 'fa-user-plus', bg: 'rgba(110,231,183,.15)', color: '#6ee7b7', text: '9 users registered in system', ts: Date.now() - 4 * 86400000 },
    { icon: 'fa-arrow-up', bg: 'rgba(253,186,116,.15)', color: '#fdba74', text: 'Book "Java: The Complete Reference" issued to Aditya', ts: Date.now() - 20 * 86400000 },
  ]);

  // ── Notifications ──
  DB.set('notifications', [
    { id: 1, icon: 'fa-bell', bg: 'rgba(253,230,138,.15)', color: '#fde68a', text: 'Welcome to BiblioTech LMS!', type: 'info', ts: Date.now(), read: false },
    { id: 2, icon: 'fa-exclamation-triangle', bg: 'rgba(248,113,113,.15)', color: '#f87171', text: '2 overdue books detected', type: 'warning', ts: Date.now() - 86400000, read: false },
  ]);

  // ── Announcements (Phase 2) ──
  DB.set('announcements', [
    { id: 'AN001', type: 'Urgent', title: 'Power Maintenance', text: 'E-Library services will be offline this Sunday (22 Apr) from 02:00 to 05:00 IST.', author: 'Admin Console', date: addDays(t, 2), icon: 'fa-bolt' },
    { id: 'AN002', type: 'Info', title: 'New IEEE Resources', text: 'Access to IEEE Transactions on Signal Processing is now active for all departments.', author: 'Librarian Desk', date: addDays(t, -2), icon: 'fa-newspaper' },
    { id: 'AN003', type: 'Global', title: 'Library Week 2026', text: 'Join us for the annual Book Fair from May 1st to May 7th in the South Wing.', author: 'Management', date: addDays(t, 10), icon: 'fa-calendar-check' },
  ]);

  // ── Registration Approval Queue ──
  DB.set('registrations', [
    { id: 'REG001', name: 'Nohan Krishna', email: 'mohan@stud.edu', role: 'student', dept: 'B.Tech IT', status: 'Pending', date: addDays(t, -1) },
    { id: 'REG002', name: 'Prof. S. Murali', email: 'murali@univ.edu', role: 'faculty', dept: 'Physics', status: 'Pending', date: addDays(t, 0) },
  ]);

  // ── Seat Booking (Simulation) ──
  DB.set('seat_bookings', [
    { id: 'B001', userId: 'STU001', seat: 'Reading Hall - A12', time: '14:00 - 16:00', date: t },
  ]);

  DB.set('seeded', true);
}

// ── DB Helper: Add activity ──
export const addActivity = (icon, color, text, bg) => {
  const act = DB.get('activity') || [];
  const newAct = { icon, color, text, bg: bg || 'rgba(61,50,88,.6)', ts: Date.now() };
  act.unshift(newAct);
  DB.set('activity', act.slice(0, 50));
  return newAct;
};

// ── DB Helper: Push notification ──
export const pushNotif = (icon, bg, color, text, type = 'info') => {
  const notifs = DB.get('notifications') || [];
  const newNotif = { id: Date.now(), icon, bg, color, text, type, ts: Date.now(), read: false };
  notifs.unshift(newNotif);
  DB.set('notifications', notifs.slice(0, 20));
  return newNotif;
};

// ── DB Helper: Add audit log ──
export const addAuditLog = (userId, action, target, details) => {
  const logs = DB.get('audit_logs') || [];
  const newLog = { id: genId('AL'), userId, action, target, details, timestamp: Date.now() };
  logs.unshift(newLog);
  DB.set('audit_logs', logs.slice(0, 200));
  return newLog;
};
