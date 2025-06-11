import React, { useState, useRef, useEffect } from "react";
import Sidebar from "../components/sidebar";
import Header from "../components/header";

const users = [
  { id: "USR001", name: "Alice Johnson", role: "Manager", date: "2024-06-01" },
  { id: "USR002", name: "Bob Smith", role: "Developer", date: "2024-05-28" },
  { id: "USR003", name: "Carol Lee", role: "Analyst", date: "2024-05-20" },
];

function SendFileModal({ onClose }) {
  const [file, setFile] = useState(null);
  const [folder, setFolder] = useState(null);
  const [captured, setCaptured] = useState(null);
  const [streaming, setStreaming] = useState(false);
  const videoRef = useRef();
  const canvasRef = useRef();

  const startCamera = async () => {
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      setStreaming(true);
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      videoRef.current.srcObject = stream;
      videoRef.current.play();
    }
  };

  const capture = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    canvas.getContext("2d").drawImage(video, 0, 0, canvas.width, canvas.height);
    setCaptured(canvas.toDataURL("image/png"));
    video.srcObject.getTracks().forEach(track => track.stop());
    setStreaming(false);
  };

  const handleClose = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      videoRef.current.srcObject.getTracks().forEach(track => track.stop());
    }
    onClose();
  };

  return (
    <div style={{
      position: "fixed",
      top: 0, left: 0, width: "100vw", height: "100vh",
      background: "rgba(30, 34, 45, 0.25)",
      backdropFilter: "blur(10px)",
      zIndex: 2000,
      display: "flex",
      alignItems: "center",
      justifyContent: "center"
    }}>
      <div style={{
        width: "70vw",
        minHeight: "45vh",
        background: "#fff",
        borderRadius: 24,
        boxShadow: "0 8px 32px #0003",
        padding: "40px 48px 32px 48px",
        position: "relative",
        display: "flex",
        flexDirection: "column",
        gap: 32,
        maxWidth: 600,
        animation: "popIn .25s cubic-bezier(.4,2,.6,1)"
      }}>
        <button
          onClick={handleClose}
          style={{
            position: "absolute",
            top: 18,
            right: 28,
            background: "#f5f6fa",
            border: "none",
            borderRadius: "50%",
            width: 40,
            height: 40,
            fontSize: 22,
            color: "#7c5fff",
            cursor: "pointer",
            boxShadow: "0 2px 8px #0001",
            transition: "background 0.2s"
          }}
          aria-label="Close"
          onMouseOver={e => e.currentTarget.style.background = "#edeaff"}
          onMouseOut={e => e.currentTarget.style.background = "#f5f6fa"}
        >×</button>
        <div style={{ textAlign: "center", marginBottom: 8 }}>
          <h2 style={{ margin: 0, fontWeight: 700, fontSize: 22, color: "#222" }}>Send File/Folder</h2>
          <div style={{ color: "#888", fontSize: 15, marginTop: 6 }}>Select file/folder and add face key</div>
        </div>
        <div style={{
          display: "flex",
          gap: 32,
          justifyContent: "center",
          alignItems: "flex-start",
          flexWrap: "wrap"
        }}>
          {/* File/Folder Upload */}
          <div style={{
            flex: 1,
            minWidth: 220,
            background: "#f7f8fa",
            borderRadius: 16,
            padding: "24px 18px",
            boxShadow: "0 2px 8px #0001",
            display: "flex",
            flexDirection: "column",
            alignItems: "center"
          }}>
            <div style={{ fontWeight: 600, fontSize: 16, marginBottom: 14, color: "#7c5fff" }}>Select File/Folder</div>
            <label
              htmlFor="file-upload"
              style={{
                background: "#edeaff",
                color: "#7c5fff",
                borderRadius: 8,
                padding: "8px 18px",
                fontWeight: 600,
                fontSize: 15,
                cursor: "pointer",
                marginBottom: 10,
                display: "inline-block"
              }}
            >Choose File</label>
            <input
              id="file-upload"
              type="file"
              style={{ display: "none" }}
              onChange={e => setFile(e.target.files[0])}
            />
            <label
              htmlFor="folder-upload"
              style={{
                background: "#edeaff",
                color: "#7c5fff",
                borderRadius: 8,
                padding: "8px 18px",
                fontWeight: 600,
                fontSize: 15,
                cursor: "pointer",
                marginBottom: 10,
                display: "inline-block"
              }}
            >Choose Folder</label>
            <input
              id="folder-upload"
              type="file"
              webkitdirectory="true"
              directory="true"
              style={{ display: "none" }}
              onChange={e => setFolder(e.target.files)}
            />
            {file && <div style={{ marginTop: 8, color: "#444", fontSize: 14 }}>📄 {file.name}</div>}
            {folder && folder.length > 0 && <div style={{ marginTop: 8, color: "#444", fontSize: 14 }}>📁 {folder[0].webkitRelativePath.split('/')[0]}</div>}
          </div>
          {/* Face Recognition */}
          <div style={{
            flex: 1,
            minWidth: 220,
            background: "#f7f8fa",
            borderRadius: 16,
            padding: "24px 18px",
            boxShadow: "0 2px 8px #0001",
            display: "flex",
            flexDirection: "column",
            alignItems: "center"
          }}>
            <div style={{ fontWeight: 600, fontSize: 16, marginBottom: 14, color: "#7c5fff" }}>Add Face Key</div>
            {!captured && !streaming && (
              <button
                onClick={startCamera}
                style={{
                  background: "#1ed760",
                  color: "#fff",
                  border: "none",
                  borderRadius: 8,
                  padding: "10px 24px",
                  fontWeight: 600,
                  fontSize: 15,
                  cursor: "pointer",
                  marginBottom: 10,
                  boxShadow: "0 2px 8px #0001"
                }}
              >Open Camera</button>
            )}
            {streaming && (
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                <video ref={videoRef} style={{ width: 180, borderRadius: 12, marginBottom: 10, border: "2px solid #7c5fff" }} />
                <button
                  onClick={capture}
                  style={{
                    background: "#1ed760",
                    color: "#fff",
                    border: "none",
                    borderRadius: 8,
                    padding: "8px 20px",
                    fontWeight: 600,
                    fontSize: 15,
                    cursor: "pointer",
                    marginTop: 2,
                    boxShadow: "0 2px 8px #0001"
                  }}
                >Capture</button>
              </div>
            )}
            <canvas ref={canvasRef} style={{ display: "none" }} />
            {captured && (
              <div style={{ marginTop: 8, display: "flex", flexDirection: "column", alignItems: "center" }}>
                <img src={captured} alt="Captured face" style={{ width: 180, borderRadius: 12, border: "2px solid #1ed760" }} />
                <button
                  onClick={() => setCaptured(null)}
                  style={{
                    marginTop: 8,
                    background: "#edeaff",
                    color: "#7c5fff",
                    border: "none",
                    borderRadius: 8,
                    padding: "6px 18px",
                    fontWeight: 600,
                    fontSize: 14,
                    cursor: "pointer"
                  }}
                >Retake</button>
              </div>
            )}
          </div>
        </div>
        <div style={{ textAlign: "center", marginTop: 18 }}>
          <button
            style={{
              background: (file || (folder && folder.length > 0)) && captured ? "#7c5fff" : "#ccc",
              color: "#fff",
              border: "none",
              borderRadius: 10,
              padding: "14px 44px",
              fontWeight: 700,
              fontSize: 18,
              cursor: (file || (folder && folder.length > 0)) && captured ? "pointer" : "not-allowed",
              boxShadow: "0 2px 8px #0001",
              letterSpacing: 1
            }}
            disabled={!( (file || (folder && folder.length > 0)) && captured )}
          >
            Send
          </button>
        </div>
      </div>
      <style>
        {`
          @keyframes popIn {
            0% { transform: scale(0.95); opacity: 0; }
            100% { transform: scale(1); opacity: 1; }
          }
        `}
      </style>
    </div>
  );
}

