
import { Book, User, BorrowRecord } from '../types';

// TOGGLE THIS TO SWITCH BETWEEN MOCK AND REAL API (Simulated)
// For this preview environment, we keep it false.
const USE_REAL_API = false;
const API_BASE_URL = '/api';

// Helper to generate UUIDs
const uuid = () => crypto.randomUUID();

// --- MOCK DATA ---
const firstNames = ['伟', '芳', '娜', '敏', '静', '秀英', '丽', '强', '磊', '洋', '勇', '军', '杰', '涛', '超', '明', '刚', '平'];
const lastNames = ['李', '王', '张', '刘', '陈', '杨', '赵', '黄', '周', '吴', '徐', '孙', '胡', '朱', '高', '林', '何', '郭'];
const bookTitles = ['红楼梦', '活着', '三体', '围城', '百年孤独', '平凡的世界', '哈利·波特与魔法石', '解忧杂货店', '追风筝的人', '人类简史', '西游记', '三国演义', '水浒传', '呐喊', '白鹿原'];
const authors = ['曹雪芹', '余华', '刘慈欣', '钱钟书', '加西亚·马尔克斯', '路遥', 'J.K.罗琳', '东野圭吾', '卡勒德·胡赛尼', '尤瓦尔·赫拉利', '吴承恩', '罗贯中', '施耐庵', '鲁迅', '陈忠实'];

// Unsplash Image IDs for books
const coverImages = [
  "https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&w=400&q=80",
  "https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=400&q=80",
  "https://images.unsplash.com/photo-1543002588-bfa74002ed7e?auto=format&fit=crop&w=400&q=80",
  "https://images.unsplash.com/photo-1589829085413-56de8ae18c73?auto=format&fit=crop&w=400&q=80",
  "https://images.unsplash.com/photo-1532012197267-da84d127e765?auto=format&fit=crop&w=400&q=80",
  "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&w=400&q=80",
  "https://images.unsplash.com/photo-1495446815901-a7297e633e8d?auto=format&fit=crop&w=400&q=80",
  "https://images.unsplash.com/photo-1541963463532-d68292c34b19?auto=format&fit=crop&w=400&q=80"
];

const STORAGE_KEYS = {
  BOOKS: 'lms_books',
  USERS: 'lms_users',
  BORROWS: 'lms_borrows',
};

class DataService {
  private books: Book[] = [];
  private users: User[] = [];
  private borrows: BorrowRecord[] = [];
  private initialized = false;

  constructor() {
    if (typeof window !== 'undefined') {
      this.initMockData();
    }
  }

  private initMockData() {
    this.books = JSON.parse(localStorage.getItem(STORAGE_KEYS.BOOKS) || '[]');
    this.users = JSON.parse(localStorage.getItem(STORAGE_KEYS.USERS) || '[]');
    this.borrows = JSON.parse(localStorage.getItem(STORAGE_KEYS.BORROWS) || '[]');

    if (this.users.length === 0) {
      this.seed();
    }
    this.initialized = true;
  }

