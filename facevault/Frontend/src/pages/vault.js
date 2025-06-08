import React, { useState } from "react";
import Sidebar from "../components/sidebar";
import Header from "../components/header";
import UploadModal from "../components/uploadModal";

const files = [
  {
    name: "Invoice.pdf",
    cid: "Qm123...abcd",
    size: "1.2 MB",
    fileType: "PDF",
    modified: "2 days ago",
  },
  {
    name: "ProjectPlan.docx",
    cid: "Qm456...efgh",
    size: "800 KB",
    fileType: "DOCX",
    modified: "3 days ago",
  },
  {
    name: "Logo.png",
    cid: "Qm789...ijkl",
    size: "250 KB",
    fileType: "PNG",
    modified: "5 days ago",
  },
  {
    name: "Invoice.pdf",
    cid: "Qm123...abcd",
    size: "1.2 MB",
    fileType: "PDF",
    modified: "2 days ago",
  },
  {
    name: "Logo.png",
    cid: "Qm789...ijkl",
    size: "250 KB",
    fileType: "PNG",
    modified: "5 days ago",
  },
];

export default function VaultPage() {
  const [showModal, setShowModal] = useState(false);
  const [dark, setDark] = useState(false);

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
                {files.map((file, idx) => (
                  <tr
                    key={idx}
                    style={{ borderBottom: "1px solid #f0f0f0" }}
                  >
                    <td
                      style={{
                        padding: "14px 18px",
                        fontWeight: 500,
                      }}
                    >
                      {file.name}
                    </td>
                    <td
                      style={{
                        padding: "14px 18px",
                        color: "#888",
                      }}
                    >
                      {file.cid}
                    </td>
                    <td
                      style={{
                        padding: "14px 18px",
                      }}
                    >
                      {file.size}
                    </td>
                    <td
                      style={{
                        padding: "14px 18px",
                      }}
                    >
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
                    <td
                      style={{
                        padding: "14px 18px",
                        color: "#888",
                      }}
                    >
                      {file.modified}
                    </td>
                    <td
                      style={{
                        padding: "14px 18px",
                      }}
                    >
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
                      >
                        Decrypt
                      </button>
                    </td>
                    <td
                      style={{
                        padding: "14px 18px",
                      }}
                    >
                      <span
                        style={{
                          fontSize: 22,
                          cursor: "pointer",
                        }}
                      >
                        ⋮
                      </span>
                    </td>
                  </tr>
                ))}
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
        {showModal && <UploadModal onClose={() => setShowModal(false)} />}
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
