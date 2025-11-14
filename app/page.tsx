// // app/page.tsx

// 'use client';

// import { useState, useEffect } from 'react';
// import { IBook, IUser, BORROWING_LIMIT } from '@/types';
// import BookList from './components/BookList';
// import BorrowedBooks from './components/BorrowedBooks';
// import UserSelector from './components/UserSelector';
// import { BookOpen, Users, Library as LibraryIcon } from 'lucide-react';

// export default function Home() {
//   const [books, setBooks] = useState<IBook[]>([]);
//   const [users, setUsers] = useState<IUser[]>([]);
//   const [selectedUserId, setSelectedUserId] = useState<string>('');
//   const [loading, setLoading] = useState(true);
//   const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

//   const selectedUser = users.find(u => u.id === selectedUserId);

//   useEffect(() => {
//     fetchData();
//   }, []);

//   const fetchData = async () => {
//     try {
//       setLoading(true);
//       const [booksRes, usersRes] = await Promise.all([
//         fetch('/api/books'),
//         fetch('/api/users'),
//       ]);

//       const booksData = await booksRes.json();
//       const usersData = await usersRes.json();

//       if (booksData.success) setBooks(booksData.data);
//       if (usersData.success) {
//         setUsers(usersData.data);
//         if (usersData.data.length > 0 && !selectedUserId) {
//           setSelectedUserId(usersData.data[0].id);
//         }
//       }
//     } catch (error) {
//       showMessage('error', 'Failed to load data');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const showMessage = (type: 'success' | 'error', text: string) => {
//     setMessage({ type, text });
//     setTimeout(() => setMessage(null), 3000);
//   };

//   const handleBorrowBook = async (isbn: string) => {
//     if (!selectedUserId) {
//       showMessage('error', 'Please select a user');
//       return;
//     }

//     try {
//       const response = await fetch('/api/borrow', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ userId: selectedUserId, isbn }),
//       });

//       const data = await response.json();

//       if (data.success) {
//         showMessage('success', 'Book borrowed successfully!');
//         await fetchData();
//       } else {
//         showMessage('error', data.error || 'Failed to borrow book');
//       }
//     } catch (error) {
//       showMessage('error', 'Failed to borrow book');
//     }
//   };

//   const handleReturnBook = async (isbn: string) => {
//     if (!selectedUserId) return;

//     try {
//       const response = await fetch('/api/borrow', {
//         method: 'DELETE',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ userId: selectedUserId, isbn }),
//       });

//       const data = await response.json();

//       if (data.success) {
//         showMessage('success', 'Book returned successfully!');
//         await fetchData();
//       } else {
//         showMessage('error', data.error || 'Failed to return book');
//       }
//     } catch (error) {
//       showMessage('error', 'Failed to return book');
//     }
//   };

//   if (loading) {
//     return (
//       <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
//         <div className="text-center">
//           <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto"></div>
//           <p className="mt-4 text-gray-600">Loading library...</p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
//       {/* Header */}
//       <header className="bg-white shadow-md">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
//           <div className="flex items-center justify-between">
//             <div className="flex items-center space-x-3">
//               <LibraryIcon className="h-8 w-8 text-blue-600" />
//               <h1 className="text-3xl font-bold text-gray-900">Library Management</h1>
//             </div>
//             <div className="flex items-center space-x-6">
//               <div className="flex items-center space-x-2">
//                 <BookOpen className="h-5 w-5 text-gray-500" />
//                 <span className="text-sm text-gray-600">
//                   {books.length} Books Available
//                 </span>
//               </div>
//               <div className="flex items-center space-x-2">
//                 <Users className="h-5 w-5 text-gray-500" />
//                 <span className="text-sm text-gray-600">
//                   {users.length} Users
//                 </span>
//               </div>
//             </div>
//           </div>
//         </div>
//       </header>

//       {/* Toast Message */}
//       {message && (
//         <div className="fixed top-4 right-4 z-50 animate-in slide-in-from-top">
//           <div
//             className={`px-6 py-3 rounded-lg shadow-lg ${
//               message.type === 'success'
//                 ? 'bg-green-500 text-white'
//                 : 'bg-red-500 text-white'
//             }`}
//           >
//             {message.text}
//           </div>
//         </div>
//       )}

//       {/* Main Content */}
//       <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
//         {/* User Selector */}
//         <div className="mb-8">
//           <UserSelector
//             users={users}
//             selectedUserId={selectedUserId}
//             onSelectUser={setSelectedUserId}
//           />
//         </div>

//         {/* Info Banner */}
//         {selectedUser && (
//           <div className="mb-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
//             <p className="text-sm text-blue-800">
//               <strong>{selectedUser.name}</strong> has borrowed{' '}
//               <strong>{selectedUser.borrowedBooks.length}/{BORROWING_LIMIT}</strong> books
//             </p>
//           </div>
//         )}

