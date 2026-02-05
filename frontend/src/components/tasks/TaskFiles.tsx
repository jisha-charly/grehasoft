import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { toast } from "react-toastify";
import {
  getTaskFiles,
  uploadTaskFile,
  deleteTaskFile,
} from "../../api/services/task.service";
import { API_BASE_URL } from "../../config/env";

type TaskFile = {
  id: number;
  file_path: string;
  file_url?: string;
  file_name?: string;
  file_type?: string;
  revision_no?: number;
  uploaded_at?: string;
  uploaded_by_name?: string;
};

interface Props {
  taskId: number;
}

const TaskFiles: React.FC<Props> = ({ taskId }) => {
  const [files, setFiles] = useState<TaskFile[]>([]);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [previewKind, setPreviewKind] = useState<
    "pdf" | "image" | "text" | "other" | null
  >(null);
  const [previewText, setPreviewText] = useState<string | null>(null);
  const [previewName, setPreviewName] = useState<string>("");

  const fetchFiles = async () => {
    try {
      const data = await getTaskFiles(taskId);
      setFiles(data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchFiles();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [taskId]);

  const onUpload = async () => {
    if (!selectedFile) return;
    setLoading(true);
    try {
      await uploadTaskFile(taskId, selectedFile);
      setSelectedFile(null);
      await fetchFiles();
      toast.success("File uploaded");
    } catch (err: any) {
      console.error(err);
      const msg =
        err?.response?.data?.error ||
        err?.response?.data ||
        err?.message ||
        "Upload failed";
      toast.error(String(msg));
    } finally {
      setLoading(false);
    }
  };

  const onDelete = async (id: number) => {
    try {
      await deleteTaskFile(id);
      await fetchFiles();
      toast.success("File deleted");
    } catch (err: any) {
      console.error(err);
      const msg =
        err?.response?.data?.error ||
        err?.response?.data ||
        err?.message ||
        "Delete failed";
      toast.error(String(msg));
    }
  };

  const fileUrl = (fp: string) => {
    if (!fp) return "";
    if (fp.startsWith("http")) return fp;
    // If already absolute (starts with '/'), attach to API
    if (fp.startsWith("/")) return `${API_BASE_URL}${fp}`;
    // If already starts with media/, attach directly
    if (fp.startsWith("media/")) return `${API_BASE_URL}/${fp}`;
    // Otherwise assume it's a stored path like 'task_files/..' and prefix with /media/
    return `${API_BASE_URL}/media/${fp}`;
  };

  const closePreview = () => {
    setPreviewUrl(null);
    setPreviewKind(null);
    setPreviewText(null);
    setPreviewName("");
  };

  const onPreview = async (f: TaskFile) => {
    // Prefer server-provided absolute URL if available
    const originalUrl = f.file_url || fileUrl(f.file_path);
    // Serve endpoint to ensure inline viewing and permissive headers

    const name = f.file_name || f.file_path.split("/").pop() || "file";
    const ext = (name.split(".").pop() || "").toLowerCase();

    // Quick mapping
    const imageExts = ["png", "jpg", "jpeg", "gif", "webp", "bmp"];
    const textExts = ["txt", "md", "csv", "json"];
    const officeExts = ["doc", "docx", "xls", "xlsx", "ppt", "pptx"];

    // For PDFs and images prefer the serializer-provided absolute file URL if available
    const preferredUrl = originalUrl;

    if (ext === "pdf") {
      setPreviewKind("pdf");
      setPreviewUrl(preferredUrl);
      setPreviewName(name);
      return;
    }

    if (imageExts.includes(ext)) {
      setPreviewKind("image");
      setPreviewUrl(preferredUrl);
      setPreviewName(name);
      return;
    }

    if (textExts.includes(ext)) {
      setPreviewKind("text");
      setPreviewUrl(preferredUrl);
      setPreviewName(name);
      try {
        const res = await fetch(preferredUrl);
        const txt = await res.text();
        setPreviewText(txt);
      } catch {
        setPreviewText("Unable to load preview");
      }
      return;
    }

    if (officeExts.includes(ext)) {
      window.open(preferredUrl, "_blank");
      return;
    }

    // other types - open preferred URL in new tab
    window.open(preferredUrl, "_blank");
  };
  const fileIcon = (name: string) => {
    const ext = name.split(".").pop()?.toLowerCase();
    if (!ext) return "📄";
    if (["png", "jpg", "jpeg", "gif", "webp"].includes(ext)) return "🖼️";
    if (ext === "pdf") return "📕";
    if (["doc", "docx"].includes(ext)) return "📘";
    if (["xls", "xlsx"].includes(ext)) return "📗";
    if (["zip", "rar"].includes(ext)) return "🗜️";
    return "📄";
  };
  return (
    <div className="task-files">
      <h4>Files</h4>
      <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
        <input
          type="file"
          onChange={(e) => setSelectedFile(e.target.files?.[0] ?? null)}
        />
        <button onClick={onUpload} disabled={!selectedFile || loading}>
          {loading ? "Uploading..." : "Upload"}
        </button>
      </div>

      <ul>
        {files.map((f) => (
          <li key={f.id} style={{ marginTop: 8 }}>
            <button
              type="button"
              className="btn btn-link p-0"
              onClick={() => onPreview(f)}
            >
              {f.file_name || f.file_path.split("/").pop()}
            </button>

            {f.uploaded_by_name ? ` — ${f.uploaded_by_name}` : ""}
            <button style={{ marginLeft: 8 }} onClick={() => onDelete(f.id)}>
              Delete
            </button>
          </li>
        ))}
      </ul>

      {/* Preview modal (portal to body) */}
      {(previewUrl || previewText) &&
        createPortal(
          <div
            className="modal-backdrop show preview-backdrop"
            onClick={closePreview}
          >
            <div
              className="modal show d-block preview-modal"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="modal-dialog modal-lg" role="document">
                <div className="modal-content">
                  <div className="modal-header">
                    <h5 className="modal-title">Preview: {previewName}</h5>
                    <button
                      type="button"
                      className="btn-close"
                      aria-label="Close"
                      onClick={closePreview}
                    ></button>
                  </div>
                  <div className="modal-body">
                    {previewKind === "pdf" && previewUrl && (
                      <object
                        data={previewUrl}
                        type="application/pdf"
                        width="100%"
                        height="70vh"
                      >
                        <p>
                          PDF preview is not supported in this browser.
                          <br />
                          <a href={previewUrl} target="_blank" rel="noreferrer">
                            Click here to open the PDF
                          </a>
                        </p>
                      </object>
                    )}

                    {previewKind === "image" && previewUrl && (
                      <img
                        src={previewUrl}
                        alt={previewName}
                        style={{ maxWidth: "100%", height: "auto" }}
                        onError={(e) => {
                          // If image fails (CORS or 404), open in new tab as fallback
                          console.error("Image preview failed for", previewUrl);
                          window.open(previewUrl, "_blank");
                          // close inline preview
                          setTimeout(() => {
                            setPreviewUrl(null);
                            setPreviewKind(null);
                          }, 50);
                        }}
                      />
                    )}

                    {previewKind === "text" && (
                      <pre
                        style={{
                          whiteSpace: "pre-wrap",
                          maxHeight: 500,
                          overflow: "auto",
                        }}
                      >
                        {previewText}
                      </pre>
                    )}

                    {!previewKind && previewUrl && (
                      <div>
                        <p>Preview not available for this file type.</p>
                        <a href={previewUrl} target="_blank" rel="noreferrer">
                          Open file
                        </a>
                      </div>
                    )}
                  </div>
                  <div className="modal-footer">
                    <button
                      type="button"
                      className="btn btn-secondary"
                      onClick={closePreview}
                    >
                      Close
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>,
          document.body,
        )}
    </div>
  );
};

export default TaskFiles;
