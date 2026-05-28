"use client";

import { type ElementType, useEffect, useRef } from "react";

export interface NewspaperBlock {
  id: string;
  section:
  | "masthead"
  | "headline"
  | "leftSummary"
  | "leftMeta"
  | "leftParagraph"
  | "leftSubheading"
  | "imageCaption"
  | "rightTitle"
  | "rightParagraph"
  | "bottomQuote"
  | "bottomParagraph"
  | "bottomRightTitle"
  | "bottomRightParagraph"
  | "footer";
  type: "text" | "title" | "paragraph" | "quote" | "meta";
  content: string;
}

export interface EditorialNewspaperTemplateProps {
  blocks: NewspaperBlock[];
  featuredImage?: string;
  editable?: boolean;
  className?: string;
  preserveDesktopLayout?: boolean;
  onBlockChange?: (id: string, value: string) => void;
  onImageChange?: (value: string) => void;
  onAddBlock?: (section: "leftParagraph" | "rightParagraph" | "bottomParagraph" | "bottomRightParagraph") => void;
  onDeleteBlock?: (id: string) => void;
  onMoveBlock?: (id: string, direction: "up" | "down") => void;
}

export type NewsletterData = {
  masthead: string;
  edition: string;
  date: string;
  headline: string;
  summary: string;
  location: string;
  leftParagraphs: string[];
  subheading: string;
  image: string;
  imageCaption: string;
  rightTitle: string;
  rightContent: string[];
  quote: string;
  bottomParagraphs: string[];
  bottomRightTitle: string;
  bottomRightParagraphs: string[];
  footer: string[];
};

interface StoryPreviewInput {
  title?: string;
  content?: string;
  date?: string;
}

interface EditableBlockTextProps {
  block?: NewspaperBlock;
  as?: ElementType;
  editable?: boolean;
  className?: string;
  placeholder?: string;
  onBlockChange?: (id: string, value: string) => void;
  controls?: React.ReactNode;
}

const HEADLINE_FONT = `var(--font-eczar), "Noto Sans Devanagari", Georgia, "Times New Roman", serif`;
const BODY_FONT = `var(--font-eczar), "Noto Sans Devanagari", Georgia, "Times New Roman", serif`;
const META_FONT = `var(--font-geist-sans), Arial, Helvetica, sans-serif`;
const PLACEHOLDER_IMAGE = "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1200&q=80";
const BLOCK_CONTROLLABLE_SECTIONS = new Set<NewspaperBlock["section"]>([
  "leftParagraph",
  "rightParagraph",
  "bottomParagraph",
  "bottomRightParagraph",
]);

function createBlock(
  id: string,
  section: NewspaperBlock["section"],
  type: NewspaperBlock["type"],
  content: string
): NewspaperBlock {
  return { id, section, type, content };
}

function joinClasses(...classNames: Array<string | false | null | undefined>) {
  return classNames.filter(Boolean).join(" ");
}

function getBlocksBySection(blocks: NewspaperBlock[], section: NewspaperBlock["section"]) {
  return blocks.filter((block) => block.section === section);
}

function getBlock(blocks: NewspaperBlock[], section: NewspaperBlock["section"], index = 0) {
  return getBlocksBySection(blocks, section)[index];
}

function normalizeParagraphs(text: string) {
  return text
    .split(/\n{2,}/)
    .map((paragraph) => paragraph.replace(/\s+/g, " ").trim())
    .filter(Boolean);
}

function normalizeSentences(text: string) {
  return text
    .replace(/\s+/g, " ")
    .split(/(?<=[.!?।])\s+/)
    .map((sentence) => sentence.trim())
    .filter(Boolean);
}

function trimWords(text: string, limit: number) {
  const words = text.split(/\s+/).filter(Boolean);

  if (words.length <= limit) {
    return text;
  }

  return `${words.slice(0, limit).join(" ")}...`;
}

