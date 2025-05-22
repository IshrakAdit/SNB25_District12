'use client'

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import axios from 'axios';
import Link from 'next/link';
import { v4 as uuidv4 } from 'uuid';
import Image from 'next/image';

interface UserProfile {
  id: string;
  email: string;
  fullName: string;
  profilePicture?: string;
  score?: number;
  rank?: number;
}

interface Content {
  id: string;
  topicId: string;
  title: string;
  voteByUser: string | null;
  authorId: string;
  authorName: string;
  authorProfilePicture: string;
  coverPhoto: string;
  summary: string;
  upvoteCount: number;
  createdAt: string;
}

interface PaginatedResponse {
  content: Content[];
  page: {
    size: number;
    number: number;
    totalElements: number;
    totalPages: number;
  };
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

// Tutor Invitation Modal Component
function TutorInviteModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [email, setEmail] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [emailError, setEmailError] = useState('');

  const validateEmail = (email: string) => {
    const re = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return re.test(email);
  };

  const handleSubmit = async () => {
    // Validate email
    if (!email.trim()) {
      setEmailError('Email is required');
      return;
    }

    if (!validateEmail(email)) {
      setEmailError('Please enter a valid email address');
      return;
    }

    setEmailError('');
    setIsSending(true);

    try {
      const response = await fetch('/api/send-tutor-invite', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          senderName: localStorage.getItem('userName') || undefined,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success('Invitation sent successfully!');
        setEmail('');
        onClose();
      } else {
        toast.error(data.error || 'Failed to send invitation');
      }
    } catch (error) {
      console.error('Error sending invitation:', error);
      toast.error('Failed to send invitation. Please try again.');
    } finally {
      setIsSending(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-800">Invite a Tutor</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="mb-4">
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
          <input
            type="email"
            id="email"
            className={`w-full px-3 py-2 border ${emailError ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500`}
            placeholder="Enter tutor's email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          {emailError && <p className="mt-1 text-sm text-red-600">{emailError}</p>}
        </div>

        <div className="mt-6 flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            disabled={isSending}
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={isSending}
            className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSending ? 'Sending...' : 'Send Invitation'}
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
  const [contents, setContents] = useState<Content[]>([]);
  const [contentLoading, setContentLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteContentId, setDeleteContentId] = useState<string | null>(null);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem('authToken');
        if (!token) {
          // Clear any potentially corrupted auth state
          localStorage.clear();
          router.push('/login');
          return;
        }

        // Use axios instead of fetch
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_BACKEND_HOST}/v1/users`,
          {
            headers: {
              'Authorization': `Bearer ${token}`,
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
        
        // Store user ID and name in localStorage for authorization checks elsewhere
        localStorage.setItem('userId', data.id);
        localStorage.setItem('userName', data.fullName);

        // After user data is loaded, fetch their content
        fetchUserContents(data.id);
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

    checkAuth();
  }, [router]);

  const fetchUserContents = async (userId: string) => {
    try {
      setContentLoading(true);
      const idToken = localStorage.getItem('authToken');
      if (!idToken) {
        router.push('/login');
        return;
      }

      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_BACKEND_HOST}/v1/contents?authorId=${userId}&page=${currentPage}&size=${pageSize}`,
        {
          headers: {
            'Authorization': `Bearer ${idToken}`,
            'Content-Type': 'application/json',
          },
        }
      );