export default function ShareFilesPage() {
  const [dark, setDark] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [connections, setConnections] = useState([]);
  const userEmail = localStorage.getItem("facevault_email") || "";
  const [currentUserId, setCurrentUserId] = useState(null);

  useEffect(() => {
    if (!userEmail) {
      window.location.href = "/login";
      return;
    }
    // Fetch current user to get their _id
    fetch(`/connections/api/user-by-email?email=${encodeURIComponent(userEmail)}`)
      .then(res => res.json())
      .then(data => {
        if (data.user && data.user._id) {
          setCurrentUserId(data.user._id);
          // Fetch connections
          fetch(`/connections/api/connections/${data.user._id}`)
            .then(res2 => res2.json())
            .then(data2 => setConnections(data2.connections || []));
        }
      });
  }, [userEmail]);

  return (
    <div
      className={dark ? "dark-theme" : ""}
      style={{
        display: "flex",
        height: "100vh",
        background: dark ? "#181a20" : "#f7f8fa",
        color: dark ? "#f7f8fa" : "#222",
        transition: "background 0.3s, color 0.3s"
      }}
    >
      <Sidebar dark={dark} />
      <main style={{ flex: 1, margin: 16, marginLeft: 0, display: "flex", flexDirection: "column" }}>
        <Header onToggleTheme={() => setDark((d) => !d)} />
        <section style={{
          background: dark ? "#23262f" : "#fff",
          borderRadius: 14,
          boxShadow: "0 2px 8px #0001",
          padding: 0,
          overflow: "hidden",
          transition: "background 0.3s"
        }}>
          <table style={{
            width: "100%",
            borderCollapse: "collapse",
            color: dark ? "#f7f8fa" : "#222"
          }}>
            <thead style={{ background: dark ? "#23262f" : "#f5f6fa" }}>
              <tr>
                <th style={{ textAlign: "center", padding: "14px 18px", fontWeight: 600, fontSize: 15 }}>User ID</th>
                <th style={{ textAlign: "center", padding: "14px 18px", fontWeight: 600, fontSize: 15 }}>Name</th>
                <th style={{ textAlign: "center", padding: "14px 18px", fontWeight: 600, fontSize: 15 }}>Role</th>
                <th style={{ textAlign: "center", padding: "14px 18px", fontWeight: 600, fontSize: 15 }}>Company</th>
                <th style={{ textAlign: "center", padding: "14px 18px", fontWeight: 600, fontSize: 15 }}>Send File</th>
              </tr>
            </thead>
            <tbody>
              {connections.map((user, idx) => (
                <tr key={user._id} style={{ borderBottom: "1px solid #f0f0f0" }}>
                  <td style={{ padding: "14px 18px", fontWeight: 500, textAlign: "center" }}>{user._id}</td>
                  <td style={{ padding: "14px 18px", textAlign: "center" }}>{user.username}</td>
                  <td style={{ padding: "14px 18px", textAlign: "center" }}>{user.role}</td>
                  <td style={{ padding: "14px 18px", textAlign: "center" }}>{user.company}</td>
                  <td style={{ padding: "14px 18px", textAlign: "center" }}>
                    <button
                      style={{
                        background: "#1ed760",
                        color: dark ? "#23262f" : "#fff",
                        border: "none",
                        borderRadius: 6,
                        padding: "6px 18px",
                        fontWeight: 600,
                        fontSize: 14,
                        cursor: "pointer",
                        boxShadow: "0 1px 4px #0001"
                      }}
                      onClick={() => setShowModal(true)}
                    >Send File</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
        {showModal && <SendFileModal onClose={() => setShowModal(false)} />}
      </main>
      {/* Dark theme global styles */}
      <style>
        {`
          .dark-theme {
            background: #181a20 !important;
            color: #f7f8fa !important;
          }
          .dark-theme input, .dark-theme textarea {
            background: #23262f !important;
            color: #f7f8fa !important;
            border-color: #333 !important;
          }
          .dark-theme table {
            background: #23262f !important;
            color: #f7f8fa !important;
          }
          .dark-theme th, .dark-theme td {
            background: #23262f !important;
            color: #f7f8fa !important;
          }
          .dark-theme section {
            background: #23262f !important;
          }
        `}
      </style>
    </div>
  );
}
