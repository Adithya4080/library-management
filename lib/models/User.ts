import { IUser, IBorrowedBook, IBook, BORROWING_LIMIT } from '@/types';

export class User implements IUser {
  id: string;
  name: string;
  email?: string;
  borrowedBooks: IBorrowedBook[];

  constructor(id: string, name: string, email?: string) {
    if (!id || !name) {
      throw new Error('User ID and name are required');
    }

    this.id = id;
    this.name = name;
    this.email = email;
    this.borrowedBooks = [];
  }

  hasReachedBorrowingLimit(): boolean {
    return this.borrowedBooks.length >= BORROWING_LIMIT;
  }

  hasBorrowedBook(isbn: string): boolean {
    return this.borrowedBooks.some(book => book.isbn === isbn);
  }

  borrowBook(book: IBook): void {
    if (this.hasReachedBorrowingLimit()) {
      throw new Error(`Borrowing limit of ${BORROWING_LIMIT} books reached`);
    }

    if (this.hasBorrowedBook(book.isbn)) {
      throw new Error('You have already borrowed this book');
    }

    this.borrowedBooks.push({
      isbn: book.isbn,
      title: book.title,
      author: book.author,
      borrowedDate: new Date().toISOString(),
    });
  }

  returnBook(isbn: string): IBorrowedBook {
    const index = this.borrowedBooks.findIndex(book => book.isbn === isbn);

    if (index === -1) {
      throw new Error('Book not found in borrowed list');
    }

    const [returnedBook] = this.borrowedBooks.splice(index, 1);
    return returnedBook;
  }

  returnAllBooks(): IBorrowedBook[] {
    const returnedBooks = [...this.borrowedBooks];
    this.borrowedBooks = [];
    return returnedBooks;
  }

  getBorrowedBooksCount(): number {
    return this.borrowedBooks.length;
  }

  getBorrowedBooks(): IBorrowedBook[] {
    return [...this.borrowedBooks];
  }

  toJSON(): IUser {
    return {
      id: this.id,
      name: this.name,
      email: this.email,
      borrowedBooks: this.borrowedBooks,
    };
  }
}