      const data = response.data as PaginatedResponse;
      setContents(data.content);
      setTotalPages(data.page.totalPages);
    } catch (error) {
      console.error('Error fetching user contents:', error);
      toast.error('Failed to load content');
    } finally {
      setContentLoading(false);
    }
  };

  const handlePageChange = (newPage: number) => {
    if (newPage >= 0 && newPage < totalPages && userData) {
      setCurrentPage(newPage);
      fetchUserContents(userData.id);
    }
  };

  const handleDeleteContent = async (contentId: string) => {
    try {
      setIsDeleting(true);
      const idToken = localStorage.getItem('authToken');
      if (!idToken) {
        router.push('/login');
        return;
      }

      const response = await axios.delete(
        `${process.env.NEXT_PUBLIC_BACKEND_HOST}/v1/contents/${contentId}`,
        {
          headers: {
            'Authorization': `Bearer ${idToken}`,
            'Content-Type': 'application/json',
          },
        }
      );

      if (response.status === 204) {
        toast.success('Content deleted successfully');
        // Refresh content list
        if (userData) {
          fetchUserContents(userData.id);
        }
      }
    } catch (error) {
      console.error('Error deleting content:', error);
      toast.error('Failed to delete content');
    } finally {
      setIsDeleting(false);
      setDeleteContentId(null);
    }
  };

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
      
      {/* Modal for inviting tutors */}
      <TutorInviteModal
        isOpen={showInviteModal}
        onClose={() => setShowInviteModal(false)}
      />

      {/* Confirmation modal for deleting content */}
      {deleteContentId && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Delete Content</h2>
            <p className="text-gray-700 mb-6">Are you sure you want to delete this content? This action cannot be undone.</p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setDeleteContentId(null)}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                disabled={isDeleting}
              >
                Cancel
              </button>
              <button
                onClick={() => deleteContentId && handleDeleteContent(deleteContentId)}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                disabled={isDeleting}
              >
                {isDeleting ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}

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
            <Link href="/projects" className="hover:underline">Projects</Link>
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
            <div className="flex space-x-3">
              <button
                onClick={() => setShowInviteModal(true)}
                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 flex items-center"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                Invite Tutor
              </button>
              <button
                onClick={() => setIsModalOpen(true)}
                className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Edit Profile
              </button>
            </div>
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

        {/* User Content */}
        <div>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-gray-800 text-xl font-bold">Your Content</h2>
            <Link 
              href="/content/create" 
              className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Create Content
            </Link>
          </div>
          
          {contentLoading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
            </div>
          ) : contents.length === 0 ? (
            <div className="bg-white rounded-lg shadow-md p-8 text-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-gray-400 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
              <h3 className="text-xl font-bold text-gray-800 mb-2">No content yet</h3>
              <p className="text-gray-600 mb-6">You haven't created any content yet. Start sharing your knowledge!</p>
              <Link 
                href="/content/create" 
                className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Create Your First Content
              </Link>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {contents.map((content) => (
                  <div key={content.id} className="bg-white rounded-lg shadow-md overflow-hidden relative group">
                    <div 
                      className="h-48 bg-gray-200 relative cursor-pointer" 
                      onClick={() => router.push(`/content/${content.id}`)}
                    >
                      {content.coverPhoto ? (
                        <img 
                          src={content.coverPhoto} 
                          alt={content.title} 
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="flex items-center justify-center h-full">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                        </div>
                      )}
                      
                      {/* Delete button - only shown for content owned by the current user */}
                      {userData && content.authorId === userData.id && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setDeleteContentId(content.id);
                          }}
                          className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 z-10"
                          aria-label="Delete content"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      )}
                    </div>
                    <div className="p-4 cursor-pointer" onClick={() => router.push(`/content/${content.id}`)}>
                      <h3 className="text-gray-800 font-bold mb-2 line-clamp-1">{content.title}</h3>
                      <p className="text-sm text-gray-800 line-clamp-2">{content.summary}</p>
                      <div className="flex justify-between items-center mt-4 text-xs text-gray-700">
                        <span className="flex items-center">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
                          </svg>
                          {content.upvoteCount}
                        </span>
                        <span>{new Date(content.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex justify-center mt-8">
                  <nav className="flex items-center space-x-2">
                    <button
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 0}
                      className="px-3 py-1 rounded-md bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Previous
                    </button>
                    {Array.from({ length: totalPages }, (_, i) => (
                      <button
                        key={i}
                        onClick={() => handlePageChange(i)}
                        className={`px-3 py-1 rounded-md ${currentPage === i ? 'bg-indigo-600 text-white' : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'}`}
                      >
                        {i + 1}
                      </button>
                    ))}
                    <button
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === totalPages - 1}
                      className="px-3 py-1 rounded-md bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Next
                    </button>
                  </nav>
                </div>
              )}
            </>
          )}
        </div>
      </main>
    </div>
  );
}
