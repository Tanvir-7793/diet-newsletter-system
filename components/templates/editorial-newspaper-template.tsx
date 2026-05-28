"use client";

interface EditorialNewspaperTemplateProps {
  title: string;
  content: string;
  bannerImage?: string;
  fontSize: number;
  titleFontSize?: number;
  date?: string;
  className?: string;
}

const DEFAULT_TITLE = "Students celebrate a headline-worthy campus milestone";
const DEFAULT_DATE = "March 18, 2025";
const DEFAULT_CONTENT = [
  "Use this newspaper layout for placement news, campus achievements, or event coverage. Keep the opening paragraph crisp so the story summary feels strong and front-page ready.",
  "Add a few more paragraphs to build context, explain what happened, and highlight the key outcome for readers. The layout will automatically spread the article into multiple editorial sections.",
  "You can also paste longer copy here. The design will turn it into a newspaper-style feature with a main image, highlights rail, pull quote, and supporting article columns.",
].join("\n\n");

function normalizeParagraphs(text: string) {
  return text
    .split(/\n{2,}/)
    .map((block) =>
      block
        .split("\n")
        .map((line) => line.trim())
        .filter(Boolean)
        .join(" ")
    )
    .map((block) => block.replace(/\s+/g, " ").trim())
    .filter(Boolean);
}

function normalizeSentences(text: string) {
  return text
    .replace(/\s+/g, " ")
    .split(/(?<=[.!?।])\s+/)
    .map((sentence) => sentence.trim())
    .filter(Boolean);
}

function trimWords(text: string, wordLimit: number) {
  const words = text.split(/\s+/).filter(Boolean);

  if (words.length <= wordLimit) {
    return text;
  }

  return `${words.slice(0, wordLimit).join(" ")}...`;
}

function distributeParagraphs(paragraphs: string[], columnCount: number) {
  const columns = Array.from({ length: columnCount }, () => [] as string[]);

  paragraphs.forEach((paragraph, index) => {
    columns[index % columnCount].push(paragraph);
  });

  return columns;
}

