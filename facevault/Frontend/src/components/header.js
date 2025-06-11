import React from "react";

export default function Header({ onToggleTheme }) {
  return (
    <header style={{ display: "flex", alignItems: "center", marginBottom: 24 }}>
      <input
        type="text"
        placeholder="Search inside Hello storage"
        style={{
          flex: 1,
          padding: "10px 16px",
          borderRadius: 8,
          border: "1px solid #e0e0e0",
          fontSize: 15,
          marginRight: 24,
          background: "#fafbfc"
        }}
      />
      
      {/* <div style={{ marginRight: 24, color: "#444" }}>0xC4....8aMe</div> */}
      <button
        style={{
          background: "#fafbfc",
          border: "1px solid #e0e0e0",
          borderRadius: "50%",
          width: 36,
          height: 36,
          fontSize: 18,
          cursor: "pointer"
        }}
        onClick={onToggleTheme}
        title="Toggle dark mode"
      >🌙</button>
      <button
        style={{
          marginLeft: 16,
          background: "#ff4d4f",
          color: "#fff",
          border: "none",
          borderRadius: 6,
          padding: "6px 18px",
          fontWeight: 600,
          fontSize: 14,
          cursor: "pointer",
          boxShadow: "0 1px 4px #0001",
        }}
        onClick={() => {
          localStorage.removeItem("facevault_email");
          window.location.href = "/login";
        }}
      >
        Logout
      </button>
    </header>
  );
}
