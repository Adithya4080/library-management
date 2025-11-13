import { NextRequest, NextResponse } from 'next/server';
import { getLibraryService } from '@/lib/store/LibraryStore';
import { ApiResponse, BorrowRequest, ReturnRequest } from '@/types';

// Borrow a book
export async function POST(request: NextRequest) {
  try {
    const body: BorrowRequest = await request.json();
    const { userId, isbn } = body;

    if (!userId || !isbn) {
      const response: ApiResponse = {
        success: false,
        error: 'User ID and ISBN are required',
      };
      return NextResponse.json(response, { status: 400 });
    }

    const libraryService = getLibraryService();
    libraryService.borrowBook(userId, isbn);

    const response: ApiResponse = {
      success: true,
      message: 'Book borrowed successfully',
    };

    return NextResponse.json(response);
  } catch (error) {
    const response: ApiResponse = {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to borrow book',
    };
    return NextResponse.json(response, { status: 400 });
  }
}

// Return a book
export async function DELETE(request: NextRequest) {
  try {
    const body: ReturnRequest = await request.json();
    const { userId, isbn } = body;

    if (!userId || !isbn) {
      const response: ApiResponse = {
        success: false,
        error: 'User ID and ISBN are required',
      };
      return NextResponse.json(response, { status: 400 });
    }

    const libraryService = getLibraryService();
    libraryService.returnBook(userId, isbn);

    const response: ApiResponse = {
      success: true,
      message: 'Book returned successfully',
    };

    return NextResponse.json(response);
  } catch (error) {
    const response: ApiResponse = {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to return book',
    };
    return NextResponse.json(response, { status: 400 });
  }
}