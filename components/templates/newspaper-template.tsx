"use client";

interface NewspaperTemplateProps {
  title: string;
  content: string;
  bannerImage?: string;
  fontSize: number;
  titleFontSize?: number;
  date?: string;
  className?: string;
}

export function NewspaperTemplate({
  title,
  content,
  bannerImage,
  fontSize,
  titleFontSize = 32,
  date,
  className = ""
}: NewspaperTemplateProps) {

  // Format content into justified paragraphs
  const formatContent = (text: string) => {
    const paragraphs = text.split('\n\n').filter(p => p.trim() !== '');

    return paragraphs.map((paragraph, index) => (
      <p
        key={index}
        className={`mb-3 text-justify ${index === 0 ? 'indent-6 md:indent-7' : ''}`}
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
      <div className="bg-[#f9f7f2] border border-black shadow-lg">
        {/* Content Container with newspaper-style padding */}
        <div className="p-4">
          {/* Institute Header Logo */}
          <div className="w-full mb-3 rounded-t-xs border border-stone-200 bg-white px-3 py-2">
            <img
              src="/image.png"
              alt="ज्ञानश्री news logo"
              className="mx-auto h-auto max-h-24 w-full object-contain sm:max-h-24"
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
              className="text-black mb-1"
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

            {/* Date Field at Right Bottom */}
            <div className="flex justify-end w-full pr-1 opacity-90">
              <span
                className="font-semibold text-gray-800"
                style={{
                  fontFamily: '"Eczar", "Noto Sans Devanagari", serif',
                  fontSize: `${Math.max(14, fontSize - 1)}px`
                }}
              >
                {date ? `- ${date}` : "- ३ मे २०२६"}
              </span>
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
