import React, { useState } from "react";
import Sidebar from "../components/sidebar";
import Header from "../components/header";

const files = [
  {
    name: "SharedReport.pdf",
    type: "pdf",
    cid: "QmAAA...1111",
    size: "2.1 MB",
    fileType: "PDF",
    sentBy: "Alice Johnson",
    sentDate: "2024-06-10",
  },
  {
    name: "Photo.jpg",
    type: "image",
    cid: "QmBBB...2222",
    size: "1.5 MB",
    fileType: "JPG",
    sentBy: "Bob Smith",
    sentDate: "2024-06-09",
  },
  {
    name: "Notes.txt",
    type: "txt",
    cid: "QmCCC...3333",
    size: "12 KB",
    fileType: "TXT",
    sentBy: "Carol Lee",
    sentDate: "2024-06-08",
  },
];

function DecryptModal({ onClose }) {
  const [captured, setCaptured] = useState(null);
  const [streaming, setStreaming] = useState(false);
  const videoRef = React.useRef();
  const canvasRef = React.useRef();

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
        minHeight: "40vh",
        background: "#fff",
        borderRadius: 24,
        boxShadow: "0 8px 32px #0003",
        padding: "40px 48px 32px 48px",
        position: "relative",
        display: "flex",
        flexDirection: "column",
        gap: 32,
        maxWidth: 500,
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
          <h2 style={{ margin: 0, fontWeight: 700, fontSize: 22, color: "#222" }}>Face Recognition</h2>
          <div style={{ color: "#888", fontSize: 15, marginTop: 6 }}>Verify your face to decrypt</div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
          {!captured && !streaming && (
            <button
              onClick={startCamera}
              style={{
                background: "#1ed760",
                color: "#fff",
                border: "none",
                borderRadius: 8,
                padding: "12px 32px",
                fontWeight: 600,
                fontSize: 16,
                cursor: "pointer",
                marginBottom: 10,
                boxShadow: "0 2px 8px #0001"
              }}
            >Open Camera</button>
          )}
          {streaming && (
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
              <video ref={videoRef} style={{ width: 220, borderRadius: 12, marginBottom: 10, border: "2px solid #7c5fff" }} />
              <button
                onClick={capture}
                style={{
                  background: "#1ed760",
                  color: "#fff",
                  border: "none",
                  borderRadius: 8,
                  padding: "10px 28px",
                  fontWeight: 600,
                  fontSize: 16,
                  cursor: "pointer",
                  marginTop: 2,
                  boxShadow: "0 2px 8px #0001"
                }}
              >Capture</button>
            </div>
          )}
          <canvas ref={canvasRef} style={{ display: "none" }} />
          {captured && (
            <div style={{ marginTop: 10, display: "flex", flexDirection: "column", alignItems: "center" }}>
              <img src={captured} alt="Captured face" style={{ width: 220, borderRadius: 12, border: "2px solid #1ed760" }} />
              <button
                onClick={() => setCaptured(null)}
                style={{
                  marginTop: 10,
                  background: "#edeaff",
                  color: "#7c5fff",
                  border: "none",
                  borderRadius: 8,
                  padding: "8px 24px",
                  fontWeight: 600,
                  fontSize: 15,
                  cursor: "pointer"
                }}
              >Retake</button>
            </div>
          )}
        </div>
        <div style={{ textAlign: "center", marginTop: 18 }}>
          <button
            style={{
              background: captured ? "#7c5fff" : "#ccc",
              color: "#fff",
              border: "none",
              borderRadius: 10,
              padding: "14px 44px",
              fontWeight: 700,
              fontSize: 18,
              cursor: captured ? "pointer" : "not-allowed",
              boxShadow: "0 2px 8px #0001",
              letterSpacing: 1
            }}
            disabled={!captured}
          >
            Decrypt
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

const iconForType = (type) => {
  switch (type) {
    case "pdf":
      return "📄";
    case "image":
      return "🖼️";
    case "txt":
      return "📑";
    default:
      return "📦";
  }
};

export default function ReceiveFilesPage() {
  const [dark, setDark] = useState(false);
  const [showModal, setShowModal] = useState(false);

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
          display: "flex",
          gap: 18,
          marginBottom: 32
        }}>
          {/* You can add folder cards here if needed */}
        </section>
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
                <th style={{ textAlign: "center", padding: "14px 18px", fontWeight: 600, fontSize: 15 }}>File Name</th>
                <th style={{ textAlign: "center", padding: "14px 18px", fontWeight: 600, fontSize: 15 }}>CID</th>
                <th style={{ textAlign: "center", padding: "14px 18px", fontWeight: 600, fontSize: 15 }}>Size</th>
                <th style={{ textAlign: "center", padding: "14px 18px", fontWeight: 600, fontSize: 15 }}>File Type</th>
                <th style={{ textAlign: "center", padding: "14px 18px", fontWeight: 600, fontSize: 15 }}>Sent By</th>
                <th style={{ textAlign: "center", padding: "14px 18px", fontWeight: 600, fontSize: 15 }}>Sent Date</th>
                <th style={{ textAlign: "center", padding: "14px 18px", fontWeight: 600, fontSize: 15 }}>Action</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {files.map((file, idx) => (
                <tr key={idx} style={{ borderBottom: "1px solid #f0f0f0" }}>
                  <td style={{ padding: "14px 18px", fontWeight: 500, textAlign: "center" }}>
                    <span style={{ marginRight: 10 }}>{iconForType(file.type)}</span>
                    {file.name}
                  </td>
                  <td style={{ padding: "14px 18px", color: dark ? "#bbb" : "#888", textAlign: "center" }}>{file.cid}</td>
                  <td style={{ padding: "14px 18px", textAlign: "center" }}>{file.size}</td>
                  <td style={{ padding: "14px 18px", textAlign: "center" }}>
                    <span style={{
                      display: "inline-block",
                      background: "#edeaff",
                      color: "#7c5fff",
                      borderRadius: 8,
                      padding: "2px 12px",
                      fontSize: 13,
                      fontWeight: 600
                    }}>{file.fileType}</span>
                  </td>
                  <td style={{ padding: "14px 18px", textAlign: "center" }}>{file.sentBy}</td>
                  <td style={{ padding: "14px 18px", textAlign: "center" }}>{file.sentDate}</td>
                  <td style={{ padding: "14px 18px", textAlign: "center" }}>
                    <button
                      style={{
                        background: "none",
                        border: "none",
                        outline: "none",
                        borderRadius: "50%",
                        padding: "6px 10px",
                        fontSize: 22,
                        cursor: "pointer",
                        marginRight: 8,
                        color: "#1ed760",
                        transition: "background 0.2s"
                      }}
                      title="Accept"
                      onClick={() => setShowModal(true)}
                    >✔️</button>
                    <button
                      style={{
                        background: "none",
                        border: "none",
                        outline: "none",
                        borderRadius: "50%",
                        padding: "6px 10px",
                        fontSize: 22,
                        cursor: "pointer",
                        color: "#ff4d4f",
                        transition: "background 0.2s"
                      }}
                      title="Reject"
                      onClick={() => alert("Rejected")}
                    >❌</button>
                  </td>
                  {/* <td style={{ padding: "14px 18px" }}>
                    <span style={{ fontSize: 22, cursor: "pointer" }}>⋮</span>
                  </td> */}
                </tr>
              ))}
            </tbody>
          </table>
        </section>
        {showModal && <DecryptModal onClose={() => setShowModal(false)} />}
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
