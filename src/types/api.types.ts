// Generic API response
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

// API error format
export interface ApiError {
  detail: string;
  statusCode?: number;
}
