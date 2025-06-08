import React, { useRef, useState } from "react";

export default function UploadModal({ onClose }) {
  const [file, setFile] = useState(null);
  const [folder, setFolder] = useState(null);
  const [captured, setCaptured] = useState(null);
  const [streaming, setStreaming] = useState(false);
  const videoRef = useRef();
  const canvasRef = useRef();

  // Start webcam
  const startCamera = async () => {
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      setStreaming(true);
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      videoRef.current.srcObject = stream;
      videoRef.current.play();
    }
  };

  // Capture face
  const capture = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    canvas.getContext("2d").drawImage(video, 0, 0, canvas.width, canvas.height);
    setCaptured(canvas.toDataURL("image/png"));
    // Stop camera
    video.srcObject.getTracks().forEach(track => track.stop());
    setStreaming(false);
  };

  // Close modal and stop camera if open
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
        minHeight: "65vh",
        background: "#fff",
        borderRadius: 24,
        boxShadow: "0 8px 32px #0003",
        padding: "40px 48px 32px 48px",
        position: "relative",
        display: "flex",
        flexDirection: "column",
        gap: 32,
        maxWidth: 900,
        animation: "popIn .25s cubic-bezier(.4,2,.6,1)"
      }}>
        {/* Close Button */}
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
        {/* Title */}
        <div style={{ textAlign: "center", marginBottom: 8 }}>
          <h2 style={{ margin: 0, fontWeight: 700, fontSize: 28, color: "#222" }}>Add File or Folder</h2>
          <div style={{ color: "#888", fontSize: 16, marginTop: 6 }}>Upload your files securely with face verification</div>
        </div>
        {/* Content */}
        <div style={{
          display: "flex",
          gap: 40,
          justifyContent: "center",
          alignItems: "flex-start",
          flexWrap: "wrap"
        }}>
          {/* File/Folder Upload */}
          <div style={{
            flex: 1,
            minWidth: 260,
            background: "#f7f8fa",
            borderRadius: 16,
            padding: "28px 24px",
            boxShadow: "0 2px 8px #0001",
            display: "flex",
            flexDirection: "column",
            alignItems: "center"
          }}>
            <div style={{ fontWeight: 600, fontSize: 17, marginBottom: 18, color: "#7c5fff" }}>Upload File/Folder</div>
            <label
              htmlFor="file-upload"
              style={{
                background: "#edeaff",
                color: "#7c5fff",
                borderRadius: 8,
                padding: "10px 24px",
                fontWeight: 600,
                fontSize: 15,
                cursor: "pointer",
                marginBottom: 12,
                display: "inline-block",
                transition: "background 0.2s"
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
                padding: "10px 24px",
                fontWeight: 600,
                fontSize: 15,
                cursor: "pointer",
                marginBottom: 12,
                display: "inline-block",
                transition: "background 0.2s"
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
            {file && <div style={{ marginTop: 10, color: "#444", fontSize: 14 }}>📄 {file.name}</div>}
            {folder && folder.length > 0 && <div style={{ marginTop: 10, color: "#444", fontSize: 14 }}>📁 {folder[0].webkitRelativePath.split('/')[0]}</div>}
          </div>
          {/* Face Recognition */}
          <div style={{
            flex: 1,
            minWidth: 260,
            background: "#f7f8fa",
            borderRadius: 16,
            padding: "28px 24px",
            boxShadow: "0 2px 8px #0001",
            display: "flex",
            flexDirection: "column",
            alignItems: "center"
          }}>
            <div style={{ fontWeight: 600, fontSize: 17, marginBottom: 18, color: "#7c5fff" }}>Face Recognition</div>
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
        </div>
        {/* Encrypt Button */}
        <div style={{ textAlign: "center", marginTop: 18 }}>
          <button
            style={{
              background: (file || (folder && folder.length > 0)) && captured ? "#7c5fff" : "#ccc",
              color: "#fff",
              border: "none",
              borderRadius: 10,
              padding: "16px 54px",
              fontWeight: 700,
              fontSize: 20,
              cursor: (file || (folder && folder.length > 0)) && captured ? "pointer" : "not-allowed",
              boxShadow: "0 2px 8px #0001",
              letterSpacing: 1
            }}
            disabled={!( (file || (folder && folder.length > 0)) && captured )}
          >
            Encrypt
          </button>
        </div>
      </div>
      {/* Keyframes for pop-in animation */}
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
