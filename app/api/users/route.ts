import { NextResponse } from 'next/server';
import { getLibraryService } from '@/lib/store/LibraryStore';
import { ApiResponse, IUser } from '@/types';

export async function GET() {
  try {
    const libraryService = getLibraryService();
    const users = libraryService.getAllUsers();

    const response: ApiResponse<IUser[]> = {
      success: true,
      data: users,
    };

    return NextResponse.json(response);
  } catch (error) {
    const response: ApiResponse = {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch users',
    };
    return NextResponse.json(response, { status: 500 });
  }
}