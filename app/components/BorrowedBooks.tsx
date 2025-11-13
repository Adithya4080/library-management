// app/components/BorrowedBooks.tsx

'use client';

import { IBorrowedBook } from '@/types';
import { formatDate } from '@/lib/utils';
import { BookMarked, Calendar, X } from 'lucide-react';

interface BorrowedBooksProps {
  borrowedBooks: IBorrowedBook[];
  onReturnBook: (isbn: string) => void;
}

export default function BorrowedBooks({ borrowedBooks, onReturnBook }: BorrowedBooksProps) {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 sticky top-8">
      <div className="flex items-center space-x-2 mb-6">
        <BookMarked className="h-6 w-6 text-blue-600" />
        <h2 className="text-2xl font-bold text-gray-900">Borrowed Books</h2>
      </div>

      {borrowedBooks.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-gray-400 mb-2">
            <BookMarked className="h-16 w-16 mx-auto opacity-50" />
          </div>
          <p className="text-gray-500">No books borrowed yet</p>
          <p className="text-sm text-gray-400 mt-1">Browse available books to borrow</p>
        </div>
      ) : (
        <div className="space-y-4">
          {borrowedBooks.map((book) => (
            <div
              key={book.isbn}
              className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 transition-colors duration-200"
            >
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-semibold text-gray-900 flex-1 pr-2">{book.title}</h3>
                <button
                  onClick={() => onReturnBook(book.isbn)}
                  className="text-red-500 hover:text-red-700 hover:bg-red-50 p-1 rounded transition-colors duration-200"
                  title="Return book"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <p className="text-sm text-gray-600 mb-3">{book.author}</p>

              <div className="flex items-center space-x-2 text-xs text-gray-500">
                <Calendar className="h-3 w-3" />
                <span>Borrowed on {formatDate(book.borrowedDate)}</span>
              </div>
            </div>
          ))}

          <div className="pt-4 border-t border-gray-200">
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-600">Total borrowed:</span>
              <span className="font-semibold text-gray-900">{borrowedBooks.length}/2 books</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}