//         <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
//           {/* Available Books */}
//           <div className="lg:col-span-2">
//             <BookList
//               books={books}
//               onBorrowBook={handleBorrowBook}
//               selectedUser={selectedUser}
//             />
//           </div>

//           {/* Borrowed Books */}
//           <div className="lg:col-span-1">
//             <BorrowedBooks
//               borrowedBooks={selectedUser?.borrowedBooks || []}
//               onReturnBook={handleReturnBook}
//             />
//           </div>
//         </div>
//       </main>
//     </div>
//   );
// }

// app/page.tsx

'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/app/context/AuthContext';
import { IBook, IUser, BORROWING_LIMIT } from '@/types';
import BookList from './components/BookList';
import BorrowedBooks from './components/BorrowedBooks';
import { BookOpen, Users, Library as LibraryIcon, LogOut, Shield } from 'lucide-react';

export default function Home() {
  const { user, logout, isLoading: authLoading } = useAuth();
  const router = useRouter();
  const [books, setBooks] = useState<IBook[]>([]);
  const [users, setUsers] = useState<IUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const currentUser = users.find(u => u.id === user?.id);

  useEffect(() => {
    if (authLoading) return;
    
    if (!user) {
      router.push('/login');
      return;
    }
    
    fetchData();
  }, [user, authLoading, router]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [booksRes, usersRes] = await Promise.all([
        fetch('/api/books'),
        fetch('/api/users'),
      ]);

      const booksData = await booksRes.json();
      const usersData = await usersRes.json();

      if (booksData.success) setBooks(booksData.data);
      if (usersData.success) {
        setUsers(usersData.data);
      }
    } catch (error) {
      showMessage('error', 'Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const showMessage = (type: 'success' | 'error', text: string) => {
    setMessage({ type, text });
    setTimeout(() => setMessage(null), 3000);
  };

  const handleBorrowBook = async (isbn: string) => {
    if (!user) {
      showMessage('error', 'Please log in');
      return;
    }

    try {
      const response = await fetch('/api/borrow', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user.id, isbn }),
      });

      const data = await response.json();

      if (data.success) {
        showMessage('success', 'Book borrowed successfully!');
        await fetchData();
      } else {
        showMessage('error', data.error || 'Failed to borrow book');
      }
    } catch (error) {
      showMessage('error', 'Failed to borrow book');
    }
  };

  const handleReturnBook = async (isbn: string) => {
    if (!user) return;

    try {
      const response = await fetch('/api/borrow', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user.id, isbn }),
      });

      const data = await response.json();

      if (data.success) {
        showMessage('success', 'Book returned successfully!');
        await fetchData();
      } else {
        showMessage('error', data.error || 'Failed to return book');
      }
    } catch (error) {
      showMessage('error', 'Failed to return book');
    }
  };

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading library...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <LibraryIcon className="h-8 w-8 text-blue-600" />
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Library Management</h1>
                <p className="text-sm text-gray-600">Welcome, {user?.name}</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-6">
                <div className="flex items-center space-x-2">
                  <BookOpen className="h-5 w-5 text-gray-500" />
                  <span className="text-sm text-gray-600">
                    {books.length} Books Available
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <Users className="h-5 w-5 text-gray-500" />
                  <span className="text-sm text-gray-600">
                    {users.length} Users
                  </span>
                </div>
              </div>
              {user?.role === 'admin' && (
                <button
                  onClick={() => router.push('/admin')}
                  className="flex items-center space-x-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                >
                  <Shield className="h-4 w-4" />
                  <span>Admin Panel</span>
                </button>
              )}
              <button
                onClick={handleLogout}
                className="flex items-center space-x-2 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
              >
                <LogOut className="h-4 w-4" />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Toast Message */}
      {message && (
        <div className="fixed top-4 right-4 z-50 animate-in slide-in-from-top">
          <div
            className={`px-6 py-3 rounded-lg shadow-lg ${
              message.type === 'success'
                ? 'bg-green-500 text-white'
                : 'bg-red-500 text-white'
            }`}
          >
            {message.text}
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Info Banner */}
        {currentUser && (
          <div className="mb-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-sm text-blue-800">
              <strong>{currentUser.name}</strong> has borrowed{' '}
              <strong>{currentUser.borrowedBooks.length}/{BORROWING_LIMIT}</strong> books
            </p>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Available Books */}
          <div className="lg:col-span-2">
            <BookList
              books={books}
              onBorrowBook={handleBorrowBook}
              selectedUser={currentUser}
            />
          </div>

          {/* Borrowed Books */}
          <div className="lg:col-span-1">
            <BorrowedBooks
              borrowedBooks={currentUser?.borrowedBooks || []}
              onReturnBook={handleReturnBook}
            />
          </div>
        </div>
      </main>
    </div>
  );
}