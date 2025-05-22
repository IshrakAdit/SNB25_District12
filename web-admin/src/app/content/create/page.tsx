'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import axios from 'axios';
import { parseMarkdownImages, restoreMarkdownImages } from '@/utils/markdownParser';
import Link from 'next/link';
import MDXContentEditor from '@/components/MDXContentEditor';
import { MDXEditorMethods } from '@mdxeditor/editor';

interface UploadedImage {
  url: string;
  size: number;
  contentType: string;
  pathname: string;
}

interface Topic {
  id: string;
  description: string;
}

export default function CreateContentPage() {
  const [title, setTitle] = useState('');
  const [markdown, setMarkdown] = useState('');
  const [topicId, setTopicId] = useState('');
  const [coverPhoto, setCoverPhoto] = useState('');
  const [coverPhotoFile, setCoverPhotoFile] = useState<File | null>(null);
  const [isUploadingCover, setIsUploadingCover] = useState(false);
  const [summary, setSummary] = useState('');
  const [topics, setTopics] = useState<Topic[]>([]);
  const [isLoadingTopics, setIsLoadingTopics] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadedImages, setUploadedImages] = useState<UploadedImage[]>([]);
  const [previewMode, setPreviewMode] = useState(false);
  const [parsedContent, setParsedContent] = useState<{ parsedMarkdown: string; images: any[] } | null>(null);
  const editorRef = useRef<MDXEditorMethods>(null);
  const router = useRouter();

  // Extract image URLs from markdown content
  const extractImageUrls = (content: string) => {
    const regex = /!\[.*?\]\((.*?)\)/g;
    const urls: string[] = [];
    let match;
    
    while ((match = regex.exec(content)) !== null) {
      urls.push(match[1]);
    }
    
    return urls;
  };

  const parseMarkdown = () => {
    if (!markdown.trim()) {
      toast.error('Please enter content');
      return;
    }
    
    const result = parseMarkdownImages(markdown);
    setParsedContent(result);
    setPreviewMode(true);
  };

  // Fetch topics when component mounts
  useEffect(() => {
    fetchTopics();
  }, []);

  const fetchTopics = async () => {
    try {
      setIsLoadingTopics(true);
      const idToken = localStorage.getItem('authToken');
      if (!idToken) {
        router.push('/login');
        return;
      }

      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_BACKEND_HOST}/v1/contents/topics`,
        {
          headers: {
            'Authorization': `Bearer ${idToken}`,
            'Content-Type': 'application/json',
          }
        }
      );

      if (response.data && response.data.topics) {
        setTopics(response.data.topics);
      }
    } catch (error) {
      console.error('Error fetching topics:', error);
      toast.error('Failed to load topics');
    } finally {
      setIsLoadingTopics(false);
    }
  };

  const handleCoverPhotoUpload = async (file: File) => {
    try {
      setIsUploadingCover(true);
      
      const formData = new FormData();
      formData.append('file', file);
      
      const response = await fetch('/api/upload-cover-image', {
        method: 'POST',
        body: formData,
      });
      
      if (!response.ok) {
        throw new Error('Failed to upload cover image');
      }
      
      const data = await response.json();
      setCoverPhoto(data.url);
      toast.success('Cover image uploaded successfully!');
    } catch (error) {
      console.error('Error uploading cover image:', error);
      toast.error('Failed to upload cover image');
    } finally {
      setIsUploadingCover(false);
    }
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim()) {
      toast.error('Please enter a title');
      return;
    }
    
    if (!markdown.trim()) {
      toast.error('Please enter content');
      return;
    }

    if (!topicId) {
      toast.error('Please select a topic');
      return;
    }
    
    if (!coverPhoto) {
      toast.error('Please upload a cover photo');
      return;
    }
    
    if (!summary) {
      toast.error('Please enter a summary');
      return;
    }
    
    try {
      setIsSubmitting(true);
      
      // Parse markdown and extract images
      const { parsedMarkdown, images } = parseMarkdownImages(markdown);
      
      // Get auth token
      const idToken = localStorage.getItem('authToken');
      if (!idToken) {
        router.push('/login');
        return;
      }

      // Prepare the body with article and images
      const body = {
        article: parsedMarkdown,
        images: images
      };
      
      // Prepare the request payload
      const contentData = {
        body: JSON.stringify(body),
        title,
        topicId,
        coverPhoto,
        summary
      };
      
      // Send the content to the server
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_HOST}/v1/contents`,
        contentData,
        {
          headers: {
            'Authorization': `Bearer ${idToken}`,
            'Content-Type': 'application/json',
          }
        }
      );
      
      // Show success message
      toast.success('Content created successfully!');
      
      // Reset form
      setTitle('');
      setMarkdown('');
      setTopicId('');
      setCoverPhoto('');
      setSummary('');
      setUploadedImages([]);
      setParsedContent(null);
      
      // Redirect to home page or content list
      router.push('/');
    } catch (error) {
      console.error('Error creating content:', error);
      toast.error('Failed to create content');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Track uploaded images
  const handleEditorChange = (value: string) => {
    setMarkdown(value);
    
    // Extract image URLs from the new content
    const currentImageUrls = extractImageUrls(value);
    
    // Update the list of uploaded images based on what's in the content
    const updatedImages = uploadedImages.filter(img => currentImageUrls.includes(img.url));
    if (updatedImages.length !== uploadedImages.length) {
      setUploadedImages(updatedImages);
    }
  };

  return (
    <div className="min-h-screen bg-indigo-50">
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
            <Link href="/" className="hover:underline">Home</Link>
            <Link href="/profile" className="hover:underline">Profile</Link>
            <Link href="/leaderboard" className="hover:underline">Leaderboard</Link>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto p-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-800">Create New Content</h1>
          <p className="text-gray-600">Create rich content with markdown, images, and more</p>
        </div>

        {previewMode && parsedContent ? (
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-800">{title}</h2>
              {topicId && (
                <span className="inline-block mt-2 px-3 py-1 bg-indigo-100 text-indigo-800 rounded-full text-sm">
                  {topicId}
                </span>
              )}
            </div>
            
            {coverPhoto && (
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-2">Cover Photo:</h3>
                <img 
                  src={coverPhoto} 
                  alt="Cover preview" 
                  className="max-w-full h-auto rounded-md shadow-sm border"
                  style={{ maxHeight: '300px', objectFit: 'cover' }}
                />
              </div>
            )}
            
            {summary && (
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-2">Summary:</h3>
                <div className="bg-gray-50 p-4 rounded-md">
                  {summary}
                </div>
              </div>
            )}
            
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-2">Parsed Markdown with Image Placeholders:</h3>
              <div className="bg-gray-50 p-4 rounded-md whitespace-pre-wrap font-mono text-sm">
                {parsedContent.parsedMarkdown}
              </div>
            </div>
            
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-2">Extracted Images:</h3>
              {parsedContent.images.length > 0 ? (
                <div>
                  <pre className="bg-gray-50 p-4 rounded-md whitespace-pre-wrap font-mono text-sm overflow-auto">
                    {JSON.stringify(parsedContent.images, null, 2)}
                  </pre>
                  <div className="mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {parsedContent.images.map((img, index) => (
                      <div key={index} className="border rounded-md p-3 bg-gray-50">
                        <p className="font-semibold mb-2">Image {index}:</p>
                        <img 
                          src={img.src} 
                          alt={img.alt || `Image ${index}`}
                          className="max-w-full h-auto mb-2 border"
                          style={{
                            width: img.width ? `${img.width}px` : 'auto',
                            height: img.height ? `${img.height}px` : 'auto',
                          }}
                        />
                        <div className="text-sm">
                          <p><span className="font-medium">Source:</span> {img.src}</p>
                          {img.alt && <p><span className="font-medium">Alt:</span> {img.alt}</p>}
                          {img.width && <p><span className="font-medium">Width:</span> {img.width}px</p>}
                          {img.height && <p><span className="font-medium">Height:</span> {img.height}px</p>}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <p className="text-gray-500 italic">No images found in the content.</p>
              )}
            </div>
            
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-2">Original Markdown:</h3>
              <div className="bg-gray-50 p-4 rounded-md whitespace-pre-wrap font-mono text-sm">
                {markdown}
              </div>
            </div>
            
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-2">Uploaded Images:</h3>
              {uploadedImages.length > 0 ? (
                <ul className="list-disc pl-5">
                  {uploadedImages.map((img, index) => (
                    <li key={index} className="mb-2">
                      <a 
                        href={img.url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-indigo-600 hover:underline"
                      >
                        {img.pathname} ({Math.round(img.size / 1024)} KB)
                      </a>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-600">No images uploaded</p>
              )}
            </div>
            
            <div className="flex space-x-4">
              <button
                onClick={() => {
                  setPreviewMode(false);
                  setParsedContent(null);
                }}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
              >
                Edit Content
              </button>
              <button
                onClick={() => {
                  toast.success('Content published successfully!');
                  // In a real app, you would save to the backend here
                  router.push('/');
                }}
                className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Publish
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6">
            <div className="mb-6">
              <label htmlFor="title" className="block text-sm font-medium text-gray-700">Title</label>
              <input
                type="text"
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-gray-800"
                placeholder="Enter content title"
                required
              />
            </div>
            
            <div className="mb-6">
              <label htmlFor="topicId" className="block text-sm font-medium text-gray-700">Topic</label>
              <select
                id="topicId"
                value={topicId}
                onChange={(e) => setTopicId(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-gray-800"
                disabled={isLoadingTopics}
              >
                <option value="">Select a topic</option>
                {isLoadingTopics ? (
                  <option value="" disabled>Loading topics...</option>
                ) : (
                  topics.map((topic) => (
                    <option key={topic.id} value={topic.id}>{topic.id}</option>
                  ))
                )}
              </select>
            </div>
            
            <div className="mb-6">
              <label htmlFor="coverPhoto" className="block text-sm font-medium text-gray-700">Cover Photo</label>
              <div className="mt-1 flex items-center">
                <label className="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none">
                  <span className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm">
                    {isUploadingCover ? 'Uploading...' : 'Choose file'}
                  </span>
                  <input 
                    id="coverPhoto"
                    name="coverPhoto"
                    type="file"
                    accept="image/*"
                    className="sr-only"
                    disabled={isUploadingCover}
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        setCoverPhotoFile(file);
                        handleCoverPhotoUpload(file);
                      }
                    }}
                  />
                </label>
                {coverPhotoFile && !isUploadingCover && (
                  <span className="ml-3 text-sm text-gray-500">
                    {coverPhotoFile.name} ({Math.round(coverPhotoFile.size / 1024)} KB)
                  </span>
                )}
              </div>
              {coverPhoto && (
                <div className="mt-4">
                  <p className="text-sm text-gray-500 mb-1">Preview:</p>
                  <img 
                    src={coverPhoto} 
                    alt="Cover preview" 
                    className="max-h-40 object-cover rounded border"
                  />
                </div>
              )}
            </div>
            
            <div className="mb-6">
              <label htmlFor="summary" className="block text-sm font-medium text-gray-700">Summary</label>
              <textarea
                id="summary"
                value={summary}
                onChange={(e) => setSummary(e.target.value)}
                rows={3}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-gray-800"
                placeholder="Enter a short summary of the content (no markdown)"
                required
              />
              <p className="mt-1 text-sm text-gray-500">{summary.length} characters</p>
            </div>
            
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">Content</label>
              <div className="border border-gray-300 rounded-md overflow-hidden">
                <MDXContentEditor
                  markdown={markdown}
                  onChange={handleEditorChange}
                  editorRef={editorRef}
                />
              </div>
              <p className="mt-2 text-sm text-gray-500">
                Use markdown to format your content. You can add images, links, and more.
              </p>
            </div>
            
            <div className="flex justify-end space-x-4 mt-4">
              <button
                type="button"
                onClick={() => router.push('/')}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={parseMarkdown}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Preview & Parse Images
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Creating...' : 'Create Content'}
              </button>
            </div>
          </form>
        )}
      </main>
    </div>
  );
}
