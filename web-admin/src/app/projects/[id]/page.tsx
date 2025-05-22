'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { toast } from 'sonner';
import axios from 'axios';
import Link from 'next/link';
import { restoreMarkdownImages } from '@/utils/markdownParser';
import ReactMarkdown from 'react-markdown';

interface ProjectDetail {
  id: string;
  title: string;
  body: string;
  authorId: string;
  authorName: string;
  authorProfilePicture: string;
  createdAt: string;
  type: string;
  priority: number;
}

interface ProjectResponse {
  id: string;
  authorId: string;
  authorName: string;
  authorProfilePicture: string;
  bkashNumber: string;
  isVerified: boolean;
  createdAt: string;
}

interface ProjectResponseDetail extends ProjectResponse {
  body: string;
}

interface PaginatedResponse<T> {
  content: T[];
  page: {
    size: number;
    number: number;
    totalElements: number;
    totalPages: number;
  };
}

interface ImageInfo {
  src: string;
  alt?: string;
  width?: number;
  height?: number;
}

interface ProjectBody {
  article: string;
  images: ImageInfo[];
}

export default function ProjectDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [project, setProject] = useState<ProjectDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [parsedContent, setParsedContent] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  
  // Responses state
  const [responses, setResponses] = useState<ProjectResponse[]>([]);
  const [responsesLoading, setResponsesLoading] = useState(false);
  const [verificationFilter, setVerificationFilter] = useState<boolean | null>(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalResponses, setTotalResponses] = useState(0);
  
  // Response detail modal state
  const [selectedResponseId, setSelectedResponseId] = useState<string | null>(null);
  const [responseDetail, setResponseDetail] = useState<ProjectResponseDetail | null>(null);
  const [responseDetailLoading, setResponseDetailLoading] = useState(false);
  
  // Add response modal state
  const [showAddResponseModal, setShowAddResponseModal] = useState(false);
  const [newResponseText, setNewResponseText] = useState('');
  const [isSubmittingResponse, setIsSubmittingResponse] = useState(false);
  
  // Download CSV modal state
  const [showDownloadModal, setShowDownloadModal] = useState(false);
  const [csvPageSize, setCsvPageSize] = useState(100);
  const [csvPageNumber, setCsvPageNumber] = useState(0);
  const [isDownloading, setIsDownloading] = useState(false);

  useEffect(() => {
    fetchProjectDetail();
  }, []);
  
  useEffect(() => {
    if (project) {
      fetchProjectResponses();
    }
  }, [project, verificationFilter, currentPage]);

  const fetchProjectDetail = async () => {
    try {
      setLoading(true);
      const idToken = localStorage.getItem('authToken');
      if (!idToken) {
        router.push('/login');
        return;
      }

      const projectId = params.id;
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_BACKEND_HOST}/v1/projects/${projectId}`,
        {
          headers: {
            'Authorization': `Bearer ${idToken}`,
            'Content-Type': 'application/json',
          },
        }
      );

      const projectData = response.data as ProjectDetail;
      setProject(projectData);

      // Parse the body JSON string to get article and images
      try {
        const bodyData = JSON.parse(projectData.body) as ProjectBody;
        const restoredMarkdown = restoreMarkdownImages(bodyData.article, bodyData.images);
        setParsedContent(restoredMarkdown);
      } catch (error) {
        console.error('Error parsing project body:', error);
        setParsedContent('Error loading content. Please try again later.');
      }
    } catch (error) {
      console.error('Error fetching project detail:', error);
      toast.error('Failed to load project');
    } finally {
      setLoading(false);
    }
  };

  const fetchProjectResponses = async () => {
    if (!project) return;
    
    try {
      setResponsesLoading(true);
      const idToken = localStorage.getItem('authToken');
      if (!idToken) {
        router.push('/login');
        return;
      }

      let url = `${process.env.NEXT_PUBLIC_BACKEND_HOST}/v1/projects/${project.id}/responses?page=${currentPage}&size=10`;
      
      // Add verification filter if it's not null
      if (verificationFilter !== null) {
        url += `&isVerified=${verificationFilter}`;
      }
      
      const response = await axios.get(url, {
        headers: {
          'Authorization': `Bearer ${idToken}`,
          'Content-Type': 'application/json',
        },
      });

      const data = response.data as PaginatedResponse<ProjectResponse>;
      setResponses(data.content);
      setTotalPages(data.page.totalPages);
      setTotalResponses(data.page.totalElements);
    } catch (error) {
      console.error('Error fetching project responses:', error);
      toast.error('Failed to load project responses');
    } finally {
      setResponsesLoading(false);
    }
  };
  
  const fetchResponseDetail = async (responseId: string) => {
    try {
      setResponseDetailLoading(true);
      const idToken = localStorage.getItem('authToken');
      if (!idToken) {
        router.push('/login');
        return;
      }

      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_BACKEND_HOST}/v1/projects/responses/${responseId}`,
        {
          headers: {
            'Authorization': `Bearer ${idToken}`,
            'Content-Type': 'application/json',
          },
        }
      );

      setResponseDetail(response.data as ProjectResponseDetail);
    } catch (error) {
      console.error('Error fetching response detail:', error);
      toast.error('Failed to load response details');
    } finally {
      setResponseDetailLoading(false);
    }
  };
  
  const handleDownloadCSV = async () => {
    if (!project) return;
    
    try {
      setIsDownloading(true);
      const idToken = localStorage.getItem('authToken');
      if (!idToken) {
        router.push('/login');
        return;
      }

      // Always include isVerified=true to only download verified responses
      let url = `${process.env.NEXT_PUBLIC_BACKEND_HOST}/v1/projects/${project.id}/responses?page=${csvPageNumber}&size=${csvPageSize}&isVerified=true`;
      
      const response = await axios.get(url, {
        headers: {
          'Authorization': `Bearer ${idToken}`,
          'Content-Type': 'application/json',
        },
      });

      const data = response.data as PaginatedResponse<ProjectResponse>;
      const csvContent = convertToCSV(data.content);
      downloadCSV(csvContent, `project-${project.id}-responses.csv`);
      
      setShowDownloadModal(false);
      toast.success('CSV downloaded successfully');
    } catch (error) {
      console.error('Error downloading CSV:', error);
      toast.error('Failed to download CSV');
    } finally {
      setIsDownloading(false);
    }
  };
  
  const convertToCSV = (responses: ProjectResponse[]) => {
    // Define CSV headers - excluding authorId, authorName, authorProfilePicture and isVerified fields
    const headers = ['ID', 'bKash Number', 'Created At', 'Response Body'];
    
    // Map responses to CSV rows - excluding authorId, authorName, authorProfilePicture and isVerified fields
    const rows = responses.map(response => [
      response.id,
      response.bkashNumber,
      response.createdAt,
      `"${(response as any).body?.replace(/"/g, '""') || ''}"` // Escape quotes in body text
    ]);
    
    // Combine headers and rows
    return [headers.join(','), ...rows.map(row => row.join(','))].join('\n');
  };
  
  const downloadCSV = (csvContent: string, fileName: string) => {
    // Create a blob with the CSV content
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    
    // Create a download link
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    
    // Set up the download link
    link.setAttribute('href', url);
    link.setAttribute('download', fileName);
    link.style.visibility = 'hidden';
    
    // Add to document, trigger click, and clean up
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  
  const handleAddResponse = async () => {
    if (!project || !newResponseText.trim()) return;
    
    try {
      setIsSubmittingResponse(true);
      const idToken = localStorage.getItem('authToken');
      if (!idToken) {
        router.push('/login');
        return;
      }

      await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_HOST}/v1/projects/${project.id}/responses`,
        {
          body: newResponseText
        },
        {
          headers: {
            'Authorization': `Bearer ${idToken}`,
            'Content-Type': 'application/json',
          },
        }
      );

      toast.success('Response submitted successfully');
      setNewResponseText('');
      setShowAddResponseModal(false);
      fetchProjectResponses();
    } catch (error) {
      console.error('Error submitting response:', error);
      toast.error('Failed to submit response');
    } finally {
      setIsSubmittingResponse(false);
    }
  };
  
  const handleVerifyResponse = async (responseId: string) => {
    try {
      const idToken = localStorage.getItem('authToken');
      if (!idToken) {
        router.push('/login');
        return;
      }

      await axios.put(
        `${process.env.NEXT_PUBLIC_BACKEND_HOST}/v1/projects/responses/${responseId}?verify=true`,
        {},
        {
          headers: {
            'Authorization': `Bearer ${idToken}`,
            'Content-Type': 'application/json',
          },
        }
      );

      toast.success('Response verified successfully');
      fetchProjectResponses();
    } catch (error) {
      console.error('Error verifying response:', error);
      toast.error('Failed to verify response');
    }
  };
  
  const handleDeleteProject = async () => {
    if (!project || isDeleting) return;

    try {
      setIsDeleting(true);
      const idToken = localStorage.getItem('authToken');
      if (!idToken) {
        router.push('/login');
        return;
      }

      const response = await axios.delete(
        `${process.env.NEXT_PUBLIC_BACKEND_HOST}/v1/projects/${project.id}`,
        {
          headers: {
            'Authorization': `Bearer ${idToken}`,
            'Content-Type': 'application/json',
          },
        }
      );

      if (response.status === 204) {
        toast.success('Project deleted successfully');
        // Redirect to projects list page
        router.push('/projects');
      }
    } catch (error) {
      console.error('Error deleting project:', error);
      toast.error('Failed to delete project');
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

  if (!project) {
    return (
      <div className="min-h-screen bg-indigo-50 flex items-center justify-center">
        <div className="bg-white rounded-lg shadow-md p-8 text-center max-w-md">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-red-500 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Project Not Found</h2>
          <p className="text-gray-600 mb-6">The project you're looking for doesn't exist or has been removed.</p>
          <Link href="/projects" className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
            Go Back to Projects
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-indigo-50">
      {/* Download CSV modal */}
      {showDownloadModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <div className="flex justify-between items-start mb-4">
              <h2 className="text-xl font-bold text-gray-800">Download Responses as CSV</h2>
              <button
                onClick={() => setShowDownloadModal(false)}
                className="p-1 text-gray-500 hover:text-gray-700"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="mb-4">
              <label htmlFor="csvPageSize" className="block text-sm font-medium text-gray-700 mb-2">Page Size</label>
              <input
                id="csvPageSize"
                type="number"
                min="1"
                max="1000"
                className="w-full border border-gray-300 rounded-md p-2 text-black"
                value={csvPageSize}
                onChange={(e) => setCsvPageSize(Math.max(1, parseInt(e.target.value) || 1))}
              />
              <p className="mt-1 text-xs text-gray-500">Number of responses per page (1-1000)</p>
            </div>
            
            <div className="mb-6">
              <label htmlFor="csvPageNumber" className="block text-sm font-medium text-gray-700 mb-2">Page Number</label>
              <input
                id="csvPageNumber"
                type="number"
                min="0"
                className="w-full border border-gray-300 rounded-md p-2 text-black"
                value={csvPageNumber}
                onChange={(e) => setCsvPageNumber(Math.max(0, parseInt(e.target.value) || 0))}
              />
              <p className="mt-1 text-xs text-gray-500">Starting page (0-based index)</p>
            </div>
            
            <div className="flex justify-end">
              <button
                onClick={handleDownloadCSV}
                disabled={isDownloading}
                className={`px-4 py-2 rounded-md ${isDownloading ? 'bg-gray-300 text-gray-500' : 'bg-indigo-600 text-white hover:bg-indigo-700'} focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500`}
              >
                {isDownloading ? 'Downloading...' : 'Download CSV'}
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Add response modal */}
      {showAddResponseModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full">
            <div className="flex justify-between items-start mb-4">
              <h2 className="text-xl font-bold text-gray-800">Add Response</h2>
              <button
                onClick={() => setShowAddResponseModal(false)}
                className="p-1 text-gray-500 hover:text-gray-700"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="mb-4">
              <label htmlFor="responseText" className="block text-sm font-medium text-gray-700 mb-2">Your Response</label>
              <textarea
                id="responseText"
                rows={6}
                className="w-full border border-gray-300 rounded-md p-3 text-black focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Enter your response here..."
                value={newResponseText}
                onChange={(e) => setNewResponseText(e.target.value)}
              />
            </div>
            
            <div className="flex justify-end">
              <button
                onClick={handleAddResponse}
                disabled={isSubmittingResponse || !newResponseText.trim()}
                className={`px-4 py-2 rounded-md ${isSubmittingResponse || !newResponseText.trim() ? 'bg-gray-300 text-gray-500' : 'bg-indigo-600 text-white hover:bg-indigo-700'} focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500`}
              >
                {isSubmittingResponse ? 'Submitting...' : 'Submit Response'}
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Response detail modal */}
      {selectedResponseId && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-start mb-4">
              <h2 className="text-xl font-bold text-gray-800">Response Details</h2>
              <button
                onClick={() => {
                  setSelectedResponseId(null);
                  setResponseDetail(null);
                }}
                className="p-1 text-gray-500 hover:text-gray-700"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            {responseDetailLoading ? (
              <div className="py-10 flex justify-center">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600"></div>
              </div>
            ) : responseDetail ? (
              <div>
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-12 h-12 rounded-full overflow-hidden">
                    {responseDetail.authorProfilePicture ? (
                      <img 
                        src={responseDetail.authorProfilePicture} 
                        alt={responseDetail.authorName} 
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold">
                        {responseDetail.authorName[0]}
                      </div>
                    )}
                  </div>
                  <div>
                    <p className="font-medium text-gray-800">{responseDetail.authorName}</p>
                    <p className="text-sm text-gray-500">{formatDate(responseDetail.createdAt)}</p>
                  </div>
                  <span className={`ml-auto px-3 py-1 rounded-full text-xs ${responseDetail.isVerified ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                    {responseDetail.isVerified ? 'Verified' : 'Pending'}
                  </span>
                </div>
                
                <div className="mb-4">
                  <p className="text-gray-700"><span className="font-medium">bKash Number:</span> {responseDetail.bkashNumber}</p>
                </div>
                
                <div className="mb-6">
                  <h3 className="text-lg font-semibold mb-2 text-black">Response</h3>
                  <div className="bg-gray-50 p-4 rounded-md whitespace-pre-wrap text-black">
                    {responseDetail.body}
                  </div>
                </div>
                
                {!responseDetail.isVerified && project?.authorId === localStorage.getItem('userId') && (
                  <div className="flex justify-end">
                    <button
                      onClick={() => {
                        handleVerifyResponse(responseDetail.id);
                        setSelectedResponseId(null);
                        setResponseDetail(null);
                      }}
                      className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                    >
                      Verify Response
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <p className="text-gray-500">Failed to load response details.</p>
            )}
          </div>
        </div>
      )}
      
      {/* Delete confirmation modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Delete Project</h2>
            <p className="text-gray-700 mb-6">Are you sure you want to delete this project? This action cannot be undone.</p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                disabled={isDeleting}
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteProject}
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
            <Link href="/projects" className="hover:underline">Projects</Link>
            <Link href="/profile" className="hover:underline">Profile</Link>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto p-6">
        {/* Project Header */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="mb-6">
            <div className="flex justify-between items-start mb-2">
              <h1 className="text-3xl font-bold text-gray-800">{project.title}</h1>
              
              {/* Delete button - only shown for projects owned by the current user */}
              {project.authorId === localStorage.getItem('userId') && (
                <button
                  onClick={() => setShowDeleteConfirm(true)}
                  className="p-2 text-red-600 hover:text-red-800 focus:outline-none"
                  aria-label="Delete project"
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
                    {project.authorProfilePicture ? (
                      <img 
                        src={project.authorProfilePicture} 
                        alt={project.authorName} 
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold">
                        {project.authorName[0]}
                      </div>
                    )}
                  </div>
                  <div>
                    <p className="font-medium text-gray-800">{project.authorName}</p>
                    <p className="text-sm text-gray-500">{formatDate(project.createdAt)}</p>
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <span className={`px-3 py-1 rounded-full text-sm ${
                  project.type === 'FREE' ? 'bg-green-100 text-green-800' : 'bg-purple-100 text-purple-800'
                }`}>
                  {project.type}
                </span>
                <span className="text-sm text-gray-500">Priority: {project.priority}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Project Content */}
        <div className="bg-white rounded-lg shadow-md p-6 text-black mb-6">
          <div className="prose max-w-none">
            <ReactMarkdown>
              {parsedContent}
            </ReactMarkdown>
          </div>
        </div>
        
        {/* Project Responses */}
        <div className="bg-white rounded-lg shadow-md p-6 text-black">  
          <div className="flex justify-end mb-4 space-x-4">
            <button
              onClick={() => setShowAddResponseModal(true)}
              className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 flex items-center"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Add Response
            </button>
            <button
              onClick={() => setShowDownloadModal(true)}
              className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 flex items-center"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              Download CSV
            </button>
          </div>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-gray-800">Project Responses</h2>
            <div className="flex items-center space-x-2">
              <label className="text-sm text-gray-600">Filter:</label>
              <select 
                className="border border-gray-300 rounded-md px-3 py-1 text-sm"
                value={verificationFilter === null ? 'all' : verificationFilter.toString()}
                onChange={(e) => {
                  const value = e.target.value;
                  setCurrentPage(0);
                  if (value === 'all') {
                    setVerificationFilter(null);
                  } else {
                    setVerificationFilter(value === 'true');
                  }
                }}
              >
                <option value="all">All Responses</option>
                <option value="true">Verified Only</option>
                <option value="false">Unverified Only</option>
              </select>
            </div>
          </div>
          
          {responsesLoading ? (
            <div className="py-10 flex justify-center">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600"></div>
            </div>
          ) : responses.length > 0 ? (
            <div>
              <div className="overflow-hidden border border-gray-200 rounded-lg mb-4">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Responder</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {responses.map((response) => (
                      <tr key={response.id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10 rounded-full overflow-hidden">
                              {response.authorProfilePicture ? (
                                <img 
                                  src={response.authorProfilePicture} 
                                  alt={response.authorName} 
                                  className="h-10 w-10 rounded-full object-cover"
                                />
                              ) : (
                                <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold">
                                  {response.authorName[0]}
                                </div>
                              )}
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">{response.authorName}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-500">{formatDate(response.createdAt)}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${response.isVerified ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                            {response.isVerified ? 'Verified' : 'Pending'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <button
                            onClick={() => {
                              setSelectedResponseId(response.id);
                              fetchResponseDetail(response.id);
                            }}
                            className="text-indigo-600 hover:text-indigo-900 mr-3"
                          >
                            View Details
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex justify-between items-center mt-4">
                  <p className="text-sm text-gray-600">
                    Showing {responses.length} of {totalResponses} responses
                  </p>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => setCurrentPage(prev => Math.max(0, prev - 1))}
                      disabled={currentPage === 0}
                      className={`px-3 py-1 rounded-md ${currentPage === 0 ? 'bg-gray-100 text-gray-400' : 'bg-indigo-100 text-indigo-700 hover:bg-indigo-200'}`}
                    >
                      Previous
                    </button>
                    <button
                      onClick={() => setCurrentPage(prev => Math.min(totalPages - 1, prev + 1))}
                      disabled={currentPage === totalPages - 1}
                      className={`px-3 py-1 rounded-md ${currentPage === totalPages - 1 ? 'bg-gray-100 text-gray-400' : 'bg-indigo-100 text-indigo-700 hover:bg-indigo-200'}`}
                    >
                      Next
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="py-10 text-center">
              <p className="text-gray-500">No responses found for this project.</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
