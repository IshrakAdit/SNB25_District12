'use client'

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import axios from 'axios';
import Link from 'next/link';
import { v4 as uuidv4 } from 'uuid';

interface UserProfile {
  id: string;
  email: string;
  fullName: string;
  profilePicture?: string;
  score?: number;
  rank?: number;
}

// Modal component for profile editing
function ProfileEditModal({ isOpen, onClose, userData, onSave }: {
  isOpen: boolean;
  onClose: () => void;
  userData: UserProfile | null;
  onSave: (fullName: string, profilePicture: File | null, previewUrl: string) => Promise<void>;
}) {
  const [fullName, setFullName] = useState('');
  const [profilePicture, setProfilePicture] = useState<File | null>(null);
  const [previewImage, setPreviewImage] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);

  // Initialize form with user data when opened
  useEffect(() => {
    if (isOpen && userData) {
      setFullName(userData.fullName);
      setPreviewImage(userData.profilePicture || '');
    }
  }, [isOpen, userData]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setProfilePicture(file);
      
      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => setPreviewImage(e.target?.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async () => {
    try {
      setIsUpdating(true);
      await onSave(fullName, profilePicture, previewImage);
      onClose();
    } catch (error) {
      console.error('Error in modal submit:', error);
    } finally {
      setIsUpdating(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-20 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-800">Update Profile</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label htmlFor="fullName" className="block text-sm font-medium text-gray-700">Full Name</label>
            <input
              type="text"
              id="fullName"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="mt-1 text-gray-800 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700">Profile Picture</label>
            <div className="mt-1 flex items-center space-x-4">
              <div className="w-16 h-16 rounded-full overflow-hidden bg-gray-200">
                {previewImage ? (
                  <img src={previewImage} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <span className="text-xl font-bold">{userData?.fullName?.[0] || 'U'}</span>
                  </div>
                )}
              </div>
              
              <div className="flex-1">
                <label
                  htmlFor="profilePicture"
                  className="cursor-pointer py-2 px-3 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  Choose File
                  <input
                    id="profilePicture"
                    name="profilePicture"
                    type="file"
                    accept="image/*"
                    className="sr-only"
                    onChange={handleImageChange}
                  />
                </label>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="py-2 px-4 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={isUpdating}
            className="py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isUpdating ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function ProfilePage() {
  const [userData, setUserData] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [level, setLevel] = useState(1);
  const [nextLevel, setNextLevel] = useState(0);
  const [progressPercent, setProgressPercent] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        // Get token from localStorage instead of firebase directly
        const idToken = localStorage.getItem('authToken');
        if (!idToken) {
          router.push('/login');
          return;
        }

        // Use axios instead of fetch
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_BACKEND_HOST}/v1/users`,
          {
            headers: {
              'Authorization': `Bearer ${idToken}`,
              'Content-Type': 'application/json',
            },
          }
        );

        // For demo purposes, add score if not present in the API response
        const data = response.data;

        // Calculate level based on score (every 50 points = 1 level)
        const calculatedLevel = Math.floor(data.score / 50) + 1;
        const nextLevelPoints = calculatedLevel * 50;
        const currentLevelPoints = (calculatedLevel - 1) * 50;
        const pointsInCurrentLevel = data.score - currentLevelPoints;
        const pointsNeededForNextLevel = nextLevelPoints - data.score;
        const progressPercentage = (pointsInCurrentLevel / 50) * 100;
        
        setLevel(calculatedLevel);
        setNextLevel(calculatedLevel + 1);
        setProgressPercent(progressPercentage);
        setUserData(data);
      } catch (error) {
        console.error('Error:', error);
        toast.error('Failed to load profile');
        // If token is invalid, redirect to login
        if (axios.isAxiosError(error) && error.response?.status === 401) {
          localStorage.removeItem('authToken');
          router.push('/login');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  // Handle profile update
  const handleProfileUpdate = async (fullName: string, profilePicture: File | null, previewUrl: string) => {
    try {
      // Upload profile picture using API route
      let profileUrl = userData?.profilePicture || '';
      if (profilePicture) {
        const formData = new FormData();
        formData.append('file', profilePicture);
        formData.append('userId', userData?.id || '');

        const response = await fetch('/api/upload-profile-image', {
          method: 'POST',
          body: formData,
        });

        if (!response.ok) {
          throw new Error('Failed to upload profile image');
        }

        const data = await response.json();
        profileUrl = data.url;
      }

      // Update user profile
      const response = await axios.put(
        `${process.env.NEXT_PUBLIC_BACKEND_HOST}/v1/users`,
        {
          fullName,
          profilePicture: profileUrl
        },
        {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
            'Content-Type': 'application/json',
          },
        }
      );

      if (response.status === 204) {
        toast.success('Profile updated successfully');
        // Refresh user data
        const userDataResponse = await axios.get(
          `${process.env.NEXT_PUBLIC_BACKEND_HOST}/v1/users`,
          {
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
              'Content-Type': 'application/json',
            },
          }
        );
        setUserData(userDataResponse.data);
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Failed to update profile');
      throw error; // Re-throw to let the modal handle the error state
    }
  };

  if (!userData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-800">No user data available</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-indigo-50">
      {/* Modal for editing profile */}
      <ProfileEditModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        userData={userData} 
        onSave={handleProfileUpdate} 
      />

      {/* Header */}
      <header className="bg-indigo-600 text-white p-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" viewBox="0 0 20 20" fill="currentColor">
              <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z" />
            </svg>
            <h1 className="text-xl font-bold">LearnHub</h1>
          </div>
          <nav className="flex space-x-6">
            <Link href="#" className="hover:underline">Library</Link>
            <Link href="#" className="hover:underline">Projects</Link>
            <Link href="/leaderboard" className="hover:underline flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M3 6a3 3 0 013-3h10a1 1 0 01.8 1.6L14.25 8l2.55 3.4A1 1 0 0116 13H6a1 1 0 00-1-1V8a1 1 0 011-1h2.5V6H9a1 1 0 01-1-1zm0 0V4a1 1 0 011-1h10a1 1 0 011 1v2H3z" clipRule="evenodd" />
              </svg>
              Leaderboard
            </Link>
            <Link href="#" className="hover:underline flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
              </svg>
              Favorites
            </Link>
            <Link href="#" className="hover:underline">Collection</Link>
          </nav>
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-2">
              <span className="text-sm px-3 py-1 bg-indigo-200 text-indigo-800 rounded-full font-medium">Level {level}</span>
              <span className="text-sm px-3 py-1 bg-indigo-200 text-indigo-800 rounded-full font-medium">{userData?.score || 0} pts</span>
            </div>
            <div className="w-8 h-8 rounded-full bg-white overflow-hidden">
              {userData?.profilePicture ? (
                <img src={userData.profilePicture} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                <div className="flex items-center justify-center h-full text-indigo-600">
                  <span className="font-bold">{userData?.fullName?.[0] || 'U'}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto p-6">
        {/* User Profile Card */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="w-24 h-24 rounded-full overflow-hidden bg-gray-200 mr-6">
                {userData?.profilePicture ? (
                  <img src={userData.profilePicture} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <span className="text-xl font-bold">{userData?.fullName?.[0] || 'U'}</span>
                  </div>
                )}
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-800">{userData?.fullName}</h2>
                <p className="text-gray-600">{userData?.email}</p>
                <div className="mt-2 flex items-center space-x-2">
                  <span className="text-sm px-2 py-1 bg-indigo-100 text-indigo-800 rounded-full">
                    Level {level}
                  </span>
                  <span className="text-sm px-2 py-1 bg-indigo-100 text-indigo-800 rounded-full">
                    {userData?.score || 0} points
                  </span>
                  {userData?.rank && (
                    <span className="text-sm px-2 py-1 bg-indigo-100 text-indigo-800 rounded-full">
                      Rank #{userData.rank}
                    </span>
                  )}
                </div>
              </div>
            </div>
            <button
              onClick={() => setIsModalOpen(true)}
              className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Edit Profile
            </button>
          </div>
          
          <div className="mt-6">
            <div className="flex justify-between text-sm mb-1">
              <span className='text-gray-800'>Level {level}</span>
              <span className='text-gray-800'>Next level: {nextLevel}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div 
                className="bg-indigo-600 h-2.5 rounded-full" 
                style={{ width: `${progressPercent}%` }}
              ></div>
            </div>
            <div className="flex justify-between items-center mt-1">
              <p className="text-xs text-gray-700">+{userData?.score ? userData.score % 50 : 0} points this week</p>
              <Link href="/leaderboard" className="text-xs text-indigo-600 font-medium flex items-center hover:underline">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M3 6a3 3 0 013-3h10a1 1 0 01.8 1.6L14.25 8l2.55 3.4A1 1 0 0116 13H6a1 1 0 00-1-1V8a1 1 0 011-1h2.5V6H9a1 1 0 01-1-1zm0 0V4a1 1 0 011-1h10a1 1 0 011 1v2H3z" clipRule="evenodd" />
                </svg>
                View Leaderboard
              </Link>
            </div>
          </div>
        </div>

        {/* Learning Library */}
        <div>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-gray-800 text-xl font-bold">Your Learning Library</h2>
            <Link href="#" className="text-indigo-600 text-sm hover:underline">View all</Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Course Card 1 */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="h-48 bg-gray-200 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <div className="p-4">
                <h3 className="text-gray-800 font-bold mb-2">Introduction to Web Development</h3>
                <p className="text-sm text-gray-800 line-clamp-2">Web development is the work involved in developing a website for the Internet or an intranet. It can range from developing a simple single static page...</p>
                <div className="flex justify-between items-center mt-4 text-xs text-gray-700">
                  <span>2 questions</span>
                  <span>Audio available</span>
                </div>
              </div>
            </div>

            {/* Course Card 2 */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="h-48 bg-gray-200 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <div className="p-4">
                <h3 className="text-gray-800 font-bold mb-2">Data Science Fundamentals</h3>
                <p className="text-sm text-gray-800 line-clamp-2">Data science is an interdisciplinary field that uses scientific methods, processes, algorithms and systems to extract knowledge and insights from structured and unstructured data.</p>
                <div className="flex justify-between items-center mt-4 text-xs text-gray-700">
                  <span>2 questions</span>
                  <span>Audio available</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
