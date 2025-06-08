import React from "react";

export default function Header() {
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
      <div style={{ marginRight: 24, color: "#444" }}>⛓️ Ethereum ▼</div>
      <div style={{ marginRight: 24, color: "#444" }}>0xC4....8aMe</div>
      <button style={{
        background: "#fafbfc",
        border: "1px solid #e0e0e0",
        borderRadius: "50%",
        width: 36,
        height: 36,
        fontSize: 18,
        cursor: "pointer"
      }}>🌙</button>
    </header>
  );
}
