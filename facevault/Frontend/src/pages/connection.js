import React, { useState, useEffect } from "react";
import Sidebar from "../components/sidebar";
import Header from "../components/header";

function NotificationModal({ message, onClose }) {
  return (
    <div style={{
      position: "fixed",
      top: 0, left: 0, width: "100vw", height: "100vh",
      background: "rgba(30, 34, 45, 0.25)",
      backdropFilter: "blur(6px)",
      zIndex: 3000,
      display: "flex",
      alignItems: "center",
      justifyContent: "center"
    }}>
      <div style={{
        background: "#fff",
        borderRadius: 16,
        boxShadow: "0 8px 32px #0003",
        padding: "32px 48px",
        minWidth: 320,
        textAlign: "center",
        fontSize: 20,
        fontWeight: 600,
        color: "#1ed760",
        animation: "popIn .25s cubic-bezier(.4,2,.6,1)"
      }}>
        {message}
        <br />
        <button
          onClick={onClose}
          style={{
            marginTop: 24,
            background: "#1ed760",
            color: "#fff",
            border: "none",
            borderRadius: 8,
            padding: "10px 32px",
            fontWeight: 600,
            fontSize: 16,
            cursor: "pointer"
          }}
        >OK</button>
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

function AcceptModal({ users, onAccept, onClose }) {
  return (
    <div style={{
      position: "fixed",
      top: 0, left: 0, width: "100vw", height: "100vh",
      background: "rgba(30, 34, 45, 0.25)",
      backdropFilter: "blur(8px)",
      zIndex: 2000,
      display: "flex",
      alignItems: "center",
      justifyContent: "center"
    }}>
      <div style={{
        background: "#fff",
        borderRadius: 18,
        boxShadow: "0 8px 32px #0003",
        padding: "36px 48px",
        minWidth: 420,
        textAlign: "center",
        animation: "popIn .25s cubic-bezier(.4,2,.6,1)"
      }}>
        <h2 style={{ margin: 0, fontWeight: 700, fontSize: 22, color: "#222", marginBottom: 18 }}>Accept Connection</h2>
        <table style={{ margin: "0 auto 18px auto", width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr>
              <th style={{ textAlign: "center", padding: 8, fontWeight: 600 }}>User ID</th>
              <th style={{ textAlign: "center", padding: 8, fontWeight: 600 }}>Name</th>
              <th style={{ textAlign: "center", padding: 8, fontWeight: 600 }}>Role</th>
              <th style={{ textAlign: "center", padding: 8, fontWeight: 600 }}>Company</th>
              <th style={{ textAlign: "center", padding: 8, fontWeight: 600 }}>Accept</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user, idx) => (
              <tr key={user.id}>
                <td style={{ padding: 8, textAlign: "center" }}>{user.id}</td>
                <td style={{ padding: 8, textAlign: "center" }}>{user.name}</td>
                <td style={{ padding: 8, textAlign: "center" }}>{user.role}</td>
                <td style={{ padding: 8, textAlign: "center" }}>{user.company}</td>
                <td style={{ padding: 8, textAlign: "center" }}>
                  <button
                    onClick={() => onAccept(user)}
                    style={{
                      background: "#1ed760",
                      color: "#fff",
                      border: "none",
                      borderRadius: 8,
                      padding: "8px 22px",
                      fontWeight: 600,
                      fontSize: 15,
                      cursor: "pointer"
                    }}
                  >Accept</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <button
          onClick={onClose}
          style={{
            marginTop: 8,
            background: "#eee",
            color: "#444",
            border: "none",
            borderRadius: 8,
            padding: "10px 24px",
            fontWeight: 600,
            fontSize: 16,
            cursor: "pointer"
          }}
        >Cancel</button>
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

export default function ConnectionPage() {
  const [dark, setDark] = useState(false);
  const [showNotify, setShowNotify] = useState(false);
  const [notifyMsg, setNotifyMsg] = useState("");
  const [showAccept, setShowAccept] = useState(false);
  const [users, setUsers] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const userEmail = localStorage.getItem("facevault_email") || "";

  // Fetch all users and current user info
  useEffect(() => {
    if (!userEmail) {
      window.location.href = "/login";
      return;
    }
    // Fetch current user
    fetch(`/connections/api/user-by-email?email=${encodeURIComponent(userEmail)}`)
      .then(res => res.json())
      .then(data => {
        setCurrentUser(data.user);
        // Fetch all users
        fetch("/connections/api/all-users")
          .then(res2 => res2.json())
          .then(data2 => {
            setUsers(data2.users || []);
          });
      });
  }, [userEmail]);

  // Filter users: exclude self, already connected, sent/received requests
  const getConnectableUsers = () => {
    if (!currentUser) return [];
    // Ensure arrays exist to avoid errors if fields are missing
    const connections = (currentUser.connections || []).map(id => id && id.toString());
    const sent = (currentUser.sent_requests || []).map(id => id && id.toString());
    const received = (currentUser.received_requests || []).map(id => id && id.toString());
    const excludeIds = [
      currentUser._id,
      ...connections,
      ...sent,
      ...received,
    ];
    return users.filter(
      u => !excludeIds.includes(u._id)
    );
  };

  const handleConnect = async (toUserId) => {
    if (!currentUser) return;
    await fetch("/connections/api/send-request", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ from_id: currentUser._id, to_id: toUserId }),
    });
    setNotifyMsg("Connection Sent");
    setShowNotify(true);
  };

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
      <main style={{ flex: 1, margin: 16, marginLeft: 0, display: "flex", flexDirection: "column", position: "relative" }}>
        <Header onToggleTheme={() => setDark((d) => !d)} />
        <section style={{
          background: dark ? "#23262f" : "#fff",
          borderRadius: 14,
          boxShadow: "0 2px 8px #0001",
          padding: 0,
          overflow: "hidden",
          transition: "background 0.3s",
          marginBottom: 32
        }}>
          <table style={{
            width: "100%",
            borderCollapse: "collapse",
            color: dark ? "#f7f8fa" : "#222"
          }}>
            <thead style={{ background: dark ? "#23262f" : "#f5f6fa" }}>
              <tr>
                <th style={{ textAlign: "center", padding: "14px 18px", fontWeight: 600, fontSize: 15 }}>Name</th>
                <th style={{ textAlign: "center", padding: "14px 18px", fontWeight: 600, fontSize: 15 }}>Role</th>
                <th style={{ textAlign: "center", padding: "14px 18px", fontWeight: 600, fontSize: 15 }}>Company</th>
                <th style={{ textAlign: "center", padding: "14px 18px", fontWeight: 600, fontSize: 15 }}>Connect</th>
              </tr>
            </thead>
            <tbody>
              {getConnectableUsers().map((user, idx) => (
                <tr key={user._id} style={{ borderBottom: "1px solid #f0f0f0" }}>
                  <td style={{ padding: "14px 18px", textAlign: "center", fontWeight: 500 }}>{user.username}</td>
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
                      onClick={() => handleConnect(user._id)}
                    >Connect</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
        {/* Floating user+ Button */}
        <button
          style={{
            position: "fixed",
            right: 40,
            bottom: 40,
            width: 64,
            height: 64,
            borderRadius: "50%",
            background: "#fff",
            color: "#1ed760",
            fontSize: 36,
            border: "none",
            boxShadow: "0 4px 16px #0002",
            cursor: "pointer",
            zIndex: 1000,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            animation: "notifPulse 1.2s infinite alternate"
          }}
          title="Pending Connection"
          onClick={() => setShowAccept(true)}
        >
          <span style={{ fontWeight: 700, fontSize: 32, marginRight: 4 }}>👤</span>+
          <style>
            {`
              @keyframes notifPulse {
                0% { box-shadow: 0 0 0 0 #1ed76044; }
                100% { box-shadow: 0 0 0 12px #1ed76011; }
              }
            `}
          </style>
        </button>
        {showAccept && (
          <PendingRequestsModal
            userId={currentUser && currentUser._id}
            onClose={() => setShowAccept(false)}
          />
        )}
        {showNotify && (
          <NotificationModal
            message={notifyMsg}
            onClose={() => setShowNotify(false)}
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
          .dark-theme button[title="Pending Connection"] {
            background: #23262f !important;
            color: #1ed760 !important;
          }
        `}
      </style>
    </div>
  );
}

// Modal to show pending received requests
function PendingRequestsModal({ userId, onClose }) {
  const [requests, setRequests] = useState([]);
  const [accepting, setAccepting] = useState(false);

  useEffect(() => {
    if (userId) {
      fetch(`/connections/api/received-requests/${userId}`)
        .then(res => res.json())
        .then(async data => {
          if (Array.isArray(data.requests) && data.requests.length > 0 && data.requests[0].username) {
            setRequests(data.requests);
          } else if (Array.isArray(data.requests) && data.requests.length > 0) {
            const users = await Promise.all(
              data.requests.map(id =>
                fetch(`/connections/api/user-by-id?id=${id}`)
                  .then(res => res.json())
                  .then(u => u.user)
              )
            );
            setRequests(users.filter(Boolean));
          } else {
            setRequests([]);
          }
        });
    }
  }, [userId, accepting]);

  const handleAccept = async (senderId) => {
    setAccepting(true);
    await fetch("/connections/api/accept-request", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ receiver_id: userId, sender_id: senderId }),
    });
    setAccepting(false);
    // Optionally, show a notification or refresh parent
  };

  return (
    <div style={{
      position: "fixed",
      top: 0, left: 0, width: "100vw", height: "100vh",
      background: "rgba(30, 34, 45, 0.25)",
      backdropFilter: "blur(8px)",
      zIndex: 2000,
      display: "flex",
      alignItems: "center",
      justifyContent: "center"
    }}>
      <div style={{
        background: "#fff",
        borderRadius: 18,
        boxShadow: "0 8px 32px #0003",
        padding: "36px 48px",
        minWidth: 420,
        textAlign: "center",
        animation: "popIn .25s cubic-bezier(.4,2,.6,1)"
      }}>
        <h2 style={{ margin: 0, fontWeight: 700, fontSize: 22, color: "#222", marginBottom: 18 }}>Pending Connection Requests</h2>
        <table style={{ margin: "0 auto 18px auto", width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr>
              <th style={{ textAlign: "center", padding: 8, fontWeight: 600 }}>Name</th>
              <th style={{ textAlign: "center", padding: 8, fontWeight: 600 }}>Role</th>
              <th style={{ textAlign: "center", padding: 8, fontWeight: 600 }}>Company</th>
              <th style={{ textAlign: "center", padding: 8, fontWeight: 600 }}>Action</th>
            </tr>
          </thead>
          <tbody>
            {requests.length === 0 ? (
              <tr>
                <td colSpan={4} style={{ padding: 16, textAlign: "center" }}>No pending requests</td>
              </tr>
            ) : (
              requests.map((user, idx) => (
                <tr key={user._id}>
                  <td style={{ padding: 8, textAlign: "center" }}>{user.username}</td>
                  <td style={{ padding: 8, textAlign: "center" }}>{user.role}</td>
                  <td style={{ padding: 8, textAlign: "center" }}>{user.company}</td>
                  <td style={{ padding: 8, textAlign: "center" }}>
                    <button
                      style={{
                        background: "#1ed760",
                        color: "#fff",
                        border: "none",
                        borderRadius: 8,
                        padding: "8px 22px",
                        fontWeight: 600,
                        fontSize: 15,
                        cursor: "pointer"
                      }}
                      disabled={accepting}
                      onClick={() => handleAccept(user._id)}
                    >Accept</button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
        <button
          onClick={onClose}
          style={{
            marginTop: 8,
            background: "#eee",
            color: "#444",
            border: "none",
            borderRadius: 8,
            padding: "10px 24px",
            fontWeight: 600,
            fontSize: 16,
            cursor: "pointer"
          }}
        >Close</button>
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
