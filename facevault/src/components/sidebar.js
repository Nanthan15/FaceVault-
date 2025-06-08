import React from "react";

export default function Sidebar() {
  return (
    <aside style={{
      width: 260,
      background: "#fff",
      borderRadius: 16,
      margin: 16,
      padding: 24,
      display: "flex",
      flexDirection: "column",
      boxShadow: "0 2px 8px #0001"
    }}>
      <div style={{ display: "flex", alignItems: "center", marginBottom: 24 }}>
        <img src="https://randomuser.me/api/portraits/men/32.jpg" alt="avatar" style={{ width: 40, height: 40, borderRadius: "50%", marginRight: 12 }} />
        <div>
          <div style={{ fontWeight: 600 }}>Borja Soler</div>
          <div style={{ fontSize: 12, color: "#888" }}>Encryption on <span style={{ color: "#0c0", marginLeft: 4 }}>●</span></div>
        </div>
      </div>
      <button style={{
        background: "#1ed760",
        color: "#fff",
        border: "none",
        borderRadius: 8,
        padding: "12px 0",
        fontWeight: 600,
        fontSize: 16,
        marginBottom: 24,
        cursor: "pointer"
      }}>+ Upload file</button>
      <nav style={{ flex: 1 }}>
        <div style={{ marginBottom: 12, fontWeight: 500, color: "#222" }}>My storage</div>
        <div style={{ marginBottom: 8, color: "#444" }}>Shared with me</div>
        <div style={{ marginBottom: 8, color: "#444" }}>Recent</div>
        <div style={{ marginBottom: 8, color: "#444" }}>Deleted</div>
        <div style={{ marginBottom: 8, color: "#444" }}>Migration</div>
        <div style={{ marginBottom: 8, color: "#444" }}>Api key</div>
      </nav>
      <div style={{ marginTop: 24, fontSize: 13, color: "#888" }}>
        <div>🗂️ 10 GB Used</div>
        <div style={{ margin: "8px 0" }}>
          <div style={{
            background: "#eee",
            borderRadius: 8,
            height: 8,
            width: "100%",
            overflow: "hidden"
          }}>
            <div style={{
              background: "#1ed760",
              width: "28%",
              height: "100%"
            }}></div>
          </div>
          <div style={{ fontSize: 12, marginTop: 4 }}>28% used – 40 GB available</div>
        </div>
        <div style={{
          background: "#222",
          color: "#fff",
          borderRadius: 10,
          padding: 12,
          marginTop: 12,
          textAlign: "center"
        }}>
          <div style={{ fontSize: 13, marginBottom: 6 }}>Need more space?</div>
          <div style={{ fontSize: 12, marginBottom: 8 }}>Upgrade storage for $5.99 per month</div>
          <button style={{
            background: "#1ed760",
            color: "#222",
            border: "none",
            borderRadius: 8,
            padding: "6px 18px",
            fontWeight: 600,
            cursor: "pointer"
          }}>Upgrade</button>
        </div>
      </div>
    </aside>
  );
}
