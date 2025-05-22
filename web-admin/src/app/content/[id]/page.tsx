'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { toast } from 'sonner';
import axios from 'axios';
import Link from 'next/link';
import { restoreMarkdownImages } from '@/utils/markdownParser';
import ReactMarkdown from 'react-markdown';

interface ContentDetail {
  id: string;
  topicId: string;
  title: string;
  body: string;
  voteByUser: string | null;
  authorId: string;
  authorName: string;
  authorProfilePicture: string;
  coverPhoto: string;
  summary: string;
  upvoteCount: number;
  createdAt: string;
}

interface ImageInfo {
  src: string;
  alt?: string;
  width?: number;
  height?: number;
}

interface ContentBody {
  article: string;
  images: ImageInfo[];
}

export default function ContentDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [content, setContent] = useState<ContentDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [parsedContent, setParsedContent] = useState('');
  const [isUpvoting, setIsUpvoting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  useEffect(() => {
    fetchContentDetail();
  }, []);

  const fetchContentDetail = async () => {
    try {
      setLoading(true);
      const idToken = localStorage.getItem('authToken');
      if (!idToken) {
        router.push('/login');
        return;
      }

      const contentId = params.id;
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_BACKEND_HOST}/v1/contents/${contentId}`,
        {
          headers: {
            'Authorization': `Bearer ${idToken}`,
            'Content-Type': 'application/json',
          },
        }
      );

      const contentData = response.data as ContentDetail;
      setContent(contentData);

      // Parse the body JSON string to get article and images
      try {
        const bodyData = JSON.parse(contentData.body) as ContentBody;
        const restoredMarkdown = restoreMarkdownImages(bodyData.article, bodyData.images);
        setParsedContent(restoredMarkdown);
      } catch (error) {
        console.error('Error parsing content body:', error);
        setParsedContent('Error loading content. Please try again later.');
      }
    } catch (error) {
      console.error('Error fetching content detail:', error);
      toast.error('Failed to load content');
    } finally {
      setLoading(false);
    }
  };

  const handleUpvote = async () => {
    if (!content || isUpvoting) return;

    try {
      setIsUpvoting(true);
      const idToken = localStorage.getItem('authToken');
      if (!idToken) {
        router.push('/login');
        return;
      }

      await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_HOST}/v1/contents/${content.id}/upvote`,
        {},
        {
          headers: {
            'Authorization': `Bearer ${idToken}`,
            'Content-Type': 'application/json',
          },
        }
      );

      // Refresh content to get updated upvote count
      fetchContentDetail();
      toast.success('Content upvoted!');
    } catch (error) {
      console.error('Error upvoting content:', error);
      toast.error('Failed to upvote content');
    } finally {
      setIsUpvoting(false);
    }
  };

  const handleDeleteContent = async () => {
    if (!content || isDeleting) return;

    try {
      setIsDeleting(true);
      const idToken = localStorage.getItem('authToken');
      if (!idToken) {
        router.push('/login');
        return;
      }

      const response = await axios.delete(
        `${process.env.NEXT_PUBLIC_BACKEND_HOST}/v1/contents/${content.id}`,
        {
          headers: {
            'Authorization': `Bearer ${idToken}`,
            'Content-Type': 'application/json',
          },
        }
      );

      if (response.status === 204) {
        toast.success('Content deleted successfully');
        // Redirect to profile page
        router.push('/profile');
      }
    } catch (error) {
      console.error('Error deleting content:', error);
      toast.error('Failed to delete content');
      setIsDeleting(false);
      setShowDeleteConfirm(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-indigo-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (!content) {
    return (
      <div className="min-h-screen bg-indigo-50 flex items-center justify-center">
        <div className="bg-white rounded-lg shadow-md p-8 text-center max-w-md">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-red-500 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Content Not Found</h2>
          <p className="text-gray-600 mb-6">The content you're looking for doesn't exist or has been removed.</p>
          <Link href="/" className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
            Go Back Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-indigo-50">
      {/* Delete confirmation modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Delete Content</h2>
            <p className="text-gray-700 mb-6">Are you sure you want to delete this content? This action cannot be undone.</p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                disabled={isDeleting}
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteContent}
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
            <Link href="/" className="text-xl font-bold">LearnHub</Link>
          </div>
          <nav className="flex space-x-6">
            <Link href="/" className="hover:underline">Home</Link>
            <Link href="/profile" className="hover:underline">Profile</Link>
            <Link href="/leaderboard" className="hover:underline">Leaderboard</Link>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto p-6">
        {/* Cover Image */}
        {content.coverPhoto && (
          <div className="mb-8 rounded-lg overflow-hidden shadow-md h-64 relative">
            <img 
              src={content.coverPhoto} 
              alt={content.title} 
              className="w-full h-full object-cover"
            />
          </div>
        )}

        {/* Content Header */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="mb-6">
            <div className="flex justify-between items-start mb-2">
              <h1 className="text-3xl font-bold text-gray-800">{content.title}</h1>
              
              {/* Delete button - only shown for content owned by the current user */}
              {content.authorId === localStorage.getItem('userId') && (
                <button
                  onClick={() => setShowDeleteConfirm(true)}
                  className="p-2 text-red-600 hover:text-red-800 focus:outline-none"
                  aria-label="Delete content"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              )}
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-full overflow-hidden mr-3">
                    {content.authorProfilePicture ? (
                      <img 
                        src={content.authorProfilePicture} 
                        alt={content.authorName} 
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold">
                        {content.authorName[0]}
                      </div>
                    )}
                  </div>
                  <div>
                    <p className="font-medium text-gray-800">{content.authorName}</p>
                    <p className="text-sm text-gray-500">{formatDate(content.createdAt)}</p>
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <button 
                  onClick={handleUpvote}
                  disabled={isUpvoting || content.voteByUser !== null}
                  className={`flex items-center space-x-1 px-3 py-1 rounded-full ${
                    content.voteByUser !== null 
                      ? 'bg-indigo-100 text-indigo-600' 
                      : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M2 10.5a1.5 1.5 0 113 0v6a1.5 1.5 0 01-3 0v-6zM6 10.333v5.43a2 2 0 001.106 1.79l.05.025A4 4 0 008.943 18h5.416a2 2 0 001.962-1.608l1.2-6A2 2 0 0015.56 8H12V4a2 2 0 00-2-2 1 1 0 00-1 1v.667a4 4 0 01-.8 2.4L6.8 7.933a4 4 0 00-.8 2.4z" />
                  </svg>
                  <span>{content.upvoteCount}</span>
                </button>
                <span className="text-sm text-gray-500">Topic: {content.topicId}</span>
              </div>
            </div>
          </div>

          {/* Summary */}
          <div className="mb-6 p-4 bg-gray-50 rounded-md">
            <h2 className="text-lg font-semibold text-gray-800 mb-2">Summary</h2>
            <p className="text-gray-700">{content.summary}</p>
          </div>
        </div>

        {/* Content Body */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="prose max-w-none">
            <ReactMarkdown>
              {parsedContent}
            </ReactMarkdown>
          </div>
        </div>
      </main>
    </div>
  );
}
