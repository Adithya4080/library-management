import { NextRequest, NextResponse } from 'next/server';
import { getLibraryService } from '@/lib/store/LibraryStore';
import { Book } from '@/lib/models/Book';
import { ApiResponse } from '@/types';

// Add a new book (Admin only)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { isbn, title, author, availableCopies } = body;

    if (!isbn || !title || !author) {
      const response: ApiResponse = {
        success: false,
        error: 'ISBN, title, and author are required',
      };
      return NextResponse.json(response, { status: 400 });
    }

    const libraryService = getLibraryService();
    const library = (libraryService as any).library;

    // Check if book already exists
    const existingBook = library.findBookByISBN(isbn);
    if (existingBook) {
      const response: ApiResponse = {
        success: false,
        error: 'Book with this ISBN already exists',
      };
      return NextResponse.json(response, { status: 400 });
    }

    const newBook = new Book(isbn, title, author, availableCopies || 1);
    library.addBook(newBook);

    const response: ApiResponse = {
      success: true,
      message: 'Book added successfully',
      data: newBook.toJSON(),
    };

    return NextResponse.json(response);
  } catch (error) {
    const response: ApiResponse = {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to add book',
    };
    return NextResponse.json(response, { status: 500 });
  }
}

// Delete a book (Admin only)
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const isbn = searchParams.get('isbn');

    if (!isbn) {
      const response: ApiResponse = {
        success: false,
        error: 'ISBN is required',
      };
      return NextResponse.json(response, { status: 400 });
    }

    const libraryService = getLibraryService();
    const library = (libraryService as any).library;

    const book = library.findBookByISBN(isbn);
    if (!book) {
      const response: ApiResponse = {
        success: false,
        error: 'Book not found',
      };
      return NextResponse.json(response, { status: 404 });
    }

    // Delete the book from the library
    (library as any).books.delete(isbn);

    const response: ApiResponse = {
      success: true,
      message: 'Book deleted successfully',
    };

    return NextResponse.json(response);
  } catch (error) {
    const response: ApiResponse = {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to delete book',
    };
    return NextResponse.json(response, { status: 500 });
  }
}

// Update a book (Admin only)
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { isbn, title, author, availableCopies } = body;

    if (!isbn) {
      const response: ApiResponse = {
        success: false,
        error: 'ISBN is required',
      };
      return NextResponse.json(response, { status: 400 });
    }

    const libraryService = getLibraryService();
    const library = (libraryService as any).library;

    const book = library.findBookByISBN(isbn);
    if (!book) {
      const response: ApiResponse = {
        success: false,
        error: 'Book not found',
      };
      return NextResponse.json(response, { status: 404 });
    }

    // Update book details
    if (title) book.title = title;
    if (author) book.author = author;
    if (availableCopies !== undefined) book.availableCopies = availableCopies;

    const response: ApiResponse = {
      success: true,
      message: 'Book updated successfully',
      data: book.toJSON(),
    };

    return NextResponse.json(response);
  } catch (error) {
    const response: ApiResponse = {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to update book',
    };
    return NextResponse.json(response, { status: 500 });
  }
}