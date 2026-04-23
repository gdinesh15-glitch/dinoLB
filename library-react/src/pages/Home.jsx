import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Home.css';

const Home = () => {
  useEffect(() => {
    // Particle generator
    const particleContainer = document.getElementById('homeParticles');
    if (particleContainer && particleContainer.children.length === 0) {
        for (let i = 0; i < 40; i++) {
            const p = document.createElement('div');
            p.className = 'particle';
            const colors = ['rgba(139,92,246,0.5)', 'rgba(6,182,212,0.4)', 'rgba(245,158,11,0.3)', 'rgba(236,72,153,0.3)'];
            p.style.cssText = `
                left: ${Math.random() * 100}%;
                width: ${Math.random() * 4 + 2}px;
                height: ${Math.random() * 4 + 2}px;
                background: ${colors[Math.floor(Math.random() * colors.length)]};
                animation-duration: ${Math.random() * 20 + 10}s;
                animation-delay: ${Math.random() * 15}s;
            `;
            particleContainer.appendChild(p);
        }
    }

    // Scroll reveal
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, { threshold: 0.15 });

    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

    // Animated counters
    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const target = parseInt(entry.target.dataset.target);
                if (!target) return;
                let current = 0;
                const step = Math.max(1, Math.ceil(target / 80));
                const timer = setInterval(() => {
                    current = Math.min(current + step, target);
                    entry.target.textContent = current.toLocaleString('en-IN') + (target >= 1000 ? '+' : '');
                    if (current >= target) clearInterval(timer);
                }, 16);
                counterObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    document.querySelectorAll('.stat-number[data-target]').forEach(el => counterObserver.observe(el));
    
    // Cleanup
    return () => {
        observer.disconnect();
        counterObserver.disconnect();
    };
  }, []);

  return (
    <>
      {/* ANIMATED BACKGROUND */}
      <div className="home-bg-canvas">
          <div className="orb"></div>
          <div className="orb"></div>
          <div className="orb"></div>
          <div className="orb"></div>
      </div>
      <div className="home-grid-overlay"></div>
      <div className="home-particles" id="homeParticles"></div>

      {/* HERO SECTION */}
      <section className="hero">
          <div className="hero-badge">
              <span className="pulse-dot"></span>
              <span>Smart Library Management System</span>
          </div>

          <h1>Welcome to <br/><span className="gradient-text">VEMU Institute of Technology</span></h1>

          <p>Experience the future of academic library management. Browse 50,000+ books, track your reading, manage dues — all in one powerful platform built for students, faculty, and administrators.</p>

          <Link to="/login" className="hero-cta">
              <span>Go To Library Portal</span>
              <i className="fas fa-arrow-right"></i>
          </Link>
      </section>

      {/* STATISTICS */}
      <section className="stats-container">
          <div className="stat-card reveal">
              <h3 className="stat-number" data-target="50000">0</h3>
              <p>Books Available</p>
          </div>
          <div className="stat-card reveal">
              <h3 className="stat-number" data-target="1250">0</h3>
              <p>Students Registered</p>
          </div>
          <div className="stat-card reveal">
              <h3 className="stat-number">24/7</h3>
              <p>Online Access</p>
          </div>
          <div className="stat-card reveal">
              <h3 className="stat-number" data-target="15">0</h3>
              <p>Days Borrow Limit</p>
          </div>
      </section>

      {/* KEY FEATURES */}
      <section className="features">
          <div className="features-title reveal">
              <h2>Why Choose VEMU Library?</h2>
              <p>Powerful features designed for modern academic excellence</p>
          </div>

          <div className="feature-card reveal">
              <div className="feature-icon">📚</div>
              <h3>Easy Book Management</h3>
              <p>Browse and manage the library collection easily. Search by book title, author, or book ID instantly.</p>
          </div>

          <div className="feature-card reveal">
              <div className="feature-icon">👥</div>
              <h3>Multi-Role Access</h3>
              <p>Different access for Admin, Librarian, Faculty and Students with role-specific smart dashboards.</p>
          </div>

          <div className="feature-card reveal">
              <div className="feature-icon">📊</div>
              <h3>Smart Tracking</h3>
              <p>Track issued books, due dates, returns and overdue books with real-time automated analytics.</p>
          </div>

          <div className="feature-card reveal">
              <div className="feature-icon">🔒</div>
              <h3>Secure System</h3>
              <p>Safe login system with role-based authentication and enterprise-grade data protection.</p>
          </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="how-it-works">
          <div className="section-title reveal">
              <h2>🚀 How It Works</h2>
              <p>Get started in three simple steps</p>
          </div>

          <div className="steps-container">
              <div className="step-item reveal">
                  <div className="step-num">1</div>
                  <div className="step-content">
                      <h3>Login to Your Account</h3>
                      <p>Select your role — Admin, Librarian, Faculty, or Student — and sign in with your secure credentials to access your personalized dashboard.</p>
                  </div>
              </div>
              <div className="step-item reveal">
                  <div className="step-num">2</div>
                  <div className="step-content">
                      <h3>Access Your Portal</h3>
                      <p>Once logged in, explore your feature-rich dashboard with real-time stats, notifications, and tools tailored to your academic role.</p>
                  </div>
              </div>
              <div className="step-item reveal">
                  <div className="step-num">3</div>
                  <div className="step-content">
                      <h3>Manage Library Resources</h3>
                      <p>Borrow books, return books, donate to the library, track fines, and manage records — all from your fingertips.</p>
                  </div>
              </div>
          </div>
      </section>

      {/* FOOTER */}
      <footer>
          <h3>VEMU Library Management System</h3>
          <p>Providing Excellent Academic Resources Since 2005</p>
          <div className="footer-divider"></div>
          <p>
              <i className="fas fa-envelope"></i> library@vemu.edu.in &nbsp;&bull;&nbsp;
              <i className="fas fa-phone"></i> +91 12345 67890
          </p>
          <p className="copyright">© 2026 VEMU Institute of Technology. All rights reserved.</p>
      </footer>
    </>
  );
};

export default Home;
