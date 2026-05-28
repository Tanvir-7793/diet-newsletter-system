"use client";

interface NewTemplateProps {
  title: string;
  bannerImage?: string;
  titleFontSize?: number;
  imageScale?: number;
  className?: string;
}

function GlobeMark({ className = "" }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <circle cx="12" cy="12" r="9" />
      <path d="M3 12h18" />
      <path d="M12 3a14.5 14.5 0 0 1 0 18" />
      <path d="M12 3a14.5 14.5 0 0 0 0 18" />
    </svg>
  );
}

export function NewTemplate({
  title,
  bannerImage,
  titleFontSize = 33,
  imageScale = 100,
  className = "",
}: NewTemplateProps) {
  const resolvedTitle = title.trim() || "मराठी शीर्षक येथे दिसेल";
  const headingFontSize = Math.max(12, Math.min(titleFontSize, 76));
  const computedImageWidth = Math.max(78, Math.min(imageScale, 100));

  return (
    <div className={`mx-auto w-full max-w-[900px] ${className}`} data-preview-container>
      <div className="relative overflow-hidden bg-white pb-[52px] shadow-[0_25px_80px_-15px_rgba(0,0,0,0.25)]">
        <div className="absolute inset-0 overflow-hidden">
          <svg className="absolute inset-0 h-full w-full" viewBox="0 0 1000 1400" preserveAspectRatio="xMidYMid slice">
            <defs>
              <linearGradient id="new-template-fade" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#f5f6f8" stopOpacity="0.8" />
                <stop offset="100%" stopColor="#f5f6f8" stopOpacity="0.2" />
              </linearGradient>
            </defs>
            <g fill="none" stroke="url(#new-template-fade)" strokeWidth="28" opacity="0.7">
              <path d="M -100 280 L 500 -320 L 1100 280" />
              <path d="M -100 380 L 500 -220 L 1100 380" />
              <path d="M -150 820 L 500 170 L 1150 820" />
              <path d="M -150 920 L 500 270 L 1150 920" />
              <path d="M -200 1380 L 500 680 L 1200 1380" />
              <path d="M -200 1480 L 500 780 L 1200 1480" />
            </g>
            <g fill="none" stroke="#f0f1f4" strokeWidth="18" opacity="0.5">
              <path d="M -100 330 L 500 -270 L 1100 330" />
              <path d="M -150 870 L 500 220 L 1150 870" />
              <path d="M -200 1430 L 500 730 L 1200 1430" />
            </g>
          </svg>
        </div>

        <div className="opacity-50 pointer-events-none absolute left-0 top-0 aspect-square w-[28%] max-w-[240px] ">
          <svg viewBox="0 0 340 340" className="h-full w-full" fill="none">
          <path d="M0 0H340V0C340 80 310 160 260 210C210 260 130 290 50 290V340H0V0Z" fill="#8e24aa" />
            <path d="M0 0H320V0C320 70 293 145 247 191C201 237 126 263 46 263V320H0V0Z" fill="white" />
            <path d="M0 0H300V0C300 60 276 130 234 172C192 214 122 236 42 236V300H0V0Z" fill="#4527a0" />
            <path d=" M0 0H28₀V₀C₂₈₀ ₅₀ ₂₅₉ ₁₁₅ ₂₂₁ ₁₅₃C₁₈₃ ₁₉₁ ₁₁₈ ₂₀₉ ₃₈ ₂₀₉V₂₈₀H₀V₀Z" fill="white" />
          </svg>
        </div>

        <div className="opacity-50 pointer-events-none absolute right-0 top-0 aspect-square w-[28%] max-w-[240px] scale-x-[-1]">
          <svg viewBox="0 0 340 340" className="h-full w-full" fill="none">
            <path d="M0 0H340V0C340 80 310 160 260 210C210 260 130 290 50 290V340H0V0Z" fill="#8e24aa" />
            <path d="M0 0H320V0C320 70 293 145 247 191C201 237 126 263 46 263V320H0V0Z" fill="white" />
            <path d="M0 0H300V0C300 60 276 130 234 172C192 214 122 236 42 236V300H0V0Z" fill="#4527a0" />
            <path d=" M0 0H28₀V₀C₂₈₀ ₅₀ ₂₅₉ ₁₁₅ ₂₂₁ ₁₅₃C₁₈₃ ₁₉₁ ₁₁₈ ₂₀₉ ₃₈ ₂₀₉V₂₈₀H₀V₀Z" fill="white" />
          </svg>
        </div>

        <div className="relative z-10 px-4 pt-[5.5%]">
          <div className="flex items-center justify-center gap-3 md:gap-4">
            <img
              src="/logo4.png"
              alt="Dnyanshree Institute logo"
              className="h-[46px] w-auto object-contain sm:h-[58px] md:h-[68px] mix-blend-multiply"
            />
          </div>
        </div>

        <div className="absolute bottom-[28%] left-[3.5%] z-10 hidden sm:flex flex-col gap-[2px]">
          {Array.from({ length: 9 }).map((_, index) => (
            <svg key={`left-chevron-${index}`} width="22" height="14" viewBox="0 0 22 14" fill="none">
              <path d="M3 3L11 10L19 3" stroke="#7b1fa2" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          ))}
        </div>

        <div className="absolute bottom-[28%] right-[3.5%] z-10 hidden sm:flex flex-col gap-[2px]">
          {Array.from({ length: 9 }).map((_, index) => (
            <svg key={`right-chevron-${index}`} width="22" height="14" viewBox="0 0 22 14" fill="none" className="rotate-180">
              <path d="M3 3L11 10L19 3" stroke="#4527a0" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          ))}
        </div>

        <div className="relative z-10 mx-[8%] mb-4 mt-[7%] overflow-visible">
          <div className="flex flex-col items-center">
            <div className="w-full max-w-[86%] overflow-visible px-2 pt-3 text-center">
              <h2
                className="text-balance pt-[0.14em] font-normal leading-[1.14] tracking-[-0.015em] text-[#7b0ea7]"
                style={{
                  fontFamily: 'var(--font-yatra-one), var(--font-martel), var(--font-noto-sans-devanagari), serif',
                  fontSize: `${headingFontSize}px`,
                  textShadow: "0 3px 0 rgba(69,39,160,0.14)",
                }}
              >
                {resolvedTitle}
              </h2>
              
            </div>

            <div className="mt-6 flex w-full items-start justify-center overflow-visible">
              <div
                className="mx-auto transition-all duration-200"
                style={{ width: `${computedImageWidth}%` }}
              >
                <div className="bg-white p-1 shadow-[24px_22px_32px_rgba(15,23,42,0.14)] ring-1 ring-slate-200">
                  {bannerImage ? (
                    <img
                      src={bannerImage}
                      alt={resolvedTitle}
                      className="block h-auto w-full"
                    />
                  ) : (
                    <div className="flex min-h-[260px] w-full items-center justify-center border-2 border-dashed border-slate-300 bg-slate-50 text-center">
                      <div className="px-6">
                        <p className="text-[13px] font-semibold uppercase tracking-[0.28em] text-[#7b0ea7]">
                          Main Image
                        </p>
                        <p className="mt-3 text-sm leading-6 text-slate-500">
                          Upload the main newspaper clipping or poster image for this layout.
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0">
          <div className="h-[14px] w-full bg-[#4527a0] sm:h-[16px]" />
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2">
            <div className="flex h-[32px] items-center gap-2 rounded-t-[28px] bg-[#f9c835] px-6 shadow-[0_-4px_12px_rgba(0,0,0,0.08)] sm:h-[36px] sm:px-10 md:px-14">
              <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#6a1b5a] sm:h-[24px] sm:w-[24px]">
                <GlobeMark className="h-3.5 w-3.5 text-[#f9c835] sm:h-4 sm:w-4" />
              </div>
              <span className="whitespace-nowrap text-[13px] font-bold tracking-[0.08em] text-[#4a148c] sm:text-[15px] md:text-[17px]">
                www.dnyanshree.edu.in
              </span>
            </div>
          </div>
        </div>

        <div
          className="pointer-events-none absolute inset-0 opacity-[0.03] mix-blend-multiply"
          style={{
            backgroundImage:
              'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 256 256\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noise\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.9\' numOctaves=\'4\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noise)\'/%3E%3C/svg%3E")',
          }}
        />
      </div>
    </div>
  );
}
