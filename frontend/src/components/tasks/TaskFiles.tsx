import React, { useEffect, useState } from "react";
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
    if (!fp) return "#";
    if (fp.startsWith("http")) return fp;
    // If fp starts with /media or media
    if (fp.startsWith("/")) return `${API_BASE_URL}${fp}`;
    return `${API_BASE_URL}${fp}`;
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
            <a href={fileUrl(f.file_path)} target="_blank" rel="noreferrer">
              {f.file_path.split("/").pop()}
            </a>
            {f.uploaded_by_name ? ` — ${f.uploaded_by_name}` : ""}
            <button style={{ marginLeft: 8 }} onClick={() => onDelete(f.id)}>
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TaskFiles;
