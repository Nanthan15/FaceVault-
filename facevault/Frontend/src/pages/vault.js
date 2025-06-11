import React, { useState, useEffect, useRef } from "react";
import Sidebar from "../components/sidebar";
import Header from "../components/header";
import UploadModal from "../components/uploadModal";

function DecryptModal({ file, userEmail, onClose }) {
  const [captured, setCaptured] = useState(null);
  const [streaming, setStreaming] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const videoRef = useRef();
  const canvasRef = useRef();

  const startCamera = async () => {
    setError("");
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

  const handleDecrypt = async () => {
    setError("");
    setLoading(true);
    try {
      // Convert base64 to Blob
      const arr = captured.split(',');
      const mime = arr[0].match(/:(.*?);/)[1];
      const bstr = atob(arr[1]);
      let n = bstr.length;
      const u8arr = new Uint8Array(n);
      while(n--) u8arr[n] = bstr.charCodeAt(n);
      const faceBlob = new Blob([u8arr], {type: mime});

      const formData = new FormData();
      formData.append("email", userEmail);
      formData.append("cid", file.cid);
      formData.append("photo", faceBlob, "face.png");

      const res = await fetch("/vault/decrypt", {
        method: "POST",
        body: formData,
      });
      if (res.ok) {
        const data = await res.json();
        // Download the file using the decrypted file path
        if (data.file_path && data.file_path.local_path) {
          window.open(
            `http://localhost:5000/vault/download?path=${encodeURIComponent(data.file_path.local_path)}`,
            "_blank"
          );
        } else if (data.file_path && typeof data.file_path === "string") {
          window.open(
            `http://localhost:5000/vault/download?path=${encodeURIComponent(data.file_path)}`,
            "_blank"
          );
        } else {
          setError("Decryption succeeded but file path missing.");
        }
        onClose();
      } else {
        const contentType = res.headers.get("content-type");
        if (contentType && contentType.includes("application/json")) {
          const data = await res.json();
          setError(data.error || "Decryption failed");
        } else {
          setError("Decryption failed (server error)");
        }
      }
    } catch (e) {
      setError("Decryption failed");
    }
    setLoading(false);
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
        width: "420px",
        minHeight: "320px",
        background: "#fff",
        borderRadius: 24,
        boxShadow: "0 8px 32px #0003",
        padding: "32px 32px 24px 32px",
        position: "relative",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 24,
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
            width: 36,
            height: 36,
            fontSize: 20,
            color: "#7c5fff",
            cursor: "pointer",
            boxShadow: "0 2px 8px #0001",
            transition: "background 0.2s"
          }}
          aria-label="Close"
        >×</button>
        <h2 style={{ margin: 0, fontWeight: 700, fontSize: 22, color: "#222" }}>Face Recognition</h2>
        <div style={{ color: "#888", fontSize: 15, marginBottom: 6 }}>Verify your face to decrypt and download</div>
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
              <img src={captured} alt="Captured face" style={{ width: 180, borderRadius: 12, border: "2px solid #1ed760" }} />
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
            disabled={!captured || loading}
            onClick={handleDecrypt}
          >
            {loading ? "Decrypting..." : "Decrypt & Download"}
          </button>
        </div>
        {error && (
          <div style={{ color: "red", fontSize: 14, textAlign: "center", marginTop: 8 }}>{error}</div>
        )}
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

export default function VaultPage() {
  const [showModal, setShowModal] = useState(false);
  const [dark, setDark] = useState(false);
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [decryptFile, setDecryptFile] = useState(null);

  // TODO: Replace with actual user email from auth/session
  const userEmail = localStorage.getItem("facevault_email") || "";

  // Fetch files from backend
  const fetchFiles = async () => {
    setLoading(true);
    try {
      const res = await fetch(
        "/vault/files?email=" + encodeURIComponent(userEmail)
      );
      const data = await res.json();
      if (res.ok) setFiles(data.files || []);
    } catch (e) {
      // handle error
    }
    setLoading(false);
  };

  useEffect(() => {
    if (!userEmail) {
      window.location.href = "/login";
      return;
    }
    fetchFiles();
  }, []);

  return (
    <div
      className={dark ? "dark-theme" : ""}
      style={{
        display: "flex",
        height: "100vh",
        background: dark ? "#181a20" : "#f7f8fa",
        color: dark ? "#f7f8fa" : "#222",
        transition: "background 0.3s, color 0.3s",
      }}
    >
      <Sidebar dark={dark} />
      <main
        style={{
          flex: 1,
          margin: 16,
          marginLeft: 0,
          display: "flex",
          flexDirection: "column",
          position: "relative",
        }}
      >
        <Header onToggleTheme={() => setDark((d) => !d)} />
        <br />
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            width: "100%",
          }}
        >
          <section
            style={{
              background: dark ? "#23262f" : "#fff",
              borderRadius: 14,
              boxShadow: "0 2px 8px #0001",
              padding: 0,
              overflow: "hidden",
              width: "100%",
              margin: "0 auto",
              transition: "background 0.3s",
            }}
          >
            <table
              style={{
                width: "100%",
                borderCollapse: "collapse",
                textAlign: "center",
                color: dark ? "#f7f8fa" : "#222",
              }}
            >
              <thead style={{ background: "#f5f6fa" }}>
                <tr>
                  <th
                    style={{
                      padding: "14px 18px",
                      fontWeight: 600,
                      fontSize: 15,
                      color: "#444",
                    }}
                  >
                    File Name
                  </th>
                  <th
                    style={{
                      padding: "14px 18px",
                      fontWeight: 600,
                      fontSize: 15,
                      color: "#444",
                    }}
                  >
                    CID
                  </th>
                  <th
                    style={{
                      padding: "14px 18px",
                      fontWeight: 600,
                      fontSize: 15,
                      color: "#444",
                    }}
                  >
                    Size
                  </th>
                  <th
                    style={{
                      padding: "14px 18px",
                      fontWeight: 600,
                      fontSize: 15,
                      color: "#444",
                    }}
                  >
                    File Type
                  </th>
                  <th
                    style={{
                      padding: "14px 18px",
                      fontWeight: 600,
                      fontSize: 15,
                      color: "#444",
                    }}
                  >
                    Last Modified
                  </th>
                  <th
                    style={{
                      padding: "14px 18px",
                      fontWeight: 600,
                      fontSize: 15,
                      color: "#444",
                    }}
                  >
                    Decrypt
                  </th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={7} style={{ padding: 24, textAlign: "center" }}>
                      Loading...
                    </td>
                  </tr>
                ) : files.length === 0 ? (
                  <tr>
                    <td colSpan={7} style={{ padding: 24, textAlign: "center" }}>
                      No files found.
                    </td>
                  </tr>
                ) : (
                  files.map((file, idx) => (
                    <tr key={idx} style={{ borderBottom: "1px solid #f0f0f0" }}>
                      <td style={{ padding: "14px 18px", fontWeight: 500 }}>
                        {file.local_path ? (
                          <a
                            href={`/vault/download?path=${encodeURIComponent(file.local_path)}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{
                              color: "#7c5fff",
                              textDecoration: "underline",
                            }}
                          >
                            {file.name}
                          </a>
                        ) : (
                          file.name
                        )}
                      </td>
                      <td style={{ padding: "14px 18px", color: "#888" }}>
                        {file.cid}
                      </td>
                      <td style={{ padding: "14px 18px" }}>
                        {file.size}
                      </td>
                      <td style={{ padding: "14px 18px" }}>
                        <span
                          style={{
                            display: "inline-block",
                            background: "#edeaff",
                            color: "#7c5fff",
                            borderRadius: 8,
                            padding: "2px 12px",
                            fontSize: 13,
                            fontWeight: 600,
                          }}
                        >
                          {file.fileType}
                        </span>
                      </td>
                      <td style={{ padding: "14px 18px", color: "#888" }}>
                        {file.modified}
                      </td>
                      <td style={{ padding: "14px 18px" }}>
                        <button
                          style={{
                            background: "#1ed760",
                            color: "#fff",
                            border: "none",
                            borderRadius: 6,
                            padding: "6px 18px",
                            fontWeight: 600,
                            fontSize: 14,
                            cursor: "pointer",
                            boxShadow: "0 1px 4px #0001",
                          }}
                          onClick={() => setDecryptFile(file)}
                        >
                          Decrypt
                        </button>
                      </td>
                      <td style={{ padding: "14px 18px" }}>
                        <span style={{ fontSize: 22, cursor: "pointer" }}>
                          ⋮
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </section>
        </div>
        {/* Floating + Button */}
        <button
          style={{
            position: "fixed",
            right: 40,
            bottom: 40,
            width: 64,
            height: 64,
            borderRadius: "50%",
            background: "#1ed760",
            color: "#fff",
            fontSize: 36,
            border: "none",
            boxShadow: "0 4px 16px #0002",
            cursor: "pointer",
            zIndex: 1000,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
          title="Upload file or folder"
          onClick={() => setShowModal(true)}
        >
          +
        </button>
        {showModal && (
          <UploadModal
            onClose={() => setShowModal(false)}
            onUploadSuccess={fetchFiles}
            userEmail={userEmail}
          />
        )}
        {decryptFile && (
          <DecryptModal
            file={decryptFile}
            userEmail={userEmail}
            onClose={() => setDecryptFile(null)}
          />
        )}
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