function canMoveBlock(blocks: NewspaperBlock[], id: string, direction: "up" | "down") {
  const target = blocks.find((block) => block.id === id);

  if (!target || !BLOCK_CONTROLLABLE_SECTIONS.has(target.section)) {
    return false;
  }

  const sectionBlocks = getBlocksBySection(blocks, target.section);
  const index = sectionBlocks.findIndex((block) => block.id === id);

  if (index === -1) {
    return false;
  }

  return direction === "up" ? index > 0 : index < sectionBlocks.length - 1;
}

function canDeleteBlock(blocks: NewspaperBlock[], block?: NewspaperBlock) {
  if (!block || !BLOCK_CONTROLLABLE_SECTIONS.has(block.section)) {
    return false;
  }

  return getBlocksBySection(blocks, block.section).length > 1;
}

export function createEditorialNewspaperSampleBlocks(): NewspaperBlock[] {
  return buildEditorialBlocksFromData(createSampleEditorialNewsletterData());
}

export function createSampleEditorialNewsletterData(): NewsletterData {
  return {
    masthead: "DNYANSHREE TIMES",
    edition: "Campus Edition",
    date: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
    headline: "44 engineering students selected by Japanese company",
    summary: "Average annual package of students is Rs 17 lakh.",
    location: "Dnyanshree Institute satara",
    leftParagraphs: [
      "In an encouraging campus development, forty-four students of the engineering college secured placement offers during a recent recruitment drive. The achievement reflects steady preparation, focused language training, and consistent mentorship.",
    ],
    subheading: "Learning support helped students",
    image: PLACEHOLDER_IMAGE,
    imageCaption:
      "Students gather for a commemorative photograph after the successful placement announcement at the college campus.",
    rightTitle: "Selected students",
    rightContent: [
      "Krishnaraj Badad, Gayatri Gawali, Kalyani Ghodke, Sanika Kadam, Karthik Kale, Parth Gunjal, Akash Pathare, Shruti Ulhare, Dipali Zagade, Ashish Kale, Kiran Sabale, Aryan Agwan and several others joined the selection list.",
    ],
    quote:
      "I am proud to have fulfilled my dream. The training built confidence and helped me perform calmly during the final interviews.",
    bottomParagraphs: [
      "Students shared that the program combined technical preparation with spoken language confidence, making them better equipped for international roles and structured interview rounds.",
    ],
    bottomRightTitle: "Authorities delighted",
    bottomRightParagraphs: [
      "Institute authorities expressed happiness over the selection results and said the campus would continue investing in employability programs, interview support, and industry-connected learning opportunities.",
    ],
    footer: [
      "DIET A/P- Sonwadi-Gajawadi, Sajjangad Road, Satara-415013.",
      "Page No. 13",
      new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
    ],
  };
}

export function buildEditorialBlocksFromData(data: NewsletterData): NewspaperBlock[] {
  const footerValues = [...data.footer];

  while (footerValues.length < 3) {
    footerValues.push("");
  }

  return [
    createBlock("masthead-brand", "masthead", "title", data.masthead),
    createBlock("masthead-edition", "masthead", "meta", data.edition),
    createBlock("masthead-date", "masthead", "meta", data.date),
    createBlock("headline-main", "headline", "title", data.headline),
    createBlock("left-summary-main", "leftSummary", "paragraph", data.summary),
    createBlock("left-meta-location", "leftMeta", "meta", data.location),
    ...data.leftParagraphs.map((paragraph, index) =>
      createBlock(`left-paragraph-${index + 1}`, "leftParagraph", "paragraph", paragraph)
    ),
    createBlock("left-subheading-main", "leftSubheading", "title", data.subheading),
    createBlock("image-caption-main", "imageCaption", "text", data.imageCaption),
    createBlock("right-title-main", "rightTitle", "title", data.rightTitle),
    ...data.rightContent.map((paragraph, index) =>
      createBlock(`right-paragraph-${index + 1}`, "rightParagraph", "paragraph", paragraph)
    ),
    createBlock("bottom-quote-main", "bottomQuote", "quote", data.quote),
    ...data.bottomParagraphs.map((paragraph, index) =>
      createBlock(`bottom-paragraph-${index + 1}`, "bottomParagraph", "paragraph", paragraph)
    ),
    createBlock("bottom-right-title-main", "bottomRightTitle", "title", data.bottomRightTitle),
    ...data.bottomRightParagraphs.map((paragraph, index) =>
      createBlock(`bottom-right-paragraph-${index + 1}`, "bottomRightParagraph", "paragraph", paragraph)
    ),
    createBlock("footer-place", "footer", "meta", footerValues[0]),
    createBlock("footer-page", "footer", "meta", footerValues[1]),
    createBlock("footer-date", "footer", "meta", footerValues[2]),
  ];
}