export function EditorialNewspaperTemplate({
  title,
  content,
  bannerImage,
  fontSize,
  titleFontSize = 32,
  date,
  className = "",
}: EditorialNewspaperTemplateProps) {
  const articleTitle = title.trim() || DEFAULT_TITLE;
  const articleBody = content.trim() || DEFAULT_CONTENT;
  const paragraphs = normalizeParagraphs(articleBody);
  const sentences = normalizeSentences(articleBody);
  const introParagraph = paragraphs[0] ?? DEFAULT_CONTENT;
  const followupParagraph = paragraphs[1] ?? introParagraph;
  const supportParagraph = paragraphs[2] ?? followupParagraph;
  const extraParagraphs = paragraphs.length > 2 ? paragraphs.slice(2) : [supportParagraph];
  const articleColumns = distributeParagraphs(extraParagraphs, 3);
  const summaryHeading = /package|salary|lakh|lpa/i.test(articleBody) ? "Package watch" : "At a glance";
  const rightRailHeading = /selected|placement|student/i.test(`${articleTitle} ${articleBody}`)
    ? "Selected students"
    : "Key highlights";
  const noteHeading = /authority|principal|director|dean/i.test(articleBody)
    ? "Authorities noted"
    : "Why it matters";
  const sectionLabel = /placement|selected|student/i.test(`${articleTitle} ${articleBody}`)
    ? "Campus Placement"
    : "Campus Feature";
  const highlightsSource = sentences.length > 2 ? sentences.slice(1, 7) : paragraphs.slice(1, 7);
  const highlights = (highlightsSource.length ? highlightsSource : [followupParagraph, supportParagraph])
    .map((item) => trimWords(item, 12));
  const quoteSource = /student|placement/i.test(`${articleTitle} ${articleBody}`) ? "Student voice" : "Campus desk";
  const quoteText = trimWords(
    [...sentences].sort((left, right) => right.length - left.length)[0] ?? introParagraph,
    24
  );
  const captionText = trimWords(sentences[1] ?? followupParagraph ?? articleTitle, 22);
  const bodyFontSize = Math.max(13, fontSize);
  const firstColumn = articleColumns[0].length ? articleColumns[0] : [followupParagraph];
  const secondColumn = articleColumns[1].length ? articleColumns[1] : [supportParagraph];
  const thirdColumn = articleColumns[2].length ? articleColumns[2] : [trimWords(followupParagraph, 42)];

  return (
    <div className={`mx-auto w-[920px] max-w-none ${className}`} data-preview-container>
      <article className="overflow-hidden border border-stone-400 bg-[#f6f0e6] text-stone-900 shadow-[0_20px_45px_rgba(68,52,33,0.18)]">
        <div className="px-10 pt-6">
          <div className="flex items-center gap-4 text-[11px] uppercase tracking-[0.45em] text-stone-600">
            <span className="h-px flex-1 bg-stone-300" />
            <span className="font-semibold">Dnyanshree Times</span>
            <span className="h-px flex-1 bg-stone-300" />
          </div>
        </div>

        <div className="mt-4 h-px bg-[#b83d35]" />

        <div className="px-10 pb-8 pt-5">
          <div className="mb-5 flex items-center justify-between text-[12px] font-semibold uppercase tracking-[0.18em] text-stone-700">
            <div className="flex items-center gap-2">
              <span>Dnyanshree Times</span>
              <span className="h-2 w-2 rounded-full bg-[#c94d42]" />
              <span>{sectionLabel}</span>
            </div>
            <span>{date?.trim() || DEFAULT_DATE}</span>
          </div>

          <h1
            className="mb-6 leading-[0.95] tracking-[-0.04em] text-stone-950"
            style={{
              fontFamily: "var(--font-eczar), Georgia, serif",
              fontSize: `${Math.min(Math.max(titleFontSize, 38), 62)}px`,
            }}
          >
            {articleTitle}
          </h1>

          <div className="grid grid-cols-[0.95fr_2fr_1fr] gap-6 items-start">
            <aside className="border-y border-stone-400 py-5">
              <p className="text-[13px] font-semibold uppercase tracking-[0.22em] text-[#9d392e]">
                {summaryHeading}
              </p>
              <p
                className="mt-3 text-[31px] leading-[1.06] tracking-[-0.03em] text-stone-900"
                style={{ fontFamily: "var(--font-eczar), Georgia, serif" }}
              >
                {trimWords(sentences[0] ?? introParagraph, 11)}
              </p>

              <div className="mt-4 border-t border-stone-300 pt-4">
                <p className="text-[12px] font-semibold uppercase tracking-[0.18em] text-stone-600">
                  News network
                </p>
                <p
                  className="mt-2 leading-6 text-stone-700"
                  style={{
                    fontFamily: "var(--font-geist-sans), 'Helvetica Neue', sans-serif",
                    fontSize: `${Math.max(bodyFontSize - 1, 12)}px`,
                  }}
                >
                  {trimWords(followupParagraph, 34)}
                </p>
              </div>
            </aside>

            <figure>
              <div className="overflow-hidden border border-stone-400 bg-stone-100 shadow-[0_10px_24px_rgba(77,62,42,0.14)]">
                {bannerImage ? (
                  <img
                    src={bannerImage}
                    alt={articleTitle}
                    className="h-[330px] w-full object-cover"
                  />
                ) : (
                  <div className="flex h-[330px] w-full items-center justify-center bg-[linear-gradient(135deg,#d6c5ab_0%,#efe5d4_55%,#c7b293_100%)] px-8 text-center">
                    <div>
                      <p className="text-[12px] font-semibold uppercase tracking-[0.3em] text-stone-600">
                        Main photo
                      </p>
                      <p
                        className="mt-4 text-[30px] leading-tight text-stone-800"
                        style={{ fontFamily: "var(--font-eczar), Georgia, serif" }}
                      >
                        Upload an image to complete the front-page story.
                      </p>
                    </div>
                  </div>
                )}
              </div>

              <figcaption
                className="mt-3 border-b border-stone-300 pb-3 leading-5 text-stone-700"
                style={{
                  fontFamily: "var(--font-geist-sans), 'Helvetica Neue', sans-serif",
                  fontSize: `${Math.max(bodyFontSize - 1, 12)}px`,
                }}
              >
                {captionText}
              </figcaption>
            </figure>

            <aside className="border border-stone-300 bg-[#fbf8f1] p-4">
              <h2
                className="text-[22px] leading-none text-stone-950"
                style={{ fontFamily: "var(--font-geist-sans), 'Helvetica Neue', sans-serif" }}
              >
                {rightRailHeading}
              </h2>

              <ul
                className="mt-4 space-y-3 leading-5 text-stone-800"
                style={{
                  fontFamily: "var(--font-geist-sans), 'Helvetica Neue', sans-serif",
                  fontSize: `${Math.max(bodyFontSize - 1, 12)}px`,
                }}
              >
                {highlights.map((item, index) => (
                  <li key={`${item}-${index}`} className="border-b border-stone-200 pb-3 last:border-b-0 last:pb-0">
                    {item}
                  </li>
                ))}
              </ul>
            </aside>
          </div>

          <div className="mt-7 grid grid-cols-[1.1fr_0.92fr_1fr] gap-6 items-start">
            <section className="space-y-4">
              {firstColumn.map((paragraph, index) => (
                <p
                  key={`${paragraph}-${index}`}
                  className={`text-justify leading-[1.75] text-stone-900 ${index === 0 ? "first-letter:float-left first-letter:mr-2 first-letter:text-[3.1rem] first-letter:font-semibold first-letter:leading-[0.8] first-letter:text-stone-950" : ""
                    }`}
                  style={{
                    fontFamily: "var(--font-geist-sans), 'Helvetica Neue', sans-serif",
                    fontSize: `${bodyFontSize}px`,
                  }}
                >
                  {paragraph}
                </p>
              ))}
            </section>

            <section className="space-y-4">
              <blockquote className="border-l-4 border-[#c94d42] bg-[#ece1cf] px-5 py-6 text-stone-900">
                <p
                  className="text-[64px] leading-[0.65] text-[#c94d42]"
                  style={{ fontFamily: "var(--font-eczar), Georgia, serif" }}
                >
                  &ldquo;
                </p>
                <p
                  className="-mt-1 text-[24px] leading-[1.15]"
                  style={{ fontFamily: "var(--font-eczar), Georgia, serif" }}
                >
                  {quoteText}
                </p>
                <p className="mt-4 text-right text-[12px] font-semibold uppercase tracking-[0.2em] text-stone-600">
                  {quoteSource}
                </p>
              </blockquote>

              {secondColumn.map((paragraph, index) => (
                <p
                  key={`${paragraph}-${index}`}
                  className="text-justify leading-[1.75] text-stone-900"
                  style={{
                    fontFamily: "var(--font-geist-sans), 'Helvetica Neue', sans-serif",
                    fontSize: `${bodyFontSize}px`,
                  }}
                >
                  {paragraph}
                </p>
              ))}
            </section>

            <section className="space-y-4">
              <div className="border-t-4 border-[#c94d42] bg-[#f9f4eb] p-4">
                <p className="text-[13px] font-semibold uppercase tracking-[0.18em] text-[#9d392e]">
                  {noteHeading}
                </p>
                <p
                  className="mt-3 leading-6 text-stone-800"
                  style={{
                    fontFamily: "var(--font-geist-sans), 'Helvetica Neue', sans-serif",
                    fontSize: `${Math.max(bodyFontSize, 14)}px`,
                  }}
                >
                  {trimWords(sentences[2] ?? supportParagraph, 30)}
                </p>
              </div>

              {thirdColumn.map((paragraph, index) => (
                <p
                  key={`${paragraph}-${index}`}
                  className="text-justify leading-[1.75] text-stone-900"
                  style={{
                    fontFamily: "var(--font-geist-sans), 'Helvetica Neue', sans-serif",
                    fontSize: `${bodyFontSize}px`,
                  }}
                >
                  {paragraph}
                </p>
              ))}

              <div className="border-t border-stone-300 pt-3 text-[12px] font-medium uppercase tracking-[0.18em] text-stone-600">
                City edition | Page 13
              </div>
            </section>
          </div>
        </div>
      </article>
    </div>
  );
}
