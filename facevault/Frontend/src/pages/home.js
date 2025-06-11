import React from 'react';
import Navbar from '../components/Navbar';

const features = [
  {
    label: 'Vault',
    img: 'https://img.icons8.com/fluency/96/lock-2.png',
  },
  {
    label: 'Connection',
    img: 'https://img.icons8.com/fluency/96/connection-status-on.png',
  },
  {
    label: 'Share Files',
    img: 'https://img.icons8.com/fluency/96/share.png',
  },
  {
    label: 'Search Files',
    img: 'https://img.icons8.com/fluency/96/search.png',
  },
];

export default function Home() {
  React.useEffect(() => {
    const userEmail = localStorage.getItem("facevault_email") || "";
    if (!userEmail) {
      window.location.href = "/login";
    }
  }, []);

  return (
    <div style={styles.bg}>
      <Navbar />
      <div style={styles.container}>
        {features.map((feature, idx) => (
          <div key={feature.label} style={styles.box}>
            <img src={feature.img} alt={feature.label} style={styles.img} />
            <div style={styles.label}>{feature.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

const styles = {
  bg: {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #6366f1 0%, #18181b 100%)',
  },
  container: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: '2.5rem',
    marginTop: '4rem',
    justifyContent: 'center',
    alignItems: 'center',
    maxWidth: '600px',
    marginLeft: 'auto',
    marginRight: 'auto',
  },
  box: {
    background: '#fff',
    borderRadius: '1rem',
    boxShadow: '0 4px 24px rgba(0,0,0,0.10)',
    width: '250px',
    height: '240px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '2rem 1rem 1.5rem 1rem',
    transition: 'transform 0.2s, box-shadow 0.2s',
    cursor: 'pointer',
    margin: 'auto',
  },
  img: {
    width: '110px',
    height: '130px',
    marginBottom: '1.5rem',
    objectFit: 'contain',
  },
  label: {
    fontSize: '1.6rem',
    fontWeight: 600,
    color: '#18181b',
    textAlign: 'center',
    letterSpacing: '1px',
  },
};
