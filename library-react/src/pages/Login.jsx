import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../style.css';

const Login = () => {
  const [role, setRole] = useState('admin');
  const [id, setId] = useState('');
  const [password, setPassword] = useState('');
  const [remember, setRemember] = useState(false);
  const [showPw, setShowPw] = useState(false);
  const [showForgot, setShowForgot] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const { login } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const floatingBooks = document.getElementById('floatingBooks');
    if (floatingBooks && floatingBooks.children.length === 0) {
      const bookIcons = ['📚', '📖', '📘', '📗', '📕', '📔'];
      for (let i = 0; i < 15; i++) {
        const span = document.createElement('span');
        span.className = 'fb';
        span.innerText = bookIcons[Math.floor(Math.random() * bookIcons.length)];
        span.style.left = `${Math.random() * 100}%`;
        span.style.animationDuration = `${15 + Math.random() * 15}s`;
        span.style.animationDelay = `${Math.random() * 10}s`;
        floatingBooks.appendChild(span);
      }
    }
  }, []);

  const handleLogin = async (e) => {
    e?.preventDefault();
    if (!id || !password) return alert('Please enter both ID and Password');
    setIsLoading(true);
    try {
      const result = await login(id, password);
      if (result.success) {
        const userRole = result.user.role?.toLowerCase();
        navigate(`/${userRole}`);
      } else {
        alert(result.error || 'Invalid credentials. Check your ID and password.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickDemo = (roleKey, demoId, demoPw) => {
    setRole(roleKey);
    setId(demoId);
    setPassword(demoPw);
  };

  return (
    <div className="login-body">
      <div className="login-bg">
          <div className="mesh-gradient"></div>
          <div className="grid-pattern"></div>
          <div className="floating-books" id="floatingBooks"></div>
          <div className="aurora-orb"></div>
          <div className="aurora-orb"></div>
          <div className="aurora-orb"></div>
      </div>

      {/* LEFT PANEL */}
      <div className="login-left">
          <div className="college-brand">
              <Link to="/" className="college-logo-wrap hover:scale-105 transition-transform" style={{ cursor: 'pointer', display: 'block' }}>
                  <img src="https://media.licdn.com/dms/image/v2/D560BAQHJIT8-FuU2TA/company-logo_200_200/company-logo_200_200/0/1688781414722?e=2147483647&v=beta&t=bxWJP5MCqw6aGa36-eCMydRjX7ZQMt5sVi9xU-wBlbQ" alt="VEMU Logo" className="college-logo" />
              </Link>
              <div>
                  <h1 className="college-name">VEMU Institute of Technology</h1>
                  <p className="college-sub">P. Kothakota, Near Pakala, Chittoor Dist., A.P. — 517 112</p>
                  <p className="college-est"><i className="fas fa-award"></i> Estd. 2005 &nbsp;•&nbsp; AICTE Approved &nbsp;•&nbsp; JNTUA Affiliated</p>
              </div>
          </div>

          {/* VEMU campus photo */}
          <div className="vemu-campus-hero">
              <img src="https://images.shiksha.com/mediadata/images/1491905641phpAZEI2c.jpeg" alt="VEMU Institute of Technology Campus" className="campus-img" />
              <div className="campus-overlay">
                  <div className="campus-title">VEMU Institute of Technology — Chittoor, A.P.</div>
                  <div className="campus-sub">An institution of academic excellence in engineering & technology</div>
                  <div className="campus-divider"></div>
                  <div className="campus-stats">
                      <div className="cs-item"><span className="cs-num">10K+</span><span className="cs-label">Books</span></div>
                      <div className="cs-div"></div>
                      <div className="cs-item"><span className="cs-num">5K+</span><span className="cs-label">Students</span></div>
                      <div className="cs-div"></div>
                      <div className="cs-item"><span className="cs-num">500+</span><span className="cs-label">Journals</span></div>
                      <div className="cs-div"></div>
                      <div className="cs-item"><span className="cs-num">2005</span><span className="cs-label">Est.</span></div>
                  </div>
              </div>
          </div>

          <h2 className="hero-title">Knowledge is the Key to Success</h2>
          <p className="hero-desc">VEMU's Central Library — your gateway to academic excellence. Manage books, track dues, donate knowledge, and more with our modern Library Management System.</p>
          <div className="trust-row">
              <div className="trust-item"><i className="fas fa-shield-alt"></i><span>Secure Access</span></div>
              <div className="trust-item"><i className="fas fa-bell"></i><span>Due Alerts</span></div>
              <div className="trust-item"><i className="fas fa-hand-holding-heart"></i><span>Book Donations</span></div>
              <div className="trust-item"><i className="fas fa-chart-bar"></i><span>Live Analytics</span></div>
          </div>
      </div>

      {/* RIGHT PANEL — LOGIN CARD */}
      <div className="login-right">
          <div className="login-card">
              <div className="lc-head">
                  <div className="lc-icon"><i className="fas fa-book-reader"></i></div>
                  <h2>Library Portal</h2>
                  <p>Sign in to access your account</p>
              </div>

              {/* Role selector */}
              <div className="role-grid">
                  <label className={`role-opt ${role === 'admin' ? 'active' : ''}`}>
                      <input type="radio" name="role" value="admin" checked={role === 'admin'} onChange={() => setRole('admin')} />
                      <div className="ro-icon"><i className="fas fa-user-shield"></i></div>
                      <span>Admin</span>
                  </label>
                  <label className={`role-opt ${role === 'librarian' ? 'active' : ''}`}>
                      <input type="radio" name="role" value="librarian" checked={role === 'librarian'} onChange={() => setRole('librarian')} />
                      <div className="ro-icon"><i className="fas fa-user-tie"></i></div>
                      <span>Librarian</span>
                  </label>
                  <label className={`role-opt ${role === 'faculty' ? 'active' : ''}`}>
                      <input type="radio" name="role" value="faculty" checked={role === 'faculty'} onChange={() => setRole('faculty')} />
                      <div className="ro-icon"><i className="fas fa-chalkboard-teacher"></i></div>
                      <span>Faculty</span>
                  </label>
                  <label className={`role-opt ${role === 'student' ? 'active' : ''}`}>
                      <input type="radio" name="role" value="student" checked={role === 'student'} onChange={() => setRole('student')} />
                      <div className="ro-icon"><i className="fas fa-user-graduate"></i></div>
                      <span>Student</span>
                  </label>
              </div>

              <div className="lc-form">
                  <div className="fg">
                      <label><i className="fas fa-id-badge"></i> User ID</label>
                      <input type="text" value={id} onChange={e => setId(e.target.value)} placeholder="Enter your User ID" autoComplete="off" />
                  </div>
                  <div className="fg">
                      <label><i className="fas fa-lock"></i> Password</label>
                      <div className="pw-box">
                          <input type={showPw ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)} placeholder="Enter your password" autoComplete="off" />
                          <button type="button" className="pw-toggle" onClick={() => setShowPw(!showPw)}>
                            <i className={showPw ? "fas fa-eye-slash" : "fas fa-eye"}></i>
                          </button>
                      </div>
                  </div>
                  <div className="fg-row">
                      <label className="ck-label">
                        <input type="checkbox" checked={remember} onChange={e => setRemember(e.target.checked)} /> Remember Me
                      </label>
                      <a href="#" className="forgot" onClick={(e) => { e.preventDefault(); setShowForgot(true); }}>Forgot password?</a>
                  </div>
              </div>

              <div className="login-err" id="loginErr"></div>

              <button className="login-btn" onClick={handleLogin} disabled={isLoading}>
                {isLoading
                  ? <><i className="fas fa-spinner fa-spin"></i> Signing In...</>
                  : <><i className="fas fa-sign-in-alt"></i> Sign In to Library</>
                }
              </button>

              <div className="demo-box" style={{ marginTop: '14px' }}>
                  <div className="demo-label"><i className="fas fa-info-circle"></i> Quick Login (click to fill)</div>
                  <div className="demo-items">
                      <div className="demo-item" onClick={() => handleQuickDemo('admin', 'ADMIN01', 'admin123')}>
                        <i className="fas fa-user-shield"></i><strong>Admin:</strong>&nbsp; ADMIN01 &nbsp;/&nbsp; admin123
                      </div>
                      <div className="demo-item" onClick={() => handleQuickDemo('librarian', 'LIB001', 'lib123')}>
                        <i className="fas fa-user-tie"></i><strong>Librarian:</strong>&nbsp; LIB001 &nbsp;/&nbsp; lib123
                      </div>
                      <div className="demo-item" onClick={() => handleQuickDemo('faculty', 'FAC001', 'fac123')}>
                        <i className="fas fa-chalkboard-teacher"></i><strong>Faculty:</strong>&nbsp; FAC001 &nbsp;/&nbsp; fac123
                      </div>
                      <div className="demo-item" onClick={() => handleQuickDemo('student', 'STU001', 'stu123')}>
                        <i className="fas fa-user-graduate"></i><strong>Student:</strong>&nbsp; STU001 &nbsp;/&nbsp; stu123
                      </div>
                  </div>
              </div>

              <div className="lc-footer">© 2025 VEMU Institute of Technology — Library Management System v3</div>
          </div>
      </div>

      {/* Forgot Modal */}
      {showForgot && (
        <div className="modal-overlay" id="forgotModal" style={{ display: 'flex' }}>
            <div className="modal-box sm">
                <div className="modal-hd">
                    <h3><i className="fas fa-key" style={{ color: 'var(--gold2)' }}></i> Password Reset</h3>
                    <button className="modal-cls" onClick={() => setShowForgot(false)}><i className="fas fa-times"></i></button>
                </div>
                <div className="modal-bd">
                    <p className="modal-info">Please contact your Library Administrator or IT Support to reset your password. Your ID cannot be changed.</p>
                    <div className="fg" style={{ marginBottom: '16px' }}>
                      <label>Your User ID</label>
                      <input type="text" placeholder="Enter your User ID" />
                    </div>
                    <button className="btn-primary w100" onClick={() => { alert('Reset request sent to admin (demo)'); setShowForgot(false); }}>
                      <i className="fas fa-paper-plane"></i> Send Reset Request
                    </button>
                </div>
            </div>
        </div>
      )}
    </div>
  );
};

export default Login;