export function buildEditorialBlocksFromStory({
  title,
  content,
  date,
}: StoryPreviewInput): NewspaperBlock[] {
  const sample = createSampleEditorialNewsletterData();
  const paragraphs = normalizeParagraphs(content ?? "");
  const sentences = normalizeSentences(content ?? "");
  const [firstParagraph, secondParagraph, thirdParagraph, fourthParagraph] = paragraphs;

  return buildEditorialBlocksFromData({
    ...sample,
    date: date?.trim() || sample.date,
    headline: title?.trim() || sample.headline,
    summary: firstParagraph ? trimWords(firstParagraph, 14) : sample.summary,
    leftParagraphs: [
      firstParagraph || sample.leftParagraphs[0],
      secondParagraph || sample.leftParagraphs[1],
      thirdParagraph || sample.leftParagraphs[2],
    ].filter(Boolean),
    imageCaption: sentences[1] || secondParagraph || sample.imageCaption,
    quote: trimWords(sentences[0] || firstParagraph || sample.quote, 28),
    bottomParagraphs: [
      fourthParagraph || thirdParagraph || sample.bottomParagraphs[0],
      paragraphs.slice(4).join(" ") || fourthParagraph || sample.bottomParagraphs[1],
    ].filter(Boolean),
  });
}

function EditableBlockText({
  block,
  as: Tag = "div",
  editable = false,
  className,
  placeholder,
  onBlockChange,
  controls,
}: EditableBlockTextProps) {
  const ref = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!ref.current || !block) {
      return;
    }

    const nextContent = block.content ?? "";

    if (ref.current.innerText !== nextContent) {
      ref.current.innerText = nextContent;
    }
  }, [block]);

  if (!block) {
    return null;
  }

  return (
    <div className="group relative">
      <Tag
        ref={ref as never}
        contentEditable={editable}
        suppressContentEditableWarning
        data-placeholder={placeholder}
        onInput={(event: React.FormEvent<HTMLElement>) => {
          onBlockChange?.(block.id, event.currentTarget.innerText);
        }}
        className={joinClasses(
          "whitespace-pre-wrap",
          editable &&
          "rounded-[3px] border border-transparent px-1 py-0.5 -mx-1 -my-0.5 transition hover:border-stone-300 focus:border-stone-500 focus:bg-white/70 focus:outline-none",
          editable &&
          "[&:empty:before]:text-stone-400 [&:empty:before]:content-[attr(data-placeholder)]",
          className
        )}
      >
        {block.content}
      </Tag>
      {editable && controls ? (
        <div className="absolute -right-2 top-0 z-10 flex -translate-y-full gap-1 rounded-md border border-stone-300 bg-[#fbf8f1] px-1.5 py-1 opacity-0 shadow-sm transition group-hover:opacity-100 group-focus-within:opacity-100">
          {controls}
        </div>
      ) : null}
    </div>
  );
}

function BlockActionButton({
  label,
  onClick,
  disabled = false,
}: {
  label: string;
  onClick?: () => void;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="rounded border border-stone-300 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-[0.16em] text-stone-600 transition hover:border-stone-500 hover:text-stone-900 disabled:cursor-not-allowed disabled:opacity-35"
    >
      {label}
    </button>
  );
}

function AddParagraphButton({
  label,
  onClick,
}: {
  label: string;
  onClick?: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="mt-3 inline-flex items-center gap-2 rounded-full border border-dashed border-stone-400 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-stone-600 transition hover:border-stone-700 hover:text-stone-900"
    >
      <span className="text-sm leading-none">+</span>
      {label}
    </button>
  );
}

