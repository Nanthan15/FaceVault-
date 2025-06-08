import React from "react";
import CheckPage from "../pages/check";
import { href } from "react-router-dom";

export default function Sidebar({ dark }) {
  const pathname = window.location.pathname;

  const navItems = [
    { label: "Home page", href: "/check" },
    { label: "Vault", href: "/vault" },
    { label: "Add Connection", href: "/connection" },
    { label: "Share Files", href: "/send" },
    { label: "Receive Files", href: "/receive" },
    {label: "Logout", href: "/" },
  ];

  return (
    <aside style={{
      width: 260,
      background: dark ? "#23262f" : "#fff",
      borderRadius: 16,
      margin: 16,
      padding: 24,
      display: "flex",
      flexDirection: "column",
      boxShadow: "0 2px 8px #0001",
      color: dark ? "#f7f8fa" : "#222",
      transition: "background 0.3s, color 0.3s"
    }}>
      <div style={{ display: "flex", alignItems: "center", marginBottom: 24 }}>
        <img src="https://randomuser.me/api/portraits/men/32.jpg" alt="avatar" style={{ width: 40, height: 40, borderRadius: "50%", marginRight: 12 }} />
        <div>
          <div style={{ fontWeight: 600 }}>Nanthan Shetty</div>
          <div style={{ fontSize: 12, color: dark ? "#bbb" : "#888" }}>Encryption on <span style={{ color: "#0c0", marginLeft: 4 }}>●</span></div>
        </div>
      </div>
      <button style={{
        background: "#1ed760",
        color: dark ? "#23262f" : "#fff",
        border: "none",
        borderRadius: 8,
        padding: "12px 0",
        fontWeight: 600,
        fontSize: 16,
        marginBottom: 24,
        cursor: "pointer"
      }}>+ Upload file</button>
      <nav style={{ flex: 1 }}>
        {navItems.map((item, idx) => {
          const isActive = item.href && pathname.endsWith(item.href);
          return (
            <div
              key={item.label}
              style={{
                marginBottom: idx === 0 ? 12 : 8,
                fontWeight: isActive ? 700 : (idx === 0 ? 500 : 400),
                color: isActive
                  ? "#1ed760"
                  : dark
                  ? idx === 0
                    ? "#f7f8fa"
                    : "#bbb"
                  : idx === 0
                  ? "#222"
                  : "#444"
              }}
            >
              {item.href ? (
                <a
                  href={item.href}
                  style={{
                    color: isActive
                      ? "#1ed760"
                      : dark
                      ? idx === 0
                        ? "#f7f8fa"
                        : "#bbb"
                      : idx === 0
                      ? "#222"
                      : "#444",
                    textDecoration: "none",
                    fontWeight: isActive ? 700 : 500
                  }}
                >
                  {item.label}
                </a>
              ) : (
                item.label
              )}
            </div>
          );
        })}
      </nav>
      <div style={{ marginTop: 24, fontSize: 13, color: dark ? "#bbb" : "#888" }}>
        <div>🗂️ 10 GB Used</div>
        <div style={{ margin: "8px 0" }}>
          <div style={{
            background: dark ? "#444" : "#eee",
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
          background: dark ? "#181a20" : "#222",
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
            color: dark ? "#181a20" : "#222",
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
