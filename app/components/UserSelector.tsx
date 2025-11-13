'use client';

import { IUser } from '@/types';
import { User } from 'lucide-react';

interface UserSelectorProps {
  users: IUser[];
  selectedUserId: string;
  onSelectUser: (userId: string) => void;
}

export default function UserSelector({ users, selectedUserId, onSelectUser }: UserSelectorProps) {
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center space-x-3 mb-4">
        <User className="h-5 w-5 text-blue-600" />
        <label htmlFor="user-select" className="text-lg font-semibold text-gray-900">
          Select User
        </label>
      </div>

      <select
        id="user-select"
        value={selectedUserId}
        onChange={(e) => onSelectUser(e.target.value)}
        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white text-gray-900"
      >
        {users.map((user) => (
          <option key={user.id} value={user.id}>
            {user.name} ({user.email}) - {user.borrowedBooks.length}/2 books
          </option>
        ))}
      </select>
    </div>
  );
}