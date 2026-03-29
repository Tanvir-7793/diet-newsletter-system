"use client";

import { useRef, useEffect, useState } from "react";
import Image from "next/image";
import { NewsletterTemplate } from "@/lib/templates";
import { NewspaperTemplate } from "@/components/templates/newspaper-template";
import { PlacementTemplate } from "@/components/templates/placement-template";

interface NewsletterPreviewProps {
  template: NewsletterTemplate;
  title: string;
  content: string;
  imageUrl?: string;
  fontSize: number;
  titleFontSize?: number;
  className?: string;
  templateRef?: React.RefObject<HTMLDivElement | null>;
}

export function NewsletterPreview({
  template,
  title,
  content,
  imageUrl,
  fontSize,
  titleFontSize = 32,
  className = "",
  templateRef
}: NewsletterPreviewProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  // Use newspaper template for newspaper-marathi
  if (template.id === "newspaper-marathi") {
    return (
      <div className={`max-w-2xl mx-auto ${className}`} data-preview-container>
        <NewspaperTemplate
          title={title}
          titleFontSize={titleFontSize}
          content={content}
          bannerImage={imageUrl}
          fontSize={fontSize}
        />
      </div>
    );
  }

  // Use placement template for student showcase
  if (template.id === "placement-showcase") {
    return (
      <div className={`max-w-2xl mx-auto ${className}`} data-preview-container>
        <div className="shadow-2xl rounded-2xl overflow-hidden border-[1px] border-slate-200">
          <div ref={templateRef} className="bg-white w-full p-0">
            <PlacementTemplate
              template={template}
              companyName={title}
              students={template.students || []}
            />
          </div>
        </div>
      </div>
    );
  }

  // Format content into paragraphs for better readability
  const formatContent = (text: string) => {
    // Split by double newlines for major sections
    const sections = text.split('\n\n');
    
    return sections.map((section, sectionIndex) => {
      // Further split by single newlines for paragraphs within sections
      const paragraphs = section.split('\n').filter(p => p.trim() !== '');
      
      return (
        <div key={sectionIndex} className="mb-6">
          {paragraphs.map((paragraph, paraIndex) => (
            <p 
              key={paraIndex} 
              className="mb-4 leading-relaxed"
              style={{ 
                fontSize: `${fontSize}px`,
                lineHeight: '1.8', // Increased for Marathi readability
                letterSpacing: '0.02em', // Slight letter spacing for Marathi
                color: template.config.layout.contentPosition.color === 'text-white' ? '#ffffff' : '#374151'
              }}
            >
              {paragraph}
            </p>
          ))}
        </div>
      );
    });
  };

  const getBackgroundStyle = () => {
    const { background } = template.config;
    
    switch (background.type) {
      case 'gradient':
        return { background: background.value };
      case 'image':
        return {
          backgroundImage: `url(${background.value})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        };
      case 'color':
        return { backgroundColor: background.value };
      default:
        return { backgroundColor: '#ffffff' };
    }
  };

  const getOverlayStyle = () => {
    const overlay = template.config.background.overlay;
    if (overlay) {
      return {
        backgroundColor: overlay.color,
        opacity: overlay.opacity / 100
      };
    }
    return {};
  };

  return (
    <div className={`max-w-2xl mx-auto ${className}`}>
      {/* Main Container - Like a poster/card */}
      <div className="bg-white rounded-2xl shadow-2xl overflow-hidden border-[1px] border-slate-200">
        {/* A4 Aspect Ratio Container with proper padding */}
        <div 
          className="aspect-[210/297] relative" 
          ref={containerRef} 
          style={getBackgroundStyle()}
        >
          {/* Overlay */}
          {template.config.background.overlay && (
            <div 
              className="absolute inset-0"
              style={getOverlayStyle()}
            />
          )}

          {/* Content Container with proper spacing */}
          <div className="relative h-full p-8 flex flex-col">
            {/* Top Section - Image Banner */}
            {imageUrl && (
              <div className="w-full mb-6">
                <img
                  src={imageUrl}
                  alt="Newsletter banner"
                  className="w-full h-48 object-cover rounded-xl shadow-lg"
                />
              </div>
            )}

            {/* Middle Section - Title and Subtitle */}
            <div className="mb-8 text-center">
              <h1 
                className="font-black leading-tight mb-3"
                style={{ 
                  fontFamily: 'var(--font-martel), serif',
                  fontSize: `${titleFontSize}px`,
                  lineHeight: '1.2', // Tighter for headlines
                  letterSpacing: '-0.01em', // Slightly tighter for bold look
                  color: template.config.layout.titlePosition.color === 'text-white' ? '#ffffff' : '#1f2937'
                }}
              >
                {title || "Newsletter Title"}
              </h1>
              <p 
                className="text-lg font-medium opacity-90"
                style={{ 
                  color: template.config.layout.titlePosition.color === 'text-white' ? '#e5e7eb' : '#64748b',
                  lineHeight: '1.6', // Better readability
                  letterSpacing: '0.01em'
                }}
              >
                Dnyanshree Institute of Engineering and Technology
              </p>
            </div>

            {/* Bottom Section - Content */}
            <div className="flex-1 overflow-hidden">
              <div 
                className="text-base leading-relaxed space-y-4"
                style={{ 
                  fontSize: `${fontSize}px`,
                  lineHeight: '1.8', // Increased for Marathi readability
                  letterSpacing: '0.02em', // Slight letter spacing for Marathi
                  color: template.config.layout.contentPosition.color === 'text-white' ? '#ffffff' : '#374151'
                }}
              >
                {formatContent(content || "Newsletter content will appear here...")}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
