import React, { useState, useRef } from 'react';

export default function Register() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showCamera, setShowCamera] = useState(false);
  const [photo, setPhoto] = useState(null);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);

  const handleSubmit = async e => {
    e.preventDefault();

    if (!photo) {
      alert('Please capture a photo.');
      return;
    }

    // Convert base64 image to Blob
    const blob = await (await fetch(photo)).blob();

    const formData = new FormData();
    formData.append('username', username);
    formData.append('email', email);
    formData.append('password', password);
    formData.append('photo', blob, 'photo.png');

    try {
      const response = await fetch('http://localhost:5000/auth/register', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (response.ok) {
        alert('Registration successful!');
        // Optionally redirect or clear form
      } else {
        alert(data.error || 'Registration failed');
      }
    } catch (err) {
      alert('Error connecting to server');
    }
     
    };

  const handleOpenCamera = async () => {
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

  const handleCapture = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (video && canvas) {
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      const imageData = canvas.toDataURL('image/png');
      setPhoto(imageData);
      handleCloseCamera();
    }
  };

  return (
    <div style={styles.container}>
      <form style={styles.form} onSubmit={handleSubmit}>
        <h2 style={styles.title}>Register for FaceVault</h2>
        <div style={styles.inputGroup}>
          <label style={styles.label} htmlFor="username">Username</label>
          <input
            style={styles.input}
            type="text"
            id="username"
            value={username}
            onChange={e => setUsername(e.target.value)}
            required
            placeholder="Enter username"
          />
        </div>
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
            placeholder="Create a password"
          />
        </div>
        <div style={styles.inputGroup}>
          <label style={styles.label}>Photo</label>
          <button
            type="button"
            style={styles.faceButton}
            onClick={handleOpenCamera}
          >
            {photo ? 'Retake Photo' : 'Capture Photo'}
          </button>
          {photo && (
            <img
              src={photo}
              alt="Captured"
              style={styles.photoPreview}
            />
          )}
        </div>
        <button style={styles.button} type="submit">Register</button>
      </form>
      {showCamera && (
        <div style={styles.cameraOverlay}>
          <div style={styles.cameraModal}>
            <video
              ref={videoRef}
              autoPlay
              style={styles.video}
              width={400}
              height={300}
            />
            <canvas ref={canvasRef} style={{ display: 'none' }} />
            <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
              <button style={styles.captureButton} onClick={handleCapture}>
                Capture
              </button>
              <button style={styles.closeButton} onClick={handleCloseCamera}>
                Close
              </button>
            </div>
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
    fontSize: '20px',
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
    width: 'fit-content',
  },
  photoPreview: {
    marginTop: '0.5rem',
    width: '120px',
    height: '120px',
    objectFit: 'cover',
    borderRadius: '0.5rem',
    border: '2px solid #6366f1',
    alignSelf: 'center',
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
    minWidth: '450px',
    minHeight: '380px',
  },
  video: {
    borderRadius: '0.5rem',
    marginBottom: '1rem',
    background: '#000',
    width: '400px',
    height: '300px',
    objectFit: 'cover',
  },
  captureButton: {
    background: '#6366f1',
    color: '#fff',
    border: 'none',
    borderRadius: '0.5rem',
    padding: '0.5rem 1.2rem',
    fontWeight: 600,
    fontSize: '1rem',
    cursor: 'pointer',
  },
  closeButton: {
    background: '#818cf8',
    color: '#fff',
    border: 'none',
    borderRadius: '0.5rem',
    padding: '0.5rem 1.2rem',
    fontWeight: 600,
    fontSize: '1rem',
    cursor: 'pointer',
  },
};
