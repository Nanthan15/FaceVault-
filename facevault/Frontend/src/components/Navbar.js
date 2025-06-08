import React, { useState } from 'react';

const navLinks = [
  { name: 'Home', href: '/' },
  { name: 'Features', href: '/features' },
  { name: 'Pricing', href: '/pricing' },
  { name: 'About', href: '/about' },
  { name: 'Contact', href: '/contact' },
];

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav style={styles.navbar}>
      <div style={styles.logo}>FaceVault</div>
      <div style={styles.linksContainer}>
        {navLinks.map(link => (
          <a key={link.name} href={link.href} style={styles.link}>
            {link.name}
          </a>
        ))}
      </div>
      <button
        style={styles.menuButton}
        onClick={() => setMenuOpen(!menuOpen)}
        aria-label="Toggle menu"
      >
        <span style={styles.menuIcon}>&#9776;</span>
      </button>
      {menuOpen && (
        <div style={styles.mobileMenu}>
          {navLinks.map(link => (
            <a
              key={link.name}
              href={link.href}
              style={styles.mobileLink}
              onClick={() => setMenuOpen(false)}
            >
              {link.name}
            </a>
          ))}
        </div>
      )}
    </nav>
  );
}

const styles = {
  navbar: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '0.75rem 2rem',
    background: '#18181b',
    color: '#fff',
    position: 'relative',
    zIndex: 10,
  },
  logo: {
    fontWeight: 'bold',
    fontSize: '1.5rem',
    letterSpacing: '1px',
  },
  linksContainer: {
    display: 'flex',
    gap: '1.5rem',
  },
  link: {
    color: '#fff',
    textDecoration: 'none',
    fontSize: '1rem',
    transition: 'color 0.2s',
  },
  menuButton: {
    display: 'none',
    background: 'none',
    border: 'none',
    color: '#fff',
    fontSize: '2rem',
    cursor: 'pointer',
  },
  menuIcon: {
    display: 'block',
  },
  mobileMenu: {
    position: 'absolute',
    top: '100%',
    right: 0,
    background: '#18181b',
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-end',
    padding: '1rem 2rem',
    boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
  },
  mobileLink: {
    color: '#fff',
    textDecoration: 'none',
    fontSize: '1.2rem',
    margin: '0.5rem 0',
    width: '100%',
    textAlign: 'right',
  },
};

// Responsive styles
// Add this in your global CSS or in a CSS-in-JS solution for production
// For demonstration, you can add this to your main CSS file:
/*
@media (max-width: 768px) {
  .navbar-links-container {
    display: none;
  }
  .navbar-menu-button {
    display: block;
  }
}
*/

export default Navbar;
