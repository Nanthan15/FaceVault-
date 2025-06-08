import React, { useState, useRef } from 'react';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showCamera, setShowCamera] = useState(false);
  const videoRef = useRef(null);
  const streamRef = useRef(null);

  const handleSubmit = e => {
    e.preventDefault();
    // Handle login logic here
  };

  const handleFaceRecognition = async () => {
    setShowCamera(true);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        streamRef.current = stream;
      }
    } catch (err) {
      alert('Unable to access camera.');
      setShowCamera(false);
    }
  };

  const handleCloseCamera = () => {
    setShowCamera(false);
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
  };

  return (
    <div style={styles.container}>
      <form style={styles.form} onSubmit={handleSubmit}>
        <h2 style={styles.title}>Sign in to FaceVault</h2>
        <div style={styles.inputGroup}>
          <label style={styles.label} htmlFor="email">Email</label>
          <input
            style={styles.input}
            type="email"
            id="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
            placeholder="you@example.com"
          />
        </div>
        <div style={styles.inputGroup}>
          <label style={styles.label} htmlFor="password">Password</label>
          <input
            style={styles.input}
            type="password"
            id="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
            placeholder="••••••••"
          />
        </div>
        <br></br>
        <button
          type="button"
          style={styles.faceButton}
          onClick={handleFaceRecognition}
        >
          Login with Face Recognition
        </button>
        
        <div style={styles.footer}>
          <span>Don't have an account?</span>
          <a href="/signup" style={styles.link}>Sign up</a>
        </div>
      </form>
      {showCamera && (
        <div style={styles.cameraOverlay}>
          <div style={styles.cameraModal}>
            <video
              ref={videoRef}
              autoPlay
              style={styles.video}
              width={640}
              height={480}
            />
            <button style={styles.closeButton} onClick={handleCloseCamera}>
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

const styles = {
  container: {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #6366f1 0%, #18181b 100%)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',   
  },
  
  form: {
    background: '#fff',
    padding: '2.5rem 2rem',
    borderRadius: '1rem',
    boxShadow: '0 8px 32px rgba(0,0,0,0.15)',
    minWidth: '420px',
    maxWidth: '550px',
    height:'420px',
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    gap: '1.2rem',

  },
  title: {
    margin: 0,
    color: '#18181b',
    fontWeight: 700,
    fontSize: '2rem',
    textAlign: 'center',
    letterSpacing: '1px',
  },
  inputGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.3rem',
  },
  label: {
    fontWeight: 500,
    color: '#6366f1',
    fontSize : '25px',
    marginBottom: '0.2rem',
  },
  input: {
    padding: '0.7rem',
    borderRadius: '0.5rem',
    border: '1px solid #d1d5db',
    fontSize: '1rem',
    outline: 'none',
    transition: 'border 0.2s',
  },
  button: {
    background: 'linear-gradient(90deg, #6366f1 0%, #818cf8 100%)',
    color: '#fff',
    border: 'none',
    borderRadius: '0.5rem',
    padding: '0.8rem',
    fontWeight: 600,
    fontSize: '1.1rem',
    cursor: 'pointer',
    marginTop: '0.5rem',
    transition: 'background 0.2s',
  },
  footer: {
    display: 'flex',
    justifyContent: 'center',
    gap: '0.5rem',
    fontSize: '0.95rem',
    marginTop: '0.5rem',
  },
  link: {
    color: '#6366f1',
    textDecoration: 'none',
    fontWeight: 500,
  },
  faceButton: {
    background: 'linear-gradient(90deg, #18181b 0%, #6366f1 100%)',
    color: '#fff',
    border: 'none',
    borderRadius: '0.5rem',
    padding: '0.7rem',
    fontWeight: 600,
    fontSize: '1rem',
    cursor: 'pointer',
    marginBottom: '0.5rem',
    marginTop: '0.2rem',
    transition: 'background 0.2s',
  },
  cameraOverlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100vw',
    height: '100vh',
    background: 'rgba(0,0,0,0.7)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
  },
  cameraModal: {
    background: '#fff',
    borderRadius: '1rem',
    padding: '1.5rem',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    boxShadow: '0 8px 32px rgba(0,0,0,0.25)',
    minWidth: '700px', // increased for larger video
    minHeight: '550px', // increased for larger video
  },
  video: {
    borderRadius: '0.5rem',
    marginBottom: '1rem',
    background: '#000',
    width: '640px',   // ensure video fills the area
    height: '480px',
    objectFit: 'cover',
  },
  closeButton: {
    background: '#6366f1',
    color: '#fff',
    border: 'none',
    borderRadius: '0.5rem',
    padding: '0.5rem 1.2rem',
    fontWeight: 600,
    fontSize: '1rem',
    cursor: 'pointer',
    marginTop: '0.5rem',
  },
};
