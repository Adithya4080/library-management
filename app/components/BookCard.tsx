'use client';

import { IBook, IUser, BORROWING_LIMIT } from '@/types';
import { BookOpen, Copy } from 'lucide-react';

interface BookCardProps {
  book: IBook;
  onBorrow: (isbn: string) => void;
  selectedUser?: IUser;
}

export default function BookCard({ book, onBorrow, selectedUser }: BookCardProps) {
  const canBorrow = selectedUser
    ? selectedUser.borrowedBooks.length < BORROWING_LIMIT &&
      !selectedUser.borrowedBooks.some(b => b.isbn === book.isbn)
    : false;

  const alreadyBorrowed = selectedUser?.borrowedBooks.some(b => b.isbn === book.isbn) || false;

  const getButtonState = () => {
    if (!selectedUser) return { disabled: true, text: 'Select a user' };
    if (alreadyBorrowed) return { disabled: true, text: 'Already borrowed' };
    if (selectedUser.borrowedBooks.length >= BORROWING_LIMIT)
      return { disabled: true, text: 'Limit reached' };
    return { disabled: false, text: 'Borrow' };
  };

  const buttonState = getButtonState();

  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 p-6">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-blue-100 rounded-lg">
            <BookOpen className="h-6 w-6 text-blue-600" />
          </div>
          <div className="flex items-center space-x-2 text-sm text-gray-500">
            <Copy className="h-4 w-4" />
            <span>{book.availableCopies} available</span>
          </div>
        </div>
      </div>

      <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
        {book.title}
      </h3>
      <p className="text-sm text-gray-600 mb-4">by {book.author}</p>
      <p className="text-xs text-gray-400 mb-4 font-mono">ISBN: {book.isbn}</p>

      <button
        onClick={() => onBorrow(book.isbn)}
        disabled={buttonState.disabled}
        className={`w-full py-2 px-4 rounded-md font-medium transition-colors duration-200 ${
          buttonState.disabled
            ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
            : 'bg-blue-600 text-white hover:bg-blue-700 active:bg-blue-800'
        }`}
      >
        {buttonState.text}
      </button>
    </div>
  );
}