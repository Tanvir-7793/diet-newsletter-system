"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";

interface Newsletter {
  id: string;
  title: string;
  date: string;
  preview: string;
  status: "published" | "draft" | "scheduled";
  imageUrl: string;
}

export default function DashboardPage() {
  const [newsletters, setNewsletters] = useState<Newsletter[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchNewsletters() {
      try {
        const response = await fetch('/api/newsletters');
        const data = await response.json();
        
        if (data.newsletters) {
          const formattedNewsletters = data.newsletters.map((n: any) => ({
            id: n.id,
            title: n.title,
            date: n.createdAt,
            preview: `A ${n.type} newsletter generated on ${new Date(n.createdAt).toLocaleDateString()}`,
            status: n.type === 'draft' ? 'draft' : 'published',
            imageUrl: n.url
          }));
          setNewsletters(formattedNewsletters);
        }
      } catch (error) {
        console.error('Failed to fetch newsletters:', error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchNewsletters();
  }, []);

  const handleDownload = (imageUrl: string, title: string) => {
    const link = document.createElement('a');
    link.href = imageUrl;
    link.download = `${title.replace(/[^a-zA-Z0-9]/g, '_').toLowerCase()}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getStatusBadge = (status: string) => {
    const styles = {
      published: "bg-green-100 text-green-800 border-green-200",
      draft: "bg-yellow-100 text-yellow-800 border-yellow-200", 
      scheduled: "bg-blue-100 text-blue-800 border-blue-200"
    };
    
    return (
      <span className={`px-2 py-1 text-xs font-medium rounded-full border ${styles[status as keyof typeof styles]}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-xl sm:text-2xl font-bold text-slate-900">
                College Newsletter System
              </h1>
            </div>
            
            <div className="flex items-center space-x-4">
              <Link
                href="/editor"
                className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors flex items-center space-x-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                <span className="hidden sm:inline">Create Newsletter</span>
                <span className="sm:hidden">Create</span>
              </Link>
              
             
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
            <p className="text-slate-600 font-medium">Loading newsletters from Cloudinary...</p>
          </div>
        ) : newsletters.length === 0 ? (
          /* Empty State */
          <div className="text-center py-12">
            <div className="mx-auto h-24 w-24 bg-slate-100 rounded-full flex items-center justify-center mb-4">
              <svg className="w-12 h-12 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-slate-900 mb-2">No newsletters yet</h3>
            <p className="text-slate-600 mb-6">Get started by creating your first newsletter</p>
            <Link
              href="/editor"
              className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors inline-flex items-center space-x-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              <span>Create Your First Newsletter</span>
            </Link>
          </div>
        ) : (
          <>
            {/* Stats Bar */}
            <div className="mb-8 grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="bg-white p-4 rounded-lg border border-slate-200">
                <div className="text-2xl font-bold text-slate-900">{newsletters.length}</div>
                <div className="text-sm text-slate-600">Total</div>
              </div>
              <div className="bg-white p-4 rounded-lg border border-slate-200">
                <div className="text-2xl font-bold text-green-600">
                  {newsletters.filter(n => n.status === 'published').length}
                </div>
                <div className="text-sm text-slate-600">Published</div>
              </div>
              <div className="bg-white p-4 rounded-lg border border-slate-200">
                <div className="text-2xl font-bold text-yellow-600">
                  {newsletters.filter(n => n.status === 'draft').length}
                </div>
                <div className="text-sm text-slate-600">Drafts</div>
              </div>
              <div className="bg-white p-4 rounded-lg border border-slate-200">
                <div className="text-2xl font-bold text-blue-600">
                  {newsletters.filter(n => n.status === 'scheduled').length}
                </div>
                <div className="text-sm text-slate-600">Scheduled</div>
              </div>
            </div>

            {/* Newsletter Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {newsletters.map((newsletter) => (
                <div
                  key={newsletter.id}
                  className="bg-white rounded-xl border border-slate-200 overflow-hidden hover:shadow-lg transition-shadow duration-200 group"
                >
                  {/* Preview Image */}
                  <div className="aspect-video relative overflow-hidden">
                    <Image
                      src={newsletter.imageUrl}
                      alt={newsletter.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-200"
                    />
                    <div className="absolute top-3 right-3">
                      {getStatusBadge(newsletter.status)}
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-5">
                    <h3 className="font-semibold text-slate-900 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
                      {newsletter.title}
                    </h3>
                    <p className="text-sm text-slate-600 mb-3 line-clamp-2">
                      {newsletter.preview}
                    </p>
                    <div className="text-xs text-slate-500 mb-4">
                      {new Date(newsletter.date).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </div>

                    {/* Action Buttons */}
                    <div className="flex space-x-2">
                      <Link
                        href={`/editor/${newsletter.id}`}
                        className="flex-1 bg-blue-600 text-white px-3 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors flex items-center justify-center space-x-1"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                        <span>Edit</span>
                      </Link>
                      <button
                        onClick={() => handleDownload(newsletter.imageUrl, newsletter.title)}
                        className="flex-1 bg-slate-100 text-slate-700 px-3 py-2 rounded-lg text-sm font-medium hover:bg-slate-200 transition-colors flex items-center justify-center space-x-1"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        <span>Download</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </main>
    </div>
  );
}
