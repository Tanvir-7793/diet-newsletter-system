"use client";

import Image from "next/image";

interface NewspaperTemplateProps {
  title: string;
  content: string;
  bannerImage?: string;
  fontSize: number;
  titleFontSize?: number;
  className?: string;
}

export function NewspaperTemplate({
  title,
  content,
  bannerImage,
  fontSize,
  titleFontSize = 32,
  className = ""
}: NewspaperTemplateProps) {

  // Format content into justified paragraphs
  const formatContent = (text: string) => {
    const paragraphs = text.split('\n\n').filter(p => p.trim() !== '');

    return paragraphs.map((paragraph, index) => (
      <p
        key={index}
        className="mb-3 text-justify"
        style={{
          fontSize: `${fontSize}px`,
          lineHeight: '1.8',
          letterSpacing: '0',
          fontFamily: '"Eczar", "Noto Sans Devanagari", serif'
        }}
      >
        {paragraph}
      </p>
    ));
  };

  return (
    <div className={`max-w-2xl mx-auto ${className}`} data-preview-container>
      {/* Newspaper Container */}
      <div className="bg-[white] border-[1px] border-black shadow-lg">
        {/* Content Container with newspaper-style padding */}
        <div className="p-4">
          {/* Institute Header Image */}
          <div className="w-full mb-6 relative h-22">
            <Image
              src="/header-newsletter1.jpeg"
              alt="Institute Header"
              fill
              className="object-contain"
              priority
            />
          </div>

          {/* Top Section - Banner Image */}
          {bannerImage && (
            <div className="w-full mb-4">
              <img
                src={bannerImage}
                alt="Newspaper banner"
                className="w-full object-contain border border-black"
              />
            </div>
          )}

          {/* Title Section - Marathi Headline */}
          <div className="mb-4 text-center">
            <h1
              className="font-black text-black"
              style={{
                fontFamily: 'var(--font-martel), serif',
                fontSize: `${titleFontSize}px`,
                lineHeight: '1.2',
                letterSpacing: '0',
                color: '#000000'
              }}
            >
              {title || "वृत्तपत्राचे शीर्षक"}
            </h1>
          </div>

          {/* Content Section - Justified Marathi Text */}
          <div className="mb-1">
            <div
              className="text-black"
              style={{
                fontSize: `${fontSize}px`,
                lineHeight: '1.8',
                letterSpacing: '0',
                fontFamily: '"Eczar", "Noto Sans Devanagari", serif',
                textAlign: 'justify',
                textJustify: 'inter-word'
              }}
            >
              {formatContent(content || "वृत्तपत्रातील मजकूर येथे दिसेल. हे एक नमुना मजकूर आहे. यात अनेक वाक्ये आणि अनुच्छेद असतील. मराठी भाषेतील लेखन योग्यरित्या प्रदर्शित केले जाईल. वृत्तपत्राच्या शैलीत हे मजकूर लिहिले जाईल.")}
            </div>
          </div>

          {/* Bottom Line */}
          <div className="h-[0.5px] bg-black mt-3 mb-3"></div>

          {/* Footer Strip */}
          <div className="w-full mt-auto">
            <img
              src="/newsletter-fotter.jpeg"
              alt="Newsletter footer"
              className="w-full object-contain"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
