export interface PaginatedData<T> {
  items: T[];
  totalItems: number;
  currentPage: number;
  totalPages: number;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  error?: {
    code: string;
    message: string;
  };
}
