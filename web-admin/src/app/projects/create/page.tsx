'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import axios from 'axios';
import { parseMarkdownImages } from '@/utils/markdownParser';
import Link from 'next/link';
import MDXContentEditor from '@/components/MDXContentEditor';
import { MDXEditorMethods } from '@mdxeditor/editor';

interface UploadedImage {
  url: string;
  contentType: string;
  pathname: string;
  downloadUrl: string;
}

export default function CreateProjectPage() {
  const [title, setTitle] = useState('');
  const [markdown, setMarkdown] = useState('');
  const [projectType, setProjectType] = useState<'FREE' | 'PAID'>('FREE');
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
      const projectData = {
        title,
        body: JSON.stringify(body),
        type: projectType
      };
      
      // Send the project to the server
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_HOST}/v1/projects`,
        projectData,
        {
          headers: {
            'Authorization': `Bearer ${idToken}`,
            'Content-Type': 'application/json',
          }
        }
      );
      
      // Show success message
      toast.success('Project created successfully!');
      
      // Redirect to projects page
      router.push('/projects');
    } catch (error) {
      console.error('Error creating project:', error);
      toast.error('Failed to create project');
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
            <Link href="/projects" className="hover:underline">Projects</Link>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto p-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-800">Create New Project</h1>
          <p className="text-gray-600">Create a research project with rich content using markdown, images, and more</p>
        </div>

        {previewMode && parsedContent ? (
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-800">{title}</h2>
              <span className={`inline-block mt-2 px-3 py-1 rounded-full text-sm ${
                projectType === 'PAID' 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-blue-100 text-blue-800'
              }`}>
                {projectType}
              </span>
            </div>
            
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-2 text-black">Parsed Markdown with Image Placeholders:</h3>
              <div className="bg-gray-50 p-4 rounded-md whitespace-pre-wrap font-mono text-sm text-black">
                {parsedContent.parsedMarkdown}
              </div>
            </div>
            
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-2 text-black">Extracted Images:</h3>
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
                <p className="text-gray-500 italic text-black">No images found in the content.</p>
              )}
            </div>
            
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-2 text-black">Original Markdown:</h3>
              <div className="bg-gray-50 p-4 rounded-md text-black whitespace-pre-wrap font-mono text-sm">
                {markdown}
              </div>
            </div>
            
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-2 text-black">Uploaded Images:</h3>
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
                        {img.pathname}
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
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Creating Project...' : 'Create Project'}
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
                placeholder="Enter project title"
                required
              />
            </div>
            
            <div className="mb-6">
              <label htmlFor="projectType" className="block text-sm font-medium text-gray-700">Project Type</label>
              <div className="mt-2 flex space-x-4">
                <label className="inline-flex items-center">
                  <input
                    type="radio"
                    name="projectType"
                    value="FREE"
                    checked={projectType === 'FREE'}
                    onChange={() => setProjectType('FREE')}
                    className="form-radio h-4 w-4 text-indigo-600 border-gray-300 focus:ring-indigo-500"
                  />
                  <span className="ml-2 text-gray-700">Free</span>
                </label>
                <label className="inline-flex items-center">
                  <input
                    type="radio"
                    name="projectType"
                    value="PAID"
                    checked={projectType === 'PAID'}
                    onChange={() => setProjectType('PAID')}
                    className="form-radio h-4 w-4 text-indigo-600 border-gray-300 focus:ring-indigo-500"
                  />
                  <span className="ml-2 text-gray-700">Paid</span>
                </label>
              </div>
            </div>
            
            <div className="mb-6">
              <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-2">Content</label>
              <div className="border border-gray-300 rounded-md overflow-hidden">
                <MDXContentEditor
                  editorRef={editorRef}
                  markdown={markdown}
                  onChange={handleEditorChange}
                  onImageUpload={(image) => {
                    setUploadedImages(prev => [...prev, image]);
                  }}
                />
              </div>
              <p className="mt-2 text-sm text-gray-500">
                Use markdown to format your content. You can add images, lists, headings, and more.
              </p>
            </div>
            
            <div className="flex justify-between">
              <button
                type="button"
                onClick={parseMarkdown}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
              >
                Preview
              </button>
              <div className="flex space-x-4">
                <Link
                  href="/projects"
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Cancel
                </Link>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? 'Creating Project...' : 'Create Project'}
                </button>
              </div>
            </div>
          </form>
        )}
      </main>
    </div>
  );
}
