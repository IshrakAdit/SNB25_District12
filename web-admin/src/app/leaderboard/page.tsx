'use client'

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { toast } from 'sonner';
import Link from 'next/link';

interface LeaderboardUser {
  id: string;
  fullName: string;
  profilePicture: string | null;
  score: number;
  rank: number;
  level?: number;
  projects?: number;
}

interface PageInfo {
  size: number;
  number: number;
  totalElements: number;
  totalPages: number;
}

export default function LeaderboardPage() {
  const [leaderboard, setLeaderboard] = useState<LeaderboardUser[]>([]);
  const [currentUser, setCurrentUser] = useState<LeaderboardUser | null>(null);
  const [pageInfo, setPageInfo] = useState<PageInfo>({
    size: 10,
    number: 0,
    totalElements: 0,
    totalPages: 1
  });
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const fetchLeaderboard = async (pageNumber: number) => {
    try {
      setLoading(true);
      const idToken = localStorage.getItem('authToken');
      if (!idToken) {
        router.push('/login');
        return;
      }

      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_BACKEND_HOST}/v1/users/leaderboard`,
        {
          params: {
            page: pageNumber,
            size: 10
          },
          headers: {
            'Authorization': `Bearer ${idToken}`,
            'Content-Type': 'application/json',
          },
        }
      );

      // Process the leaderboard data
      const leaderboardData = response.data.content.map((user: any) => ({
        ...user,
        level: Math.floor(user.score / 50) + 1,
        projects: Math.floor(Math.random() * 15) + 1 // Mock data for projects
      }));
      
      // Update both leaderboard and pagination info
      setLeaderboard(leaderboardData);
      setPageInfo({
        size: response.data.page.size,
        number: response.data.page.number,
        totalElements: response.data.page.totalElements,
        totalPages: response.data.page.totalPages
      });
      
      // Find current user in leaderboard or fetch separately
      const userData = localStorage.getItem('userData');
      if (userData) {
        const parsedUserData = JSON.parse(userData);
        const userInLeaderboard = leaderboardData.find((user: LeaderboardUser) => user.id === parsedUserData.id);
        
        if (userInLeaderboard) {
          setCurrentUser(userInLeaderboard);
        } else {
          // Mock current user data if not in leaderboard
          setCurrentUser({
            id: parsedUserData.id,
            fullName: parsedUserData.fullName,
            profilePicture: parsedUserData.profilePicture,
            score: parsedUserData.score || 840,
            rank: 5,
            level: Math.floor((parsedUserData.score || 840) / 50) + 1,
            projects: 8
          });
        }
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error('Failed to load leaderboard');
      if (axios.isAxiosError(error) && error.response?.status === 401) {
        localStorage.removeItem('authToken');
        router.push('/login');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeaderboard(0);
  }, []);

  const handlePageChange = (newPage: number) => {
    if (newPage >= 0 && newPage < pageInfo.totalPages) {
      fetchLeaderboard(newPage);
    }
  };

  if (loading && leaderboard.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-indigo-50">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-indigo-50">
      {/* Header */}
      <header className="bg-indigo-600 text-white p-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <Link href="/profile" className="flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" viewBox="0 0 20 20" fill="currentColor">
                <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z" />
              </svg>
              <h1 className="text-xl font-bold ml-2">LearnHub</h1>
            </Link>
          </div>
          <nav className="flex space-x-6">
            <Link href="/profile" className="hover:underline">Library</Link>
            <Link href="/profile" className="hover:underline">Projects</Link>
            <Link href="/leaderboard" className="hover:underline flex items-center font-semibold">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M3 6a3 3 0 013-3h10a1 1 0 01.8 1.6L14.25 8l2.55 3.4A1 1 0 0116 13H6a1 1 0 00-1-1V8a1 1 0 011-1h2.5V6H9a1 1 0 01-1-1zm0 0V4a1 1 0 011-1h10a1 1 0 011 1v2H3z" clipRule="evenodd" />
              </svg>
              Leaderboard
            </Link>
            <Link href="/profile" className="hover:underline flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
              </svg>
              Favorites
            </Link>
            <Link href="/profile" className="hover:underline">Collection</Link>
          </nav>
          <div className="flex items-center space-x-3">
            <div className="px-3 py-1 bg-indigo-200 text-indigo-800 rounded-full text-sm font-medium">
              Level {currentUser?.level || 5} · {currentUser?.score || 840} pts
            </div>
            <div className="w-8 h-8 rounded-full bg-white overflow-hidden">
              {currentUser?.profilePicture ? (
                <img src={currentUser.profilePicture} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                <div className="flex items-center justify-center h-full text-indigo-600">
                  <span className="font-bold">{currentUser?.fullName?.[0] || 'U'}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto p-6">
        <div className="text-center mb-4">
          <h1 className="text-2xl font-bold text-indigo-800">Leaderboard</h1>
          <p className="text-gray-600">Contribute to projects to earn points and level up</p>
        </div>
        
        {/* Current User Card */}
        {currentUser && (
          <div className="bg-yellow-50 border border-yellow-100 rounded-lg p-6 mb-8">
            <div className="flex items-center">
              <div className="flex-shrink-0 mr-4">
                {currentUser.profilePicture ? (
                  <img src={currentUser.profilePicture} alt={currentUser.fullName} className="h-16 w-16 rounded-full" />
                ) : (
                  <div className="h-16 w-16 rounded-full bg-indigo-100 flex items-center justify-center">
                    <span className="text-indigo-600 text-xl font-medium">
                      {currentUser.fullName?.[0]?.toUpperCase() || 'U'}
                    </span>
                  </div>
                )}
              </div>
              <div>
                <div className="flex items-center">
                  <h2 className="text-lg font-bold text-gray-800 ">{currentUser.fullName}</h2>
                  <span className="ml-2 text-sm text-gray-600">Level {currentUser.level} Contributor</span>
                </div>
                
                <div className="mt-2">
                  <p className="text-sm font-medium text-gray-800">Current Score: {currentUser.score}</p>
                  <div className="w-full bg-gray-200 rounded-full h-2.5 mt-1 mb-1">
                    <div 
                      className="bg-indigo-600 h-2.5 rounded-full" 
                      style={{ width: `${(currentUser.score % 50) * 2}%` }}
                    ></div>
                  </div>
                  <div className="flex justify-between text-xs text-gray-600">
                    <span>Next Level: {(currentUser.level || 1) + 1}</span>
                    <span>{50 - ((currentUser.score || 0) % 50)} points to next level</span>
                  </div>
                </div>
              </div>
              <div className="ml-auto">
                <div className="flex items-center text-yellow-600">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                  <span className="font-bold">+{currentUser.score % 50} this week</span>
                </div>
                <span className="text-sm text-gray-600 block text-right">{currentUser.projects} projects</span>
              </div>
            </div>
          </div>
        )}
        
        {/* Top Contributors */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden mb-8">
          <div className="p-4 border-b border-gray-200 flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-yellow-500 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
            <h2 className="text-lg font-bold text-gray-800">Top Contributors</h2>
          </div>
          
          {leaderboard.length === 0 ? (
            <div className="p-8 text-center">
              <p className="text-gray-500">No leaderboard data available</p>
            </div>
          ) : (
            <>
              <div className="divide-y divide-gray-200">
                {leaderboard.map((user) => (
                  <div key={user.id} className="flex items-center p-4 hover:bg-gray-50">
                    <div className="flex-shrink-0 w-8 flex justify-center">
                      <span className="text-lg font-bold text-gray-800">{user.rank}</span>
                    </div>
                    <div className="ml-4 flex items-center">
                      {user.profilePicture ? (
                        <img 
                          src={user.profilePicture} 
                          alt={user.fullName} 
                          className="h-10 w-10 rounded-full"
                        />
                      ) : (
                        <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center">
                          <span className="text-indigo-600 font-medium">
                            {user.fullName?.[0]?.toUpperCase() || 'U'}
                          </span>
                        </div>
                      )}
                      <div className="ml-3">
                        <div className="flex items-center">
                          <p className="text-sm font-medium text-gray-900">{user.fullName}</p>
                          {user.rank <= 3 && (
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1 text-yellow-500" viewBox="0 0 20 20" fill="currentColor">
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                          )}
                        </div>
                        <div className="flex items-center text-sm text-gray-500">
                          <span>Level {user.level}</span>
                        </div>
                      </div>
                    </div>
                    <div className="ml-auto text-right">
                      <span className="text-sm font-bold text-gray-900">{user.score} pts</span>
                      <span className="block text-xs text-gray-500">{user.projects} projects</span>
                    </div>
                  </div>
                ))}
              </div>
              
              {/* Pagination */}
              {pageInfo.totalPages > 1 && (
                <div className="bg-gray-50 px-6 py-3 flex items-center justify-between border-t border-gray-200">
                  <div className="flex-1 flex justify-between sm:hidden">
                    <button
                      onClick={() => handlePageChange(pageInfo.number - 1)}
                      disabled={pageInfo.number === 0}
                      className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
                    >
                      Previous
                    </button>
                    <button
                      onClick={() => handlePageChange(pageInfo.number + 1)}
                      disabled={pageInfo.number === pageInfo.totalPages - 1}
                      className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
                    >
                      Next
                    </button>
                  </div>
                  <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                    <div>
                      <p className="text-sm text-gray-700">
                        Showing <span className="font-medium">{pageInfo.number * pageInfo.size + 1}</span> to{' '}
                        <span className="font-medium">
                          {Math.min((pageInfo.number + 1) * pageInfo.size, pageInfo.totalElements)}
                        </span>{' '}
                        of <span className="font-medium">{pageInfo.totalElements}</span> results
                      </p>
                    </div>
                    <div>
                      <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                        <button
                          onClick={() => handlePageChange(pageInfo.number - 1)}
                          disabled={pageInfo.number === 0}
                          className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                        >
                          <span className="sr-only">Previous</span>
                          <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                            <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        </button>
                        {Array.from({ length: Math.min(5, pageInfo.totalPages) }, (_, i) => {
                          let pageNum;
                          if (pageInfo.totalPages <= 5) {
                            pageNum = i;
                          } else if (pageInfo.number < 3) {
                            pageNum = i;
                          } else if (pageInfo.number > pageInfo.totalPages - 4) {
                            pageNum = pageInfo.totalPages - 5 + i;
                          } else {
                            pageNum = pageInfo.number - 2 + i;
                          }
                          
                          return (
                            <button
                              key={pageNum}
                              onClick={() => handlePageChange(pageNum)}
                              className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                                pageNum === pageInfo.number
                                  ? 'bg-indigo-50 border-indigo-500 text-indigo-600 z-10'
                                  : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                              }`}
                            >
                              {pageNum + 1}
                            </button>
                          );
                        })}
                        <button
                          onClick={() => handlePageChange(pageInfo.number + 1)}
                          disabled={pageInfo.number === pageInfo.totalPages - 1}
                          className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                        >
                          <span className="sr-only">Next</span>
                          <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                            <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                          </svg>
                        </button>
                      </nav>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </main>
    </div>
  );
}
