import axiosInstance from "../axios";

/* =========================================
   TYPES
========================================= */

export interface TaskFileReview {
  id: number;
  reviewer: number;
  reviewer_name: string;
  reviewed_by_role: "PM" | "ADMIN";
  review_version: number;
  comments: string;
  status: "approved" | "rework";
  reviewed_at: string;
}

export interface TaskFile {
  id: number;
  file: string;
  status: "pending" | "approved" | "rework";
  file_type: string;
  revision_no: number;
  uploaded_by: number;
  uploaded_by_name: string;
  uploaded_at: string;
  reviews: TaskFileReview[];
}

/* =========================================
   GET FILES OF A TASK
   GET /tasks/{taskId}/files/
========================================= */

export const getTaskFiles = async (
  taskId: number
): Promise<TaskFile[]> => {
  const response = await axiosInstance.get(
    `/tasks/${taskId}/files/`
  );

  return response.data;
};

/* =========================================
   UPLOAD FILE
   POST /tasks/{taskId}/upload-file/
========================================= */

export const uploadTaskFile = async (
  taskId: number,
  file: File
): Promise<TaskFile> => {
  const formData = new FormData();
  formData.append("file", file);

  const response = await axiosInstance.post(
    `/tasks/${taskId}/upload-file/`,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );

  return response.data;
};

/* =========================================
   REVIEW FILE
   POST /task-files/{fileId}/review/
========================================= */

export const reviewTaskFile = async (
  fileId: number,
  data: {
    comments: string;
    status: "approved" | "rework";
  }
): Promise<TaskFileReview> => {
  const response = await axiosInstance.post(
    `/task-files/${fileId}/review/`,
    data
  );

  return response.data;
};

/* =========================================
   DELETE FILE (Optional)
   DELETE /task-files/{fileId}/
========================================= */

export const deleteTaskFile = async (
  fileId: number
): Promise<void> => {
  await axiosInstance.delete(
    `/task-files/${fileId}/`
  );
};
