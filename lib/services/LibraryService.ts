import { Library } from '../models/Library';
import { User } from '../models/User';
import { IBook, IBorrowedBook, IUser, ILibraryStats, BORROWING_LIMIT } from '@/types';

export class LibraryService {
  private library: Library;
  private users: Map<string, User>;

  constructor(library: Library) {
    this.library = library;
    this.users = new Map();
  }

  registerUser(user: User): void {
    this.users.set(user.id, user);
  }

  getUser(userId: string): User | null {
    return this.users.get(userId) || null;
  }

  getAllUsers(): IUser[] {
    return Array.from(this.users.values()).map(user => user.toJSON());
  }

  viewBooks(): IBook[] {
    return this.library.viewBooks();
  }

  borrowBook(userId: string, isbn: string): void {
    const user = this.getUser(userId);
    if (!user) {
      throw new Error('User not found');
    }

    if (user.hasReachedBorrowingLimit()) {
      throw new Error(`Borrowing limit of ${BORROWING_LIMIT} books reached`);
    }

    if (user.hasBorrowedBook(isbn)) {
      throw new Error('You have already borrowed this book');
    }

    const book = this.library.findBookByISBN(isbn);
    if (!book) {
      throw new Error('Book not found in library');
    }

    if (!book.isAvailable()) {
      throw new Error('Book is not available');
    }

    this.library.borrowBook(isbn);
    user.borrowBook(book);
  }

  returnBook(userId: string, isbn: string): void {
    const user = this.getUser(userId);
    if (!user) {
      throw new Error('User not found');
    }

    const borrowedBook = user.getBorrowedBooks().find(book => book.isbn === isbn);
    if (!borrowedBook) {
      throw new Error('Book not found in borrowed list');
    }

    user.returnBook(isbn);
    this.library.returnBook(borrowedBook.isbn, borrowedBook.title, borrowedBook.author);
  }

  returnAllBooks(userId: string): number {
    const user = this.getUser(userId);
    if (!user) {
      throw new Error('User not found');
    }

    const returnedBooks = user.returnAllBooks();

    returnedBooks.forEach(book => {
      this.library.returnBook(book.isbn, book.title, book.author);
    });

    return returnedBooks.length;
  }

  getUserBorrowedBooks(userId: string): IBorrowedBook[] {
    const user = this.getUser(userId);
    if (!user) {
      throw new Error('User not found');
    }
    return user.getBorrowedBooks();
  }

  getLibraryStats(): ILibraryStats {
    const totalBorrowed = Array.from(this.users.values()).reduce(
      (sum, user) => sum + user.getBorrowedBooksCount(),
      0
    );

    return {
      totalBooks: this.library.getTotalBooks(),
      totalCopies: this.library.getTotalCopies(),
      totalUsers: this.users.size,
      totalBorrowed,
    };
  }
}