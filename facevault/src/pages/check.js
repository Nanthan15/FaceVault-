import React from "react";
import Sidebar from "../components/sidebar";
import Header from "../components/header";

const folders = [
  { name: "Backups" },
  { name: "Other devices" },
  { name: "Images" },
  { name: "Development" },
];

const files = [
  {
    name: "Defect images",
    type: "folder",
    cid: "0E7...27QA",
    size: "10.6 MB",
    fileType: "Encrypted",
    modified: "1 days ago",
  },
  {
    name: "Assets",
    type: "folder",
    cid: "5A8...4F9S",
    size: "132.56 MB",
    fileType: "Public",
    modified: "2 days ago",
  },
  {
    name: "UI files",
    type: "folder",
    cid: "0E5...765E",
    size: "56.40 MB",
    fileType: "Public",
    modified: "5 days ago",
  },
  {
    name: "Documentation",
    type: "folder",
    cid: "0E2...425B",
    size: "1.8 GB",
    fileType: "Public",
    modified: "8 days ago",
  },
  {
    name: "3d credit card .jpg",
    type: "image",
    cid: "0A1...937N",
    size: "244.92 KB",
    fileType: "Encrypted",
    modified: "14 days ago",
  },
  {
    name: "panel 1 image.jpg",
    type: "image",
    cid: "0F1...837F",
    size: "564.10 KB",
    fileType: "Encrypted",
    modified: "14 days ago",
  },
  {
    name: "branding details.doc",
    type: "doc",
    cid: "0B7...887V",
    size: "1.3 MB",
    fileType: "Public",
    modified: "24 days ago",
  },
  {
    name: "store 1 dataset.csv",
    type: "csv",
    cid: "0A3...556J",
    size: "426.13 KB",
    fileType: "Encrypted",
    modified: "1 month ago",
  },
  {
    name: "promotion video.mp4",
    type: "video",
    cid: "0B3...251U",
    size: "2.1 GB",
    fileType: "Encrypted",
    modified: "2 month ago",
  },
];

const iconForType = (type) => {
  switch (type) {
    case "folder":
      return "📁";
    case "image":
      return "🖼️";
    case "doc":
      return "📄";
    case "csv":
      return "📊";
    case "video":
      return "🎬";
    default:
      return "📦";
  }
};

export default function CheckPage() {
  return (
    <div style={{ display: "flex", height: "100vh", background: "#f7f8fa" }}>
      <Sidebar />
      <main style={{ flex: 1, margin: 16, marginLeft: 0, display: "flex", flexDirection: "column" }}>
        <Header />
        {/* Folders */}
        <section style={{ display: "flex", gap: 18, marginBottom: 32 }}>
          <div style={{
            background: "#f5faf5",
            borderRadius: 12,
            width: 140,
            height: 90,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            fontWeight: 600,
            fontSize: 18,
            color: "#222",
            border: "2px dashed #d0e8d0",
            cursor: "pointer"
          }}>
            <span style={{ fontSize: 32, marginBottom: 6 }}>+</span>
            Create folder
          </div>
          {folders.map((f, i) => (
            <div key={i} style={{
              background: "#f5faf5",
              borderRadius: 12,
              width: 140,
              height: 90,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              fontWeight: 600,
              fontSize: 18,
              color: "#222",
              cursor: "pointer"
            }}>
              <span style={{ fontSize: 32, marginBottom: 6 }}>📁</span>
              {f.name}
            </div>
          ))}
        </section>
        {/* Files Table */}
        <section style={{
          background: "#fff",
          borderRadius: 14,
          boxShadow: "0 2px 8px #0001",
          padding: 0,
          overflow: "hidden"
        }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead style={{ background: "#f5f6fa" }}>
              <tr>
                <th style={{ textAlign: "left", padding: "14px 18px", fontWeight: 600, fontSize: 15, color: "#444" }}>File Name</th>
                <th style={{ textAlign: "left", padding: "14px 18px", fontWeight: 600, fontSize: 15, color: "#444" }}>CID</th>
                <th style={{ textAlign: "left", padding: "14px 18px", fontWeight: 600, fontSize: 15, color: "#444" }}>Size</th>
                <th style={{ textAlign: "left", padding: "14px 18px", fontWeight: 600, fontSize: 15, color: "#444" }}>File Type</th>
                <th style={{ textAlign: "left", padding: "14px 18px", fontWeight: 600, fontSize: 15, color: "#444" }}>Last Modified</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {files.map((file, idx) => (
                <tr key={idx} style={{ borderBottom: "1px solid #f0f0f0" }}>
                  <td style={{ padding: "14px 18px", fontWeight: 500 }}>
                    <span style={{ marginRight: 10 }}>{iconForType(file.type)}</span>
                    {file.name}
                  </td>
                  <td style={{ padding: "14px 18px", color: "#888" }}>{file.cid}</td>
                  <td style={{ padding: "14px 18px" }}>{file.size}</td>
                  <td style={{ padding: "14px 18px" }}>
                    <span style={{
                      display: "inline-block",
                      background: file.fileType === "Encrypted" ? "#e6e6ff" : "#e6ffe6",
                      color: file.fileType === "Encrypted" ? "#5a4fff" : "#1ed760",
                      borderRadius: 8,
                      padding: "2px 10px",
                      fontSize: 13,
                      fontWeight: 600
                    }}>{file.fileType}</span>
                  </td>
                  <td style={{ padding: "14px 18px", color: "#888" }}>{file.modified}</td>
                  <td style={{ padding: "14px 18px" }}>
                    <span style={{ fontSize: 22, cursor: "pointer" }}>⋮</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      </main>
    </div>
  );
}
