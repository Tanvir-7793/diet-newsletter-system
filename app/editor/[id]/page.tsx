"use client";

import { useState, useRef, useEffect } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import { newsletterTemplates, getTemplateById, getTemplateStyles, type NewsletterTemplate, type StudentCard } from "@/lib/templates";
import * as htmlToImage from 'html-to-image';
import { useTheme } from "@/hooks/use-theme";
import { NewsletterPreview } from "@/components/newsletter/newsletter-preview";
import { StudentCardEditor } from "@/components/newsletter/student-card-editor";

export default function EditorPage() {
  const params = useParams();
  const id = params?.id as string;

  const [selectedTemplate, setSelectedTemplate] = useState<NewsletterTemplate>(newsletterTemplates[0]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [titleFontSize, setTitleFontSize] = useState(27);
  const [fontSize, setFontSize] = useState(15);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [imageUrl, setImageUrl] = useState("");
  const [isDownloading, setIsDownloading] = useState(false);
  const [isSavingDraft, setIsSavingDraft] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [students, setStudents] = useState<StudentCard[]>([]);
  const { detectMarathi, colors } = useTheme();
  const previewRef = useRef<HTMLDivElement>(null);
  const templateRef = useRef<HTMLDivElement>(null);

  // Load existing newsletter if id is provided
  useEffect(() => {
    if (id && id !== 'new') {
      const fetchNewsletter = async () => {
        setIsLoading(true);
        try {
          // In a real app, you'd fetch by ID from your DB or Cloudinary metadata
          // For now, we'll fetch all and find the one with this ID
          const response = await fetch('/api/newsletters');
          const data = await response.json();
          const newsletter = data.newsletters?.find((n: any) => n.id === id);

          if (newsletter) {
            setTitle(newsletter.title);
            // Cloudinary search doesn't store full content in context by default unless we specifically added it
            // For this demo, we'll set a placeholder or use the preview
            setContent(newsletter.preview || "Loaded from Cloudinary...");
            setImageUrl(newsletter.url);
          }
        } catch (error) {
          console.error("Failed to load newsletter:", error);
        } finally {
          setIsLoading(false);
        }
      };
      fetchNewsletter();
    }
  }, [id]);

  // Auto-detect Marathi text
  useEffect(() => {
    const combinedText = `${title} ${content}`;
    detectMarathi(combinedText);
  }, [title, content]);

  // Sync students with selectedTemplate for preview
  useEffect(() => {
    if (selectedTemplate.id === "placement-showcase") {
      setSelectedTemplate(prev => ({
        ...prev,
        students: students
      }));
    }
  }, [students]);

  const handleTemplateSelect = (templateId: string) => {
    const template = getTemplateById(templateId);
    if (template) {
      setSelectedTemplate(template);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const src = event.target?.result as string;
      const img = new window.Image();
      img.onload = () => {
        // Keep the original pixel dimensions — only compress the file size
        const canvas = document.createElement("canvas");
        canvas.width = img.naturalWidth;
        canvas.height = img.naturalHeight;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;
        ctx.drawImage(img, 0, 0, img.naturalWidth, img.naturalHeight);
        // Export as JPEG at 80% quality for a smaller footprint
        const compressedDataUrl = canvas.toDataURL("image/jpeg", 0.8);
        setUploadedImage(compressedDataUrl);
        setImageUrl(compressedDataUrl);
      };
      img.src = src;
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveImage = () => {
    setUploadedImage(null);
    setImageUrl("");
  };

  const getCaptureElement = () => {
    if (selectedTemplate.id === "placement-showcase") {
      return templateRef.current;
    }

    // First try the explicitly marked preview container
    const previewContainer = previewRef.current?.querySelector("[data-preview-container]") as HTMLDivElement | null;
    if (previewContainer) return previewContainer;

    // On mobile the preview is inside an overflow-x-auto scroll wrapper.
    // We need the inner content div (first child of the scroll wrapper) so we
    // capture the full newsletter width, not just the clipped visible area.
    const scrollWrapper = previewRef.current?.querySelector(".overflow-x-auto") as HTMLDivElement | null;
    if (scrollWrapper) {
      const innerContent = scrollWrapper.firstElementChild as HTMLDivElement | null;
      if (innerContent) return innerContent;
    }

    return previewRef.current;
  };

  const renderPreviewImage = async () => {
    const captureElement = getCaptureElement();
    if (!captureElement) {
      throw new Error("Preview element not found");
    }

    // Use scrollWidth/scrollHeight to get the full content size, not just the
    // visible clipped area (important on mobile with overflow-x-auto wrappers).
    const width = captureElement.scrollWidth || captureElement.offsetWidth;
    const height = captureElement.scrollHeight || captureElement.offsetHeight;
    const pixelRatio = typeof window !== "undefined" ? Math.max(2, window.devicePixelRatio || 1) : 2;

    return htmlToImage.toPng(captureElement, {
      quality: 1.0,
      pixelRatio,
      backgroundColor: "#ffffff",
      width,
      height,
      style: {
        // Temporarily override any overflow/clip so html-to-image renders everything
        overflow: "visible",
        width: `${width}px`,
        height: `${height}px`,
      },
    });
  };

  const handleDownload = async () => {
    setIsDownloading(true);

    try {
      const dataUrl = await renderPreviewImage();

      // Upload to Cloudinary via our API route
      const response = await fetch('/api/upload', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          image: dataUrl,
          title: title,
          type: 'download',
        }),
      });

      if (!response.ok) {
        throw new Error('Cloudinary upload failed');
      }

      const link = document.createElement('a');
      link.download = `${title.replace(/[^a-zA-Z0-9]/g, '_').toLowerCase()}-newsletter.png`;
      link.href = dataUrl;
      link.click();

    } catch (error) {
      console.error('Download failed:', error);
      alert('Download failed. Please try again.');
    } finally {
      setIsDownloading(false);
    }
  };

  const handleSaveDraft = async () => {
    setIsSavingDraft(true);

    try {
      const dataUrl = await renderPreviewImage();

      const response = await fetch('/api/upload', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          image: dataUrl,
          title: title,
          type: 'draft',
        }),
      });

      if (!response.ok) {
        throw new Error('Draft save failed');
      }

      alert('Draft saved successfully to Cloudinary!');

    } catch (error) {
      console.error('Save draft failed:', error);
      alert('Failed to save draft. Please try again.');
    } finally {
      setIsSavingDraft(false);
    }
  };

  if (isLoading) {
    return (
      <div className={`min-h-screen ${colors.bg} flex items-center justify-center`}>
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
          <p className={`${colors.text} font-medium`}>Loading newsletter...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${colors.bg} flex flex-col`}>
      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          height: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #cbd5e1;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #94a3b8;
        }
      `}</style>
      {/* Template Selector */}
      <div className={`${colors.card} border-b ${colors.border} p-4`}>
        <div className="max-w-7xl mx-auto">
          <h2 className={`text-sm font-medium ${colors.muted} mb-3`}>Choose Template</h2>
          <div className="flex space-x-3 overflow-x-auto pb-2 scrollbar-hide">
            {newsletterTemplates.map((template) => (
              <button
                key={template.id}
                onClick={() => handleTemplateSelect(template.id)}
                className={`flex-shrink-0 p-3 rounded-lg border-2 transition-all cursor-pointer ${selectedTemplate.id === template.id
                  ? "border-blue-500 shadow-lg"
                  : colors.border
                  }`}
              >
                <div className="w-20 h-24 rounded-md flex items-center justify-center">
                  <div className={`w-full h-full rounded ${template.preview}`}></div>
                </div>
                <p className={`text-xs mt-2 font-medium text-center ${colors.text}`}>{template.name}</p>
              </button>
            ))}
          </div>
        </div>
      </div>


      {/* Main Content Area */}
      <div className="flex-1 max-w-7xl mx-auto w-full p-4 lg:p-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="lg:sticky lg:top-6 h-fit flex justify-center w-full">
            <div className="w-full max-w-[600px]">
              <h3 className={`text-lg font-semibold mb-4 text-center lg:text-left`}>Live Preview</h3>
              <div className="shadow-2xl overflow-hidden rounded-2xl w-full bg-white p-4" ref={previewRef}>
                <div className="w-full overflow-x-auto pb-4 custom-scrollbar">
                  <div className="min-w-[500px] w-full">
                    <NewsletterPreview
                      template={selectedTemplate}
                      title={title}
                      content={content}
                      imageUrl={imageUrl}
                      fontSize={fontSize}
                      titleFontSize={titleFontSize}
                      className="w-full"
                      templateRef={templateRef}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Editing Controls */}
          <div className="lg:sticky lg:top-6 h-fit">
            <div className={`${colors.card} rounded-lg shadow-lg p-6`}>
              <h3 className={`text-lg font-semibold ${colors.text} mb-6`}>Edit Newsletter</h3>

              <div className="space-y-6">
                {/* Template Info */}
                <div className={`p-3 ${colors.isDark ? 'bg-blue-900' : 'bg-blue-50'} rounded-lg`}>
                  <h4 className={`font-medium ${colors.isDark ? 'text-blue-100' : 'text-blue-900'} text-sm`}>{selectedTemplate.name}</h4>
                  <p className={`${colors.isDark ? 'text-blue-200' : 'text-blue-700'} text-xs mt-1`}>{selectedTemplate.description}</p>
                </div>

                {/* Title Input */}
                <div>
                  {selectedTemplate.id !== "placement-showcase" && (
                    <div className="flex justify-between items-center mb-2">
                      <label htmlFor="title" className={`block text-sm font-medium ${colors.text}`}>
                        Newsletter Title
                      </label>
                      <div className="flex items-center gap-2">
                        <span className={`text-xs ${colors.muted}`}>Size: {titleFontSize}px</span>
                        <input
                          type="range"
                          min="20"
                          max="60"
                          value={titleFontSize}
                          onChange={(e) => setTitleFontSize(parseInt(e.target.value))}
                          className="w-24 h-1.5 bg-blue-200 rounded-lg appearance-none cursor-pointer"
                        />
                      </div>
                    </div>
                  )}
                  {selectedTemplate.id === "placement-showcase" && (
                    <label htmlFor="title" className={`block text-sm font-medium ${colors.text} mb-2`}>
                      Company Name
                    </label>
                  )}
                  <input
                    id="title"
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder={selectedTemplate.id === "placement-showcase" ? "Enter company name (e.g., SEDEMAC)" : "Enter newsletter title"}
                    className={`w-full px-4 py-2 ${colors.input} rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all`}
                  />
                </div>

                {/* Content Textarea - Hidden for placement-showcase */}
                {selectedTemplate.id !== "placement-showcase" && (
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <label htmlFor="content" className={`block text-sm font-medium ${colors.text}`}>
                        Content
                      </label>
                      <div className="flex items-center gap-2">
                        <span className={`text-xs ${colors.muted}`}>Size: {fontSize}px</span>
                        <input
                          type="range"
                          min="12"
                          max="24"
                          value={fontSize}
                          onChange={(e) => setFontSize(parseInt(e.target.value))}
                          className="w-24 h-1.5 bg-blue-200 rounded-lg appearance-none cursor-pointer"
                        />
                      </div>
                    </div>
                    <textarea
                      id="content"
                      value={content}
                      onChange={(e) => setContent(e.target.value)}
                      placeholder="Write your newsletter content..."
                      rows={6}
                      className={`w-full px-4 py-2 ${colors.input} rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all resize-none`}
                    />
                  </div>
                )}

                {selectedTemplate.id === "placement-showcase" && (
                  <StudentCardEditor
                    students={students}
                    onStudentsChange={setStudents}
                  />
                )}

                {/* Image Upload */}
                <div>
                  <label htmlFor="image" className={`block text-sm font-medium ${colors.text} mb-2`}>
                    Newsletter Image
                  </label>
                  <div className="space-y-2">
                    <label className={`flex items-center justify-center w-full px-4 py-6 border-2 border-dashed ${colors.border} rounded-lg cursor-pointer hover:border-blue-500 ${colors.isDark ? 'hover:bg-blue-900' : 'hover:bg-blue-50'} transition-all duration-200`}>
                      <input
                        id="image"
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                      />
                      <div className="text-center">
                        {uploadedImage ? (
                          <>
                            <svg className="mx-auto h-8 w-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v5a2 2 0 002 2z" />
                            </svg>
                            <p className="text-sm text-green-600 font-medium">Image uploaded successfully!</p>
                            <p className={`text-xs ${colors.muted}`}>Click to change image</p>
                          </>
                        ) : (
                          <>
                            <svg className="mx-auto h-8 w-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                            </svg>
                            <p className={`text-sm ${colors.text}`}>Upload image</p>
                            <p className={`text-xs ${colors.muted}`}>PNG, JPG up to 10MB</p>
                          </>
                        )}
                      </div>
                    </label>

                    {/* Image Preview */}
                    {uploadedImage && (
                      <div className="relative group">
                        <div className={`rounded-lg overflow-hidden ${colors.border}`}>
                          <img
                            src={uploadedImage}
                            alt="Uploaded newsletter image"
                            className="w-full h-32 object-cover"
                          />
                        </div>
                        <button
                          onClick={handleRemoveImage}
                          className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition-all duration-200 opacity-0 group-hover:opacity-100 shadow-lg"
                          title="Remove image"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>
                    )}

                    {/* Action Buttons */}
                    <div className="flex gap-3 mt-6">
                      <button
                        onClick={handleSaveDraft}
                        disabled={isSavingDraft || isDownloading}
                        className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center justify-center"
                      >
                        {isSavingDraft ? (
                          <>
                            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Saving...
                          </>
                        ) : (
                          'Save Draft'
                        )}
                      </button>
                      <button className="flex-1 bg-green-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-green-700 transition-colors">
                        Publish
                      </button>
                      <button
                        onClick={handleDownload}
                        disabled={isDownloading}
                        className="flex-1 bg-purple-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                      >
                        {isDownloading ? (
                          <>
                            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Generating...
                          </>
                        ) : (
                          <>
                            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                            Download PNG
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
