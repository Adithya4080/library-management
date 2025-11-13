export interface IBook {
  isbn: string;
  title: string;
  author: string;
  availableCopies: number;
}

export interface IBorrowedBook {
  isbn: string;
  title: string;
  author: string;
  borrowedDate: string;
}

export interface IUser {
  id: string;
  name: string;
  email?: string;
  borrowedBooks: IBorrowedBook[];
}

export interface ILibraryStats {
  totalBooks: number;
  totalCopies: number;
  totalUsers: number;
  totalBorrowed: number;
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface BorrowRequest {
  userId: string;
  isbn: string;
}

export interface ReturnRequest {
  userId: string;
  isbn: string;
}

export const BORROWING_LIMIT = 2;

export class LibraryError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'LibraryError';
  }
}