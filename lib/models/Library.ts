import { Book } from './Book';
import { IBook } from '@/types';

export class Library {
  private books: Map<string, Book>;

  constructor() {
    this.books = new Map();
  }

  addBook(book: Book): void {
    if (this.books.has(book.isbn)) {
      const existingBook = this.books.get(book.isbn)!;
      existingBook.availableCopies += book.availableCopies;
    } else {
      this.books.set(book.isbn, book);
    }
  }

  viewBooks(): IBook[] {
    return Array.from(this.books.values()).map(book => book.toJSON());
  }

  isEmpty(): boolean {
    return this.books.size === 0;
  }

  findBookByISBN(isbn: string): Book | null {
    return this.books.get(isbn) || null;
  }

  isBookAvailable(isbn: string): boolean {
    const book = this.findBookByISBN(isbn);
    return book ? book.isAvailable() : false;
  }

  borrowBook(isbn: string): void {
    const book = this.findBookByISBN(isbn);

    if (!book) {
      throw new Error('Book not found in library');
    }

    if (!book.isAvailable()) {
      throw new Error('Book is not available');
    }

    book.decrementCopies();

    if (book.availableCopies === 0) {
      this.books.delete(isbn);
    }
  }

  returnBook(isbn: string, title: string, author: string): void {
    const book = this.findBookByISBN(isbn);

    if (book) {
      book.incrementCopies();
    } else {
      const returnedBook = new Book(isbn, title, author, 1);
      this.books.set(isbn, returnedBook);
    }
  }

  getTotalBooks(): number {
    return this.books.size;
  }

  getTotalCopies(): number {
    return Array.from(this.books.values()).reduce(
      (sum, book) => sum + book.availableCopies,
      0
    );
  }
}