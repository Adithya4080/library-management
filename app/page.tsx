'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/app/context/AuthContext';
import { IBook, IUser, BORROWING_LIMIT } from '@/types';
import BookList from './components/BookList';
import BorrowedBooks from './components/BorrowedBooks';
import { BookOpen, Users, Library, LogOut, Shield, Sparkles } from 'lucide-react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function Home() {
  const { user, logout, isLoading: authLoading } = useAuth();
  const router = useRouter();
  const [books, setBooks] = useState<IBook[]>([]);
  const [users, setUsers] = useState<IUser[]>([]);
  const [loading, setLoading] = useState(true);

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
      toast.error('Failed to load data', {
        position: 'top-right',
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleBorrowBook = async (isbn: string) => {
    if (!user) {
      toast.error('Please log in', {
        position: 'top-right',
        autoClose: 3000,
      });
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
        toast.success('Book borrowed successfully!', {
          position: 'top-right',
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
        await fetchData();
      } else {
        toast.error(data.error || 'Failed to borrow book', {
          position: 'top-right',
          autoClose: 3000,
        });
      }
    } catch (error) {
      toast.error('Failed to borrow book', {
        position: 'top-right',
        autoClose: 3000,
      });
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
        toast.success('Book returned successfully!', {
          position: 'top-right',
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
        await fetchData();
      } else {
        toast.error(data.error || 'Failed to return book', {
          position: 'top-right',
          autoClose: 3000,
        });
      }
    } catch (error) {
      toast.error('Failed to return book', {
        position: 'top-right',
        autoClose: 3000,
      });
    }
  };

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
        <div className="text-center">
          <div className="relative">
            <div className="animate-spin rounded-full h-20 w-20 border-4 border-indigo-200 border-t-indigo-600 mx-auto"></div>
            <Library className="h-8 w-8 text-indigo-600 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
          </div>
          <p className="mt-6 text-lg font-medium text-gray-700">Loading your library...</p>
          <p className="mt-2 text-sm text-gray-500">Please wait a moment</p>
        </div>
      </div>
    );
  }

  const borrowedPercentage = currentUser ? (currentUser.borrowedBooks.length / BORROWING_LIMIT) * 100 : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 relative overflow-hidden">
      {/* Toast Container */}
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
        toastClassName="bg-white shadow-2xl rounded-xl border-2"
        className="text-sm font-medium"
        progressClassName="bg-gradient-to-r from-indigo-500 to-purple-500"
      />

      {/* Decorative Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-indigo-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      {/* Color Accent Bars */}
      <div className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 z-50"></div>
      <div className="fixed bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 z-50"></div>

      {/* Header */}
      <header className="relative bg-white/80 backdrop-blur-lg shadow-lg border-b border-purple-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl blur opacity-75"></div>
                <div className="relative bg-gradient-to-br from-indigo-600 to-purple-700 p-3 rounded-2xl shadow-lg">
                  <Library className="h-8 w-8 text-white" />
                </div>
              </div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                  Library Management
                </h1>
                <div className="flex items-center mt-1 space-x-2">
                  <Sparkles className="h-4 w-4 text-purple-500" />
                  <p className="text-sm font-medium text-gray-600">Welcome back, {user?.name}</p>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="hidden md:flex items-center space-x-6 mr-4">
                <div className="flex items-center space-x-2 bg-gradient-to-br from-indigo-50 to-indigo-100 px-4 py-2 rounded-xl border border-indigo-200">
                  <BookOpen className="h-5 w-5 text-indigo-600" />
                  <div>
                    <p className="text-xs text-gray-500 font-medium">Available</p>
                    <p className="text-sm font-bold text-indigo-600">{books.length} Books</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2 bg-gradient-to-br from-purple-50 to-purple-100 px-4 py-2 rounded-xl border border-purple-200">
                  <Users className="h-5 w-5 text-purple-600" />
                  <div>
                    <p className="text-xs text-gray-500 font-medium">Active</p>
                    <p className="text-sm font-bold text-purple-600">{users.length} Users</p>
                  </div>
                </div>
              </div>
              {user?.role === 'admin' && (
                <button
                  onClick={() => router.push('/admin')}
                  className="flex items-center space-x-2 px-5 py-2.5 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl hover:from-purple-700 hover:to-pink-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                >
                  <Shield className="h-4 w-4" />
                  <span className="font-medium">Admin Panel</span>
                </button>
              )}
              <button
                onClick={handleLogout}
                className="flex items-center space-x-2 px-5 py-2.5 bg-white text-gray-700 rounded-xl hover:bg-gray-50 transition-all duration-300 shadow-md hover:shadow-lg border border-gray-200"
              >
                <LogOut className="h-4 w-4" />
                <span className="font-medium">Logout</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content Wrapper */}
      <main className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Content Container with Border */}
        <div className="relative">
          {/* Decorative Corner Elements */}
          <div className="absolute -top-4 -left-4 w-20 h-20 border-t-4 border-l-4 border-indigo-300 rounded-tl-3xl opacity-50"></div>
          <div className="absolute -top-4 -right-4 w-20 h-20 border-t-4 border-r-4 border-purple-300 rounded-tr-3xl opacity-50"></div>
          <div className="absolute -bottom-4 -left-4 w-20 h-20 border-b-4 border-l-4 border-purple-300 rounded-bl-3xl opacity-50"></div>
          <div className="absolute -bottom-4 -right-4 w-20 h-20 border-b-4 border-r-4 border-pink-300 rounded-br-3xl opacity-50"></div>

          {/* User Stats Banner */}
          {currentUser && (
            <div className="mb-8 bg-gradient-to-r from-indigo-500 via-purple-600 to-pink-500 rounded-2xl shadow-2xl overflow-hidden border-4 border-white/30">
              <div className="p-6 relative">
                {/* Background Pattern */}
                <div className="absolute inset-0 opacity-10">
                  <div className="absolute inset-0" style={{
                    backgroundImage: `repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(255,255,255,.05) 10px, rgba(255,255,255,.05) 20px)`
                  }}></div>
                </div>
                
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="text-white text-xl font-bold mb-1 flex items-center space-x-2">
                        <BookOpen className="h-6 w-6" />
                        <span>Your Library Activity</span>
                      </h3>
                      <p className="text-indigo-100 text-sm font-medium">
                        You've borrowed {currentUser.borrowedBooks.length} out of {BORROWING_LIMIT} books
                      </p>
                    </div>
                    <div className="bg-white/20 backdrop-blur-sm px-8 py-4 rounded-2xl border-2 border-white/30">
                      <p className="text-white text-4xl font-bold">{currentUser.borrowedBooks.length}<span className="text-2xl">/{BORROWING_LIMIT}</span></p>
                    </div>
                  </div>
                  <div className="w-full bg-white/20 rounded-full h-4 overflow-hidden backdrop-blur-sm border-2 border-white/30">
                    <div
                      className="bg-gradient-to-r from-white via-pink-200 to-yellow-200 h-full rounded-full transition-all duration-500 shadow-lg relative"
                      style={{ width: `${borrowedPercentage}%` }}
                    >
                      <div className="absolute inset-0 bg-white/30 animate-pulse"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Books Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Available Books */}
            <div className="lg:col-span-2">
              <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 border-2 border-indigo-200/50 shadow-xl">
                <BookList
                  books={books}
                  onBorrowBook={handleBorrowBook}
                  selectedUser={currentUser}
                />
              </div>
            </div>

            {/* Borrowed Books */}
            <div className="lg:col-span-1">
              <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 border-2 border-purple-200/50 shadow-xl sticky top-8">
                <BorrowedBooks
                  borrowedBooks={currentUser?.borrowedBooks || []}
                  onReturnBook={handleReturnBook}
                />
              </div>
            </div>
          </div>
        </div>
      </main>

      <style jsx>{`
        @keyframes blob {
          0% {
            transform: translate(0px, 0px) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
          100% {
            transform: translate(0px, 0px) scale(1);
          }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </div>
  );
}     