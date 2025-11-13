import { NextResponse } from 'next/server';
import { getLibraryService } from '@/lib/store/LibraryStore';
import { ApiResponse, IBook } from '@/types';

export async function GET() {
  try {
    const libraryService = getLibraryService();
    const books = libraryService.viewBooks();

    const response: ApiResponse<IBook[]> = {
      success: true,
      data: books,
    };

    return NextResponse.json(response);
  } catch (error) {
    const response: ApiResponse = {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch books',
    };
    return NextResponse.json(response, { status: 500 });
  }
}