  private save() {
    if (typeof window === 'undefined') return;
    localStorage.setItem(STORAGE_KEYS.BOOKS, JSON.stringify(this.books));
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(this.users));
    localStorage.setItem(STORAGE_KEYS.BORROWS, JSON.stringify(this.borrows));
  }

  private seed() {
    // Seed Admin
    this.users.push({
      id: uuid(),
      student_id: 'ADMIN001',
      name: '系统管理员',
      email: 'admin@lms.edu',
      role: 'admin'
    });

    // Seed Users
    for (let i = 0; i < 15; i++) {
      const name = `${lastNames[Math.floor(Math.random() * lastNames.length)]}${firstNames[Math.floor(Math.random() * firstNames.length)]}`;
      this.users.push({
        id: uuid(),
        student_id: `STU${2024000 + i}`,
        name,
        email: `stu${2024000 + i}@student.lms.edu`,
        role: 'student'
      });
    }

    // Seed Books
    for (let i = 0; i < 20; i++) {
      const total = Math.floor(Math.random() * 10) + 2;
      this.books.push({
        id: uuid(),
        title: bookTitles[i % bookTitles.length] + (i > 14 ? ' (精装版)' : ''),
        author: authors[i % authors.length],
        isbn: `978-7-${Math.floor(Math.random() * 1000000000)}`,
        total_copies: total,
        available_copies: total,
        coverUrl: coverImages[i % coverImages.length],
        category: ['小说', '科幻', '历史', '科学', '文学'][Math.floor(Math.random() * 5)]
      });
    }
    this.save();
  }

  // --- UNIFIED ASYNC API ---

  async getBooks(): Promise<Book[]> {
    if (USE_REAL_API) {
        const res = await fetch(`${API_BASE_URL}/books`);
        return res.json();
    }
    return new Promise(resolve => setTimeout(() => resolve([...this.books]), 300));
  }

  async getUsers(): Promise<User[]> {
    if (USE_REAL_API) {
        const res = await fetch(`${API_BASE_URL}/users`);
        return res.json();
    }
    return new Promise(resolve => setTimeout(() => resolve([...this.users]), 300));
  }

  async getBorrowRecords(): Promise<BorrowRecord[]> {
    if (USE_REAL_API) {
        // In a real app, this might be a separate endpoint or filtered
        return []; 
    }
    return new Promise(resolve => setTimeout(() => resolve([...this.borrows]), 300));
  }

  async addBook(book: Omit<Book, 'id' | 'available_copies'>): Promise<Book> {
    if (USE_REAL_API) {
        const res = await fetch(`${API_BASE_URL}/books`, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(book)
        });
        return res.json();
    }
    
    const newBook: Book = {
      ...book,
      id: uuid(),
      available_copies: book.total_copies,
      coverUrl: coverImages[Math.floor(Math.random() * coverImages.length)]
    };
    this.books.push(newBook);
    this.save();
    return new Promise(resolve => setTimeout(() => resolve(newBook), 300));
  }

  async deleteBook(id: string): Promise<void> {
    if (USE_REAL_API) {
        await fetch(`${API_BASE_URL}/books/${id}`, { method: 'DELETE' });
        return;
    }
    this.books = this.books.filter(b => b.id !== id);
    this.save();
    return new Promise(resolve => setTimeout(resolve, 300));
  }

  async borrowBook(bookId: string, userId: string): Promise<BorrowRecord> {
     if (USE_REAL_API) {
         const res = await fetch(`${API_BASE_URL}/borrow`, {
             method: 'POST',
             headers: {'Content-Type': 'application/json'},
             body: JSON.stringify({ book_id: bookId, user_id: userId })
         });
         if (!res.ok) throw new Error('Failed to borrow');
         return res.json();
     }

    const bookIdx = this.books.findIndex(b => b.id === bookId);
    if (bookIdx === -1) throw new Error("未找到该书");
    if (this.books[bookIdx].available_copies <= 0) throw new Error("暂无库存");

    const borrowDate = new Date();
    const dueDate = new Date(borrowDate.getTime() + 14 * 24 * 60 * 60 * 1000); 

    const record: BorrowRecord = {
      id: uuid(),
      book_id: bookId,
      user_id: userId,
      borrow_date: borrowDate.toISOString(),
      return_date: null,
      due_date: dueDate.toISOString()
    };

    this.books[bookIdx].available_copies -= 1;
    this.borrows.push(record);
    this.save();
    return new Promise(resolve => setTimeout(() => resolve(record), 600)); // Increased latency for effect
  }

  async returnBook(recordId: string): Promise<void> {
      // Mock only for return logic in this demo
      const recordIdx = this.borrows.findIndex(r => r.id === recordId);
      if (recordIdx !== -1) {
          const record = this.borrows[recordIdx];
          const bookIdx = this.books.findIndex(b => b.id === record.book_id);
          if (bookIdx !== -1) this.books[bookIdx].available_copies += 1;
          this.borrows[recordIdx].return_date = new Date().toISOString();
          this.save();
      }
      return new Promise(resolve => setTimeout(resolve, 300));
  }
}

export const db = new DataService();