export function EditorialNewspaperTemplate({
  blocks,
  featuredImage,
  editable = false,
  className,
  preserveDesktopLayout = false,
  onBlockChange,
  onImageChange,
  onAddBlock,
  onDeleteBlock,
  onMoveBlock,
}: EditorialNewspaperTemplateProps) {
  const mastheadBlocks = getBlocksBySection(blocks, "masthead");
  const leftMetaBlocks = getBlocksBySection(blocks, "leftMeta");
  const leftParagraphBlocks = getBlocksBySection(blocks, "leftParagraph");
  const rightParagraphBlocks = getBlocksBySection(blocks, "rightParagraph");
  const bottomParagraphBlocks = getBlocksBySection(blocks, "bottomParagraph");
  const bottomRightParagraphBlocks = getBlocksBySection(blocks, "bottomRightParagraph");
  const footerBlocks = getBlocksBySection(blocks, "footer");
  const imageSource = featuredImage?.trim() || PLACEHOLDER_IMAGE;
  const useDesktopLayout = preserveDesktopLayout;

  return (
    <div
      className={joinClasses(useDesktopLayout ? "w-[1080px] max-w-none" : "w-full", className)}
      data-preview-container
    >
      <article
        className={joinClasses(
          "mx-auto border border-stone-400 bg-[#f8f4eb] text-stone-900 shadow-[0_18px_45px_rgba(67,51,35,0.15)]",
          useDesktopLayout ? "w-[1080px] max-w-none" : "w-full max-w-[1080px]"
        )}
      >
        <header className={useDesktopLayout ? "px-10 pt-7" : "px-4 pt-5 sm:px-6 sm:pt-6 lg:px-10 lg:pt-7"}>
          {!useDesktopLayout ? (
            <div className="mb-3 flex items-center justify-between gap-3 md:hidden">
              <EditableBlockText
                block={mastheadBlocks[1]}
                as="p"
                editable={editable}
                placeholder="Edition label"
                onBlockChange={onBlockChange}
                className="text-[10px] font-semibold uppercase tracking-[0.22em] text-stone-600"
              />
              <EditableBlockText
                block={mastheadBlocks[2]}
                as="p"
                editable={editable}
                placeholder="Top date"
                onBlockChange={onBlockChange}
                className="text-right text-[10px] font-semibold uppercase tracking-[0.22em] text-stone-600"
              />
            </div>
          ) : null}

          <div className={joinClasses("relative flex items-center justify-center", useDesktopLayout ? "min-h-[4rem]" : "min-h-[3.6rem]")}>
            <div
              className={joinClasses(
                "absolute left-0 top-1/2 -translate-y-1/2 text-left",
                useDesktopLayout ? "block" : "hidden md:block"
              )}
            >
              <EditableBlockText
                block={mastheadBlocks[1]}
                as="p"
                editable={editable}
                placeholder="Edition label"
                onBlockChange={onBlockChange}
                className="text-[11px] font-semibold uppercase tracking-[0.3em] text-stone-600"
              />
            </div>

            <EditableBlockText
              block={mastheadBlocks[0]}
              as="h1"
              editable={editable}
              placeholder="Newspaper name"
              onBlockChange={onBlockChange}
              className={
                useDesktopLayout
                  ? "text-center text-[2.55rem] uppercase tracking-[0.22em] text-stone-950"
                  : "text-center text-[1.45rem] uppercase tracking-[0.16em] text-stone-950 sm:text-[2rem] sm:tracking-[0.2em] lg:text-[2.55rem] lg:tracking-[0.22em]"
              }
            />

            <div
              className={joinClasses(
                "absolute right-0 top-1/2 -translate-y-1/2 text-right",
                useDesktopLayout ? "block" : "hidden md:block"
              )}
            >
              <EditableBlockText
                block={mastheadBlocks[2]}
                as="p"
                editable={editable}
                placeholder="Top date"
                onBlockChange={onBlockChange}
                className="text-[11px] font-semibold uppercase tracking-[0.24em] text-stone-600"
              />
            </div>
          </div>

          <div className="mt-5 h-px bg-[#b4372f]" />
        </header>

        <div className={useDesktopLayout ? "px-10 pb-8 pt-5" : "px-4 pb-6 pt-4 sm:px-6 lg:px-10 lg:pb-8 lg:pt-5"}>
          <EditableBlockText
            block={getBlock(blocks, "headline")}
            as="h2"
            editable={editable}
            placeholder="Main headline"
            onBlockChange={onBlockChange}
            className={
              useDesktopLayout
                ? "mb-6 text-[3.6rem] font-bold leading-[0.94] tracking-[-0.045em] text-stone-950"
                : "mb-6 text-[2.2rem] font-bold leading-[0.96] tracking-[-0.04em] text-stone-950 sm:text-[2.9rem] lg:text-[3.6rem] lg:leading-[0.94] lg:tracking-[-0.045em]"
            }
          />

          <div className={useDesktopLayout ? "grid grid-cols-[0.95fr_2.15fr_1.02fr] gap-6" : "grid grid-cols-1 gap-5 lg:grid-cols-[0.95fr_2.15fr_1.02fr] lg:gap-6"}>
            <section className="border-t border-b border-stone-400 py-4">
              <EditableBlockText
                block={getBlock(blocks, "leftSummary")}
                as="p"
                editable={editable}
                placeholder="Short summary"
                onBlockChange={onBlockChange}
                className={
                  useDesktopLayout
                    ? "text-[1.9rem] leading-[1.08] tracking-[-0.03em] text-stone-900"
                    : "text-[1.55rem] leading-[1.08] tracking-[-0.03em] text-stone-900 sm:text-[1.75rem] lg:text-[1.9rem]"
                }
              />

              <div className="my-4 h-px bg-stone-300" />

              <EditableBlockText
                block={leftMetaBlocks[0]}
                as="p"
                editable={editable}
                placeholder="Location"
                onBlockChange={onBlockChange}
                className="text-[12px] font-semibold uppercase tracking-[0.16em] text-stone-700"
              />

              <div className="mt-5 space-y-4">
                {leftParagraphBlocks.map((block, index) => (
                  <EditableBlockText
                    key={block.id}
                    block={block}
                    as="p"
                    editable={editable}
                    placeholder="Left article paragraph"
                    onBlockChange={onBlockChange}
                    controls={
                      BLOCK_CONTROLLABLE_SECTIONS.has(block.section) ? (
                        <>
                          <BlockActionButton
                            label="Up"
                            onClick={() => onMoveBlock?.(block.id, "up")}
                            disabled={!canMoveBlock(blocks, block.id, "up")}
                          />
                          <BlockActionButton
                            label="Down"
                            onClick={() => onMoveBlock?.(block.id, "down")}
                            disabled={!canMoveBlock(blocks, block.id, "down")}
                          />
                          <BlockActionButton
                            label="Delete"
                            onClick={() => onDeleteBlock?.(block.id)}
                            disabled={!canDeleteBlock(blocks, block)}
                          />
                        </>
                      ) : null
                    }
                    className={joinClasses(
                      useDesktopLayout
                        ? "text-justify text-[14px] leading-[1.65] text-stone-900"
                        : "text-justify text-[13px] leading-[1.65] text-stone-900 sm:text-[14px]",
                      index === 0 &&
                      "first-letter:float-left first-letter:mr-2 first-letter:text-[3rem] first-letter:font-bold first-letter:leading-[0.78] first-letter:text-stone-950"
                    )}
                  />
                ))}
              </div>

              <EditableBlockText
                block={getBlock(blocks, "leftSubheading")}
                as="h3"
                editable={editable}
                placeholder="Highlighted subheading"
                onBlockChange={onBlockChange}
                className="mt-5 text-[1.45rem] font-bold leading-tight text-stone-950"
              />

              {editable ? (
                <AddParagraphButton
                  label="Add left paragraph"
                  onClick={() => onAddBlock?.("leftParagraph")}
                />
              ) : null}
            </section>

            <section>
              {editable ? (
                <div className="mb-3 border border-dashed border-stone-300 bg-white/45 px-3 py-2">
                  <p
                    className="mb-1 text-[10px] font-semibold uppercase tracking-[0.24em] text-stone-500"
                    style={{ fontFamily: META_FONT }}
                  >
                    Featured image URL
                  </p>
                  <input
                    type="url"
                    value={featuredImage ?? ""}
                    onChange={(event) => onImageChange?.(event.target.value)}
                    placeholder="Paste image URL"
                    className="w-full border-none bg-transparent p-0 text-[13px] text-stone-700 outline-none placeholder:text-stone-400"
                    style={{ fontFamily: META_FONT }}
                  />
                </div>
              ) : null}

              <figure>
                <div className="overflow-hidden border border-stone-400 bg-stone-100">
                  <img
                    src={imageSource}
                    alt="Editorial feature"
                    className={useDesktopLayout ? "h-[320px] w-full object-cover object-center" : "h-[240px] w-full object-cover object-center sm:h-[300px] lg:h-[320px]"}
                  />
                </div>

                <EditableBlockText
                  block={getBlock(blocks, "imageCaption")}
                  as="figcaption"
                  editable={editable}
                  placeholder="Image caption"
                  onBlockChange={onBlockChange}
                  className="mt-3 border-b border-stone-300 pb-3 text-[13px] leading-[1.5] text-stone-700"
                />
              </figure>
            </section>

            <aside className="border border-stone-300 bg-[#fcfaf4] p-4">
              <EditableBlockText
                block={getBlock(blocks, "rightTitle")}
                as="h3"
                editable={editable}
                placeholder="Sidebar title"
                onBlockChange={onBlockChange}
                className={
                  useDesktopLayout
                    ? "text-[1.75rem] font-bold leading-none text-stone-950"
                    : "text-[1.5rem] font-bold leading-none text-stone-950 sm:text-[1.65rem] lg:text-[1.75rem]"
                }
              />

              <div className="mt-4 space-y-3">
                {rightParagraphBlocks.map((block) => (
                  <EditableBlockText
                    key={block.id}
                    block={block}
                    as="p"
                    editable={editable}
                    placeholder="Sidebar paragraph or names"
                    onBlockChange={onBlockChange}
                    controls={
                      BLOCK_CONTROLLABLE_SECTIONS.has(block.section) ? (
                        <>
                          <BlockActionButton
                            label="Up"
                            onClick={() => onMoveBlock?.(block.id, "up")}
                            disabled={!canMoveBlock(blocks, block.id, "up")}
                          />
                          <BlockActionButton
                            label="Down"
                            onClick={() => onMoveBlock?.(block.id, "down")}
                            disabled={!canMoveBlock(blocks, block.id, "down")}
                          />
                          <BlockActionButton
                            label="Delete"
                            onClick={() => onDeleteBlock?.(block.id)}
                            disabled={!canDeleteBlock(blocks, block)}
                          />
                        </>
                      ) : null
                    }
                    className="text-[13px] leading-[1.55] text-stone-900"
                  />
                ))}
              </div>

              {editable ? (
                <AddParagraphButton
                  label="Add sidebar paragraph"
                  onClick={() => onAddBlock?.("rightParagraph")}
                />
              ) : null}
            </aside>
          </div>

          <div className={useDesktopLayout ? "mt-8 grid grid-cols-[1.08fr_1.32fr_1fr] gap-6 border-t border-stone-300 pt-6" : "mt-8 grid grid-cols-1 gap-5 border-t border-stone-300 pt-6 md:grid-cols-2 xl:grid-cols-[1.08fr_1.32fr_1fr] xl:gap-6"}>
            <section className={useDesktopLayout ? "" : "md:col-span-2 xl:col-span-1"}>
              <div className="border-l-4 border-[#c64b3f] bg-[#efe6d8] px-5 py-5">
                <p className="text-[4.2rem] leading-[0.65] text-[#c64b3f]">&ldquo;</p>
                <EditableBlockText
                  block={getBlock(blocks, "bottomQuote")}
                  as="p"
                  editable={editable}
                  placeholder="Quote or testimonial"
                  onBlockChange={onBlockChange}
                  className={
                    useDesktopLayout
                      ? "-mt-1 text-[1.7rem] leading-[1.08] text-stone-950"
                      : "-mt-1 text-[1.35rem] leading-[1.08] text-stone-950 sm:text-[1.55rem] lg:text-[1.7rem]"
                  }
                />
              </div>
            </section>

            <section>
              <div className="space-y-4">
                {bottomParagraphBlocks.map((block) => (
                  <EditableBlockText
                    key={block.id}
                    block={block}
                    as="p"
                    editable={editable}
                    placeholder="Continuation paragraph"
                    onBlockChange={onBlockChange}
                    controls={
                      BLOCK_CONTROLLABLE_SECTIONS.has(block.section) ? (
                        <>
                          <BlockActionButton
                            label="Up"
                            onClick={() => onMoveBlock?.(block.id, "up")}
                            disabled={!canMoveBlock(blocks, block.id, "up")}
                          />
                          <BlockActionButton
                            label="Down"
                            onClick={() => onMoveBlock?.(block.id, "down")}
                            disabled={!canMoveBlock(blocks, block.id, "down")}
                          />
                          <BlockActionButton
                            label="Delete"
                            onClick={() => onDeleteBlock?.(block.id)}
                            disabled={!canDeleteBlock(blocks, block)}
                          />
                        </>
                      ) : null
                    }
                    className="text-justify text-[14px] leading-[1.68] text-stone-900"
                  />
                ))}
              </div>

              {editable ? (
                <AddParagraphButton
                  label="Add lower paragraph"
                  onClick={() => onAddBlock?.("bottomParagraph")}
                />
              ) : null}
            </section>

            <section>
              <EditableBlockText
                block={getBlock(blocks, "bottomRightTitle")}
                as="h3"
                editable={editable}
                placeholder="Reaction title"
                onBlockChange={onBlockChange}
                className="text-[1.8rem] font-bold leading-[1] text-stone-950"
              />

              <div className="mt-3 space-y-4">
                {bottomRightParagraphBlocks.map((block) => (
                  <EditableBlockText
                    key={block.id}
                    block={block}
                    as="p"
                    editable={editable}
                    placeholder="Authority or reaction paragraph"
                    onBlockChange={onBlockChange}
                    controls={
                      BLOCK_CONTROLLABLE_SECTIONS.has(block.section) ? (
                        <>
                          <BlockActionButton
                            label="Up"
                            onClick={() => onMoveBlock?.(block.id, "up")}
                            disabled={!canMoveBlock(blocks, block.id, "up")}
                          />
                          <BlockActionButton
                            label="Down"
                            onClick={() => onMoveBlock?.(block.id, "down")}
                            disabled={!canMoveBlock(blocks, block.id, "down")}
                          />
                          <BlockActionButton
                            label="Delete"
                            onClick={() => onDeleteBlock?.(block.id)}
                            disabled={!canDeleteBlock(blocks, block)}
                          />
                        </>
                      ) : null
                    }
                    className="text-justify text-[14px] leading-[1.68] text-stone-900"
                  />
                ))}
              </div>

              {editable ? (
                <AddParagraphButton
                  label="Add reaction paragraph"
                  onClick={() => onAddBlock?.("bottomRightParagraph")}
                />
              ) : null}
            </section>
          </div>

          <footer className="mt-8 border-t border-stone-300 pt-3">
            <div className="flex flex-wrap items-center justify-center gap-3 text-center">
              {footerBlocks.map((block, index) => (
                <div key={block.id} className="flex items-center gap-3">
                  <EditableBlockText
                    block={block}
                    as="p"
                    editable={editable}
                    placeholder="Footer text"
                    onBlockChange={onBlockChange}
                    className="text-[11px] font-medium tracking-[0.06em] text-stone-600"
                  />
                  {index < footerBlocks.length - 1 ? <span className="h-3 w-px bg-stone-300" /> : null}
                </div>
              ))}
            </div>
          </footer>
        </div>
      </article>

      <style jsx>{`
        article {
          font-family: ${BODY_FONT};
        }

        h1,
        h2,
        h3 {
          font-family: ${HEADLINE_FONT};
        }
      `}</style>
    </div>
  );
}
