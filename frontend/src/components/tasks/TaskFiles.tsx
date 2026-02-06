import React, { useEffect, useState } from "react";
import "../../css/kanban.css";
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

  /* -------------------- helpers -------------------- */

  // Convert stored path → usable URL
  const fileUrl = (fp: string) => {
    if (!fp) return "";
    if (fp.startsWith("http")) return fp;
    if (fp.startsWith("/")) return `${API_BASE_URL}${fp}`;
    if (fp.startsWith("media/")) return `${API_BASE_URL}/${fp}`;
    return `${API_BASE_URL}/media/${fp}`;
  };

  // Remove random suffix before extension
  const displayFileName = (f: TaskFile) => {
    const name = f.file_name || f.file_path?.split("/").pop() || "file";

    // example: abc_2aG5ISl.webp → abc.webp
    return name.replace(/_[^_.]+(?=\.)/, "");
  };

  /* -------------------- data -------------------- */

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

  /* -------------------- actions -------------------- */

  const onUpload = async () => {
    if (!selectedFile) return;
    setLoading(true);
    try {
      await uploadTaskFile(taskId, selectedFile);
      setSelectedFile(null);
      await fetchFiles();
      toast.success("File uploaded");
    } catch (err: any) {
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
      const msg =
        err?.response?.data?.error ||
        err?.response?.data ||
        err?.message ||
        "Delete failed";
      toast.error(String(msg));
    }
  };

  const closePreview = () => {
    setPreviewUrl(null);
    setPreviewKind(null);
    setPreviewText(null);
    setPreviewName("");
  };

  /* -------------------- preview -------------------- */

  const onPreview = async (f: TaskFile) => {
    const preferredUrl = f.file_url || fileUrl(f.file_path);
    const name = displayFileName(f);
    const ext = (name.split(".").pop() || "").toLowerCase();

    const imageExts = ["png", "jpg", "jpeg", "gif", "webp", "bmp"];
    const textExts = ["txt", "md", "csv", "json"];
    const officeExts = ["doc", "docx", "xls", "xlsx", "ppt", "pptx"];

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

    window.open(preferredUrl, "_blank");
  };

  /* -------------------- UI -------------------- */

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
          <li key={f.id} style={{ marginTop: 8 }} onClick={() => onPreview(f)}>
            <button type="button" className="btn btn-link p-0">
              {displayFileName(f)}
            </button>

            {f.uploaded_by_name && (
              <span className="uploaded-by">{f.uploaded_by_name}</span>
            )}

            <button
              style={{ marginLeft: 8 }}
              onClick={(e) => {
                e.stopPropagation(); // IMPORTANT
                onDelete(f.id);
              }}
            >
              Delete
            </button>
          </li>
        ))}
      </ul>

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
              <div className="modal-dialog modal-lg">
                <div className="modal-content">
                  <div className="modal-header">
                    <h5 className="modal-title">Preview: {previewName}</h5>
                    <button
                      type="button"
                      className="btn-close"
                      onClick={closePreview}
                    />
                  </div>

                  <div className="modal-body">
                    {previewKind === "pdf" && previewUrl && (
                      <iframe
                        src={previewUrl}
                        title={previewName}
                        className="pdf-preview-frame"
                      />
                    )}

                    {previewKind === "image" && previewUrl && (
                      <img
                        src={previewUrl}
                        alt={previewName}
                        style={{ maxWidth: "100%" }}
                        onError={() => window.open(previewUrl, "_blank")}
                      />
                    )}

                    {previewKind === "text" && (
                      <pre style={{ whiteSpace: "pre-wrap" }}>
                        {previewText}
                      </pre>
                    )}
                  </div>

                  <div className="modal-footer">
                    <button
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
