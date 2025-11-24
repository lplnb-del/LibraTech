
export interface Book {
  id: string; // String(36)
  title: string; // String(128)
  author: string; // String(64)
  isbn: string; // String(17)
  total_copies: number; // Integer
  available_copies: number; // Integer
  coverUrl?: string; // New field for cover image
  category?: string;
  description?: string; // AI generated
}

export interface User {
  id: string; // String(36)
  student_id: string; // String(32)
  name: string; // String(32)
  email: string; // String(64)
  role: 'admin' | 'student';
}

export interface BorrowRecord {
  id: string; // String(36)
  book_id: string; // String(36)
  user_id: string; // String(36)
  borrow_date: string; // DateTime (ISO string)
  return_date: string | null; // DateTime (ISO string) or null if active
  due_date: string; // Calculated due date
}

export interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  trend?: string;
  color: string;
}

export enum AppRoute {
  LOGIN = 'login',
  DASHBOARD = 'dashboard',
  BOOKS = 'books',
  BOOKS_ADD = 'books/add',
  USERS = 'users',
  USERS_ADD = 'users/add',
  BORROW_ACTIVE = 'borrow/active',
  BORROW_HISTORY = 'borrow/history',
  
  // Student Routes
  STUDENT_HOME = 'student/home',
  STUDENT_SEARCH = 'student/search',
  STUDENT_SHELF = 'student/shelf', // New: Visual Bookshelf
  STUDENT_SUCCESS = 'student/success', // New: Borrow Result Page
}
