'use client';

import { IBook, IUser } from '@/types';
import BookCard from './BookCard';

interface BookListProps {
  books: IBook[];
  onBorrowBook: (isbn: string) => void;
  selectedUser?: IUser;
}

export default function BookList({ books, onBorrowBook, selectedUser }: BookListProps) {
  if (books.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md p-8 text-center">
        <p className="text-gray-500">No books available in the library</p>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-4">Available Books</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {books.map((book) => (
          <BookCard
            key={book.isbn}
            book={book}
            onBorrow={onBorrowBook}
            selectedUser={selectedUser}
          />
        ))}
      </div>
    </div>
  );
}