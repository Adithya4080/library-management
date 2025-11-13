import { IBook } from '@/types';

export class Book implements IBook {
  isbn: string;
  title: string;
  author: string;
  availableCopies: number;

  constructor(isbn: string, title: string, author: string, availableCopies: number = 1) {
    if (!isbn || !title || !author) {
      throw new Error('ISBN, title, and author are required');
    }

    if (availableCopies < 0) {
      throw new Error('Available copies cannot be negative');
    }

    this.isbn = isbn;
    this.title = title;
    this.author = author;
    this.availableCopies = availableCopies;
  }

  isAvailable(): boolean {
    return this.availableCopies > 0;
  }

  decrementCopies(): void {
    if (this.availableCopies <= 0) {
      throw new Error('No copies available to borrow');
    }
    this.availableCopies--;
  }

  incrementCopies(): void {
    this.availableCopies++;
  }

  toJSON(): IBook {
    return {
      isbn: this.isbn,
      title: this.title,
      author: this.author,
      availableCopies: this.availableCopies,
    };
  }
}