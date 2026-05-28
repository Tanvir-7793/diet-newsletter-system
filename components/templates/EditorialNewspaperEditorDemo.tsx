"use client";

import { useEffect, useRef, useState } from "react";
import * as htmlToImage from "html-to-image";
import {
  EditorialNewspaperTemplate,
  buildEditorialBlocksFromData,
  createSampleEditorialNewsletterData,
  type NewsletterData,
} from "@/components/templates/EditorialNewspaperTemplate";

const LOCAL_STORAGE_KEY = "editorial-newspaper-draft";
const PREVIEW_CANVAS_WIDTH = 1080;

type ArrayFieldKey = "leftParagraphs" | "rightContent" | "bottomParagraphs" | "bottomRightParagraphs";

function normalizeParagraphs(text: string) {
  return text
    .split(/\n{2,}/)
    .map((paragraph) => paragraph.replace(/\s+/g, " ").trim())
    .filter(Boolean);
}

function trimWords(text: string, limit: number) {
  const words = text.split(/\s+/).filter(Boolean);
  return words.length <= limit ? text : `${words.slice(0, limit).join(" ")}...`;
}

function FieldLabel({ children }: { children: React.ReactNode }) {
  return <label className="mb-1 block text-[11px] font-semibold uppercase tracking-[0.18em] text-stone-600">{children}</label>;
}

function TextField({ value, onChange, placeholder }: { value: string; onChange: (value: string) => void; placeholder?: string }) {
  return (
    <input
      type="text"
      value={value}
      onChange={(event) => onChange(event.target.value)}
      placeholder={placeholder}
      className="w-full border border-stone-300 bg-white/75 px-3 py-2 text-[14px] text-stone-900 outline-none transition placeholder:text-stone-400 focus:border-stone-500"
    />
  );
}

function TextAreaField({
  value,
  onChange,
  placeholder,
  rows = 3,
}: {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  rows?: number;
}) {
  return (
    <textarea
      value={value}
      onChange={(event) => onChange(event.target.value)}
      placeholder={placeholder}
      rows={rows}
      className="w-full resize-y border border-stone-300 bg-white/75 px-3 py-2 text-[14px] leading-6 text-stone-900 outline-none transition placeholder:text-stone-400 focus:border-stone-500"
    />
  );
}

function ArrayFieldEditor({
  label,
  values,
  onChange,
  onAdd,
  onRemove,
  onMove,
  placeholder,
}: {
  label: string;
  values: string[];
  onChange: (index: number, value: string) => void;
  onAdd: () => void;
  onRemove: (index: number) => void;
  onMove: (index: number, direction: "up" | "down") => void;
  placeholder: string;
}) {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <FieldLabel>{label}</FieldLabel>
        <button type="button" onClick={onAdd} className="border border-dashed border-stone-400 px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-stone-600 transition hover:border-stone-700 hover:text-stone-900">
          Add paragraph
        </button>
      </div>
      <div className="space-y-3">
        {values.map((value, index) => (
          <div key={`${label}-${index}`} className="border border-stone-200 bg-[#fcfaf4] p-3">
            <TextAreaField value={value} onChange={(nextValue) => onChange(index, nextValue)} placeholder={placeholder} rows={4} />
            <div className="mt-3 flex flex-wrap gap-2">
              <button type="button" onClick={() => onMove(index, "up")} disabled={index === 0} className="border border-stone-300 px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-stone-600 transition hover:border-stone-700 hover:text-stone-900 disabled:cursor-not-allowed disabled:opacity-35">Up</button>
              <button type="button" onClick={() => onMove(index, "down")} disabled={index === values.length - 1} className="border border-stone-300 px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-stone-600 transition hover:border-stone-700 hover:text-stone-900 disabled:cursor-not-allowed disabled:opacity-35">Down</button>
              <button type="button" onClick={() => onRemove(index)} disabled={values.length === 1} className="border border-stone-300 px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-red-700 transition hover:border-red-500 hover:text-red-800 disabled:cursor-not-allowed disabled:opacity-35">Remove</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function EditorialNewspaperEditorDemo() {
  const [data, setData] = useState<NewsletterData>(() => createSampleEditorialNewsletterData());
  const [statusMessage, setStatusMessage] = useState("");
  const [isExportingPng, setIsExportingPng] = useState(false);
  const [isPrintingPdf, setIsPrintingPdf] = useState(false);
  const previewRef = useRef<HTMLDivElement>(null);
  const previewViewportRef = useRef<HTMLDivElement>(null);
  const previewCanvasRef = useRef<HTMLDivElement>(null);
  const [previewScale, setPreviewScale] = useState(1);
  const [previewHeight, setPreviewHeight] = useState(0);

  const updateField = <K extends keyof NewsletterData>(field: K, value: NewsletterData[K]) => {
    setData((current) => ({ ...current, [field]: value }));
  };

  const updateArrayItem = (field: ArrayFieldKey, index: number, value: string) => {
    setData((current) => ({
      ...current,
      [field]: current[field].map((item, itemIndex) => (itemIndex === index ? value : item)),
    }));
  };

  const addArrayItem = (field: ArrayFieldKey, placeholder: string) => {
    setData((current) => ({ ...current, [field]: [...current[field], placeholder] }));
  };

  const removeArrayItem = (field: ArrayFieldKey, index: number) => {
    setData((current) => {
      if (current[field].length <= 1) {
        return current;
      }

      return { ...current, [field]: current[field].filter((_, itemIndex) => itemIndex !== index) };
    });
  };

  const moveArrayItem = (field: ArrayFieldKey, index: number, direction: "up" | "down") => {
    setData((current) => {
      const items = [...current[field]];
      const nextIndex = direction === "up" ? index - 1 : index + 1;

      if (nextIndex < 0 || nextIndex >= items.length) {
        return current;
      }

      [items[index], items[nextIndex]] = [items[nextIndex], items[index]];
      return { ...current, [field]: items };
    });
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    const reader = new FileReader();
    reader.onload = (loadEvent) => {
      if (typeof loadEvent.target?.result === "string") {
        updateField("image", loadEvent.target.result);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleReset = () => {
    setData(createSampleEditorialNewsletterData());
    setStatusMessage("Sample newspaper data restored.");
  };

  const handleSaveDraft = () => {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(data));
    setStatusMessage("Draft saved locally on this device.");
  };

  const handleLoadDraft = () => {
    const stored = localStorage.getItem(LOCAL_STORAGE_KEY);

    if (!stored) {
      setStatusMessage("No saved draft found on this device.");
      return;
    }

    try {
      setData(JSON.parse(stored) as NewsletterData);
      setStatusMessage("Saved draft loaded.");
    } catch {
      setStatusMessage("Saved draft could not be loaded.");
    }
  };

  useEffect(() => {
    const viewport = previewViewportRef.current;
    const canvas = previewCanvasRef.current;

    if (!viewport || !canvas) {
      return;
    }

    const updatePreviewScale = () => {
      const nextScale = Math.min(1, viewport.clientWidth / PREVIEW_CANVAS_WIDTH);
      const nextHeight = canvas.scrollHeight || canvas.offsetHeight || 0;

      setPreviewScale((current) => (Math.abs(current - nextScale) < 0.001 ? current : nextScale));
      setPreviewHeight((current) => (Math.abs(current - nextHeight * nextScale) < 1 ? current : nextHeight * nextScale));
    };

    updatePreviewScale();

    if (typeof ResizeObserver !== "undefined") {
      const resizeObserver = new ResizeObserver(() => updatePreviewScale());
      resizeObserver.observe(viewport);
      resizeObserver.observe(canvas);

      return () => {
        resizeObserver.disconnect();
      };
    }

    window.addEventListener("resize", updatePreviewScale);
    return () => {
      window.removeEventListener("resize", updatePreviewScale);
    };
  }, []);

  const getCaptureElement = () => {
    return (previewRef.current?.querySelector("[data-preview-container]") as HTMLDivElement | null) || previewRef.current;
  };

  const renderPreviewImage = async () => {
    const captureElement = getCaptureElement();

    if (!captureElement) {
      throw new Error("Preview element not found");
    }

    const width = captureElement.scrollWidth || captureElement.offsetWidth;
    const height = captureElement.scrollHeight || captureElement.offsetHeight;

    return htmlToImage.toPng(captureElement, {
      backgroundColor: "#f8f4eb",
      pixelRatio: 2,
      width,
      height,
      style: { overflow: "visible", width: `${width}px`, height: `${height}px` },
    });
  };

  const handleExportPng = async () => {
    setIsExportingPng(true);

    try {
      const dataUrl = await renderPreviewImage();
      const uploadPromise = fetch('/api/upload', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          image: dataUrl,
          title: data.headline,
          type: 'download',
        }),
      });

      const link = document.createElement("a");
      link.download = `${data.headline.replace(/[^a-zA-Z0-9]/g, "_").toLowerCase() || "newspaper"}-newsletter.png`;
      link.href = dataUrl;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      const uploadResponse = await uploadPromise;

      if (!uploadResponse.ok) {
        throw new Error('Cloudinary upload failed');
      }

      await uploadResponse.json();
      setStatusMessage("PNG downloaded and saved to Cloudinary.");
    } catch (error) {
      console.error(error);
      setStatusMessage("PNG export failed. Please try again.");
    } finally {
      setIsExportingPng(false);
    }
  };

  const handleExportPdf = async () => {
    setIsPrintingPdf(true);

    try {
      const dataUrl = await renderPreviewImage();
      const printWindow = window.open("", "_blank", "noopener,noreferrer,width=1200,height=900");

      if (!printWindow) {
        throw new Error("Print window blocked");
      }

      printWindow.document.write(`<html><head><title>${data.headline}</title><style>body{margin:0;background:#f8f4eb;display:flex;justify-content:center;align-items:flex-start;}img{width:100%;max-width:1100px;display:block;}@page{size:A4 landscape;margin:12mm;}</style></head><body><img src="${dataUrl}" alt="Editorial newspaper preview" /><script>window.onload=()=>window.print();</script></body></html>`);
      printWindow.document.close();
      setStatusMessage("PDF print dialog opened.");
    } catch (error) {
      console.error(error);
      setStatusMessage("PDF export failed. Please try again.");
    } finally {
      setIsPrintingPdf(false);
    }
  };

  const previewBlocks = buildEditorialBlocksFromData(data);

  return (
    <div className="min-h-screen bg-[#e6ddcf]">
      <div className="mx-auto max-w-375 px-3 py-4 sm:px-4 sm:py-6">
        <header className="mb-6 border border-stone-400 bg-[#f8f4eb] px-5 py-4 shadow-[0_12px_26px_rgba(70,53,35,0.08)]">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-stone-500">Newspaper Template</p>
              <h1 className="mt-1 text-[1.95rem] leading-none text-stone-950">Editorial newsletter builder</h1>
            </div>
            <div className="flex flex-wrap gap-2">
              <button type="button" onClick={handleSaveDraft} className="border border-stone-300 px-3 py-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-stone-700 transition hover:border-stone-700 hover:bg-white/70">Save draft</button>
              <button type="button" onClick={handleLoadDraft} className="border border-stone-300 px-3 py-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-stone-700 transition hover:border-stone-700 hover:bg-white/70">Load draft</button>
              <button type="button" onClick={handleReset} className="border border-stone-300 px-3 py-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-stone-700 transition hover:border-stone-700 hover:bg-white/70">Reset sample</button>
              <button type="button" onClick={handleExportPng} disabled={isExportingPng} className="border border-stone-500 bg-white px-3 py-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-stone-900 transition hover:bg-stone-100 disabled:cursor-not-allowed disabled:opacity-50">{isExportingPng ? "Exporting PNG..." : "Export PNG"}</button>
              <button type="button" onClick={handleExportPdf} disabled={isPrintingPdf} className="border border-stone-500 bg-white px-3 py-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-stone-900 transition hover:bg-stone-100 disabled:cursor-not-allowed disabled:opacity-50">{isPrintingPdf ? "Preparing PDF..." : "Export PDF"}</button>
            </div>
          </div>
          <p className="mt-3 text-[13px] leading-6 text-stone-600">Faculty edit the story in the left panel and see a fixed newspaper-style preview on the right. The layout stays locked like a real printed editorial page.</p>
          {statusMessage ? <p className="mt-3 text-[12px] font-medium uppercase tracking-[0.16em] text-stone-500">{statusMessage}</p> : null}
        </header>

        <div className="grid gap-6 lg:grid-cols-[360px_minmax(0,1fr)] xl:grid-cols-[390px_minmax(0,1fr)]">
          <div className="space-y-5">
            <section className="border border-stone-400 bg-[#f8f4eb] p-4 shadow-[0_10px_24px_rgba(70,53,35,0.06)]">
              <div className="grid gap-4">
                <div className="grid grid-cols-1 gap-4 md:grid-cols-3 xl:grid-cols-1">
                  <div><FieldLabel>Masthead</FieldLabel><TextField value={data.masthead} onChange={(value) => updateField("masthead", value)} /></div>
                  <div><FieldLabel>Edition</FieldLabel><TextField value={data.edition} onChange={(value) => updateField("edition", value)} /></div>
                  <div><FieldLabel>Date</FieldLabel><TextField value={data.date} onChange={(value) => updateField("date", value)} /></div>
                </div>
                <div><FieldLabel>Headline</FieldLabel><TextAreaField value={data.headline} onChange={(value) => updateField("headline", value)} rows={3} /></div>
                <div><FieldLabel>Summary</FieldLabel><TextAreaField value={data.summary} onChange={(value) => updateField("summary", value)} rows={3} /></div>
                <div className="grid grid-cols-1 gap-4 xl:grid-cols-1">
                  <div><FieldLabel>Location</FieldLabel><TextField value={data.location} onChange={(value) => updateField("location", value)} /></div>
                </div>
                <ArrayFieldEditor label="Left column paragraphs" values={data.leftParagraphs} onChange={(index, value) => updateArrayItem("leftParagraphs", index, value)} onAdd={() => addArrayItem("leftParagraphs", "Add a new newspaper paragraph here.")} onRemove={(index) => removeArrayItem("leftParagraphs", index)} onMove={(index, direction) => moveArrayItem("leftParagraphs", index, direction)} placeholder="Write a left-column paragraph..." />
                <div><FieldLabel>Subheading</FieldLabel><TextField value={data.subheading} onChange={(value) => updateField("subheading", value)} /></div>
              </div>
            </section>

            <section className="border border-stone-400 bg-[#f8f4eb] p-4 shadow-[0_10px_24px_rgba(70,53,35,0.06)]">
              <div className="space-y-4">
                <div>
                  <FieldLabel>Featured image upload</FieldLabel>
                  <label className="flex cursor-pointer items-center justify-center border border-dashed border-stone-400 bg-white/70 px-4 py-6 text-center text-[12px] font-semibold uppercase tracking-[0.18em] text-stone-600 transition hover:border-stone-700 hover:text-stone-900">
                    <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                    Upload image
                  </label>
                </div>
                {data.image ? <div className="overflow-hidden border border-stone-300 bg-white"><img src={data.image} alt="Selected preview" className="h-40 w-full object-cover object-center" /></div> : null}
                <div><FieldLabel>Image caption</FieldLabel><TextAreaField value={data.imageCaption} onChange={(value) => updateField("imageCaption", value)} rows={3} /></div>
                <div><FieldLabel>Sidebar title</FieldLabel><TextField value={data.rightTitle} onChange={(value) => updateField("rightTitle", value)} /></div>
                <ArrayFieldEditor label="Sidebar content" values={data.rightContent} onChange={(index, value) => updateArrayItem("rightContent", index, value)} onAdd={() => addArrayItem("rightContent", "Add another student list or highlight paragraph here.")} onRemove={(index) => removeArrayItem("rightContent", index)} onMove={(index, direction) => moveArrayItem("rightContent", index, direction)} placeholder="Write sidebar names or highlights..." />
              </div>
            </section>

            <section className="border border-stone-400 bg-[#f8f4eb] p-4 shadow-[0_10px_24px_rgba(70,53,35,0.06)]">
              <div className="space-y-4">
                <div><FieldLabel>Quote block</FieldLabel><TextAreaField value={data.quote} onChange={(value) => updateField("quote", value)} rows={4} /></div>
                <ArrayFieldEditor label="Bottom paragraphs" values={data.bottomParagraphs} onChange={(index, value) => updateArrayItem("bottomParagraphs", index, value)} onAdd={() => addArrayItem("bottomParagraphs", "Add another lower article paragraph here.")} onRemove={(index) => removeArrayItem("bottomParagraphs", index)} onMove={(index, direction) => moveArrayItem("bottomParagraphs", index, direction)} placeholder="Write continuation paragraphs..." />
                <div><FieldLabel>Authority / reaction title</FieldLabel><TextField value={data.bottomRightTitle} onChange={(value) => updateField("bottomRightTitle", value)} /></div>
                <ArrayFieldEditor label="Authority / reaction paragraphs" values={data.bottomRightParagraphs} onChange={(index, value) => updateArrayItem("bottomRightParagraphs", index, value)} onAdd={() => addArrayItem("bottomRightParagraphs", "Add another authority or reaction paragraph here.")} onRemove={(index) => removeArrayItem("bottomRightParagraphs", index)} onMove={(index, direction) => moveArrayItem("bottomRightParagraphs", index, direction)} placeholder="Write authority or reaction text..." />
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-1">
                  {["Location", "Page number", "Footer date"].map((label, index) => (
                    <div key={label}>
                      <FieldLabel>{label}</FieldLabel>
                      <TextField value={data.footer[index] || ""} onChange={(value) => updateField("footer", data.footer.map((item, itemIndex) => (itemIndex === index ? value : item)))} />
                    </div>
                  ))}
                </div>
              </div>
            </section>
          </div>

          <div className="lg:sticky lg:top-6 h-fit">
            <div className="overflow-hidden border border-stone-400 bg-[#f8f4eb] p-3 sm:p-4 shadow-[0_12px_26px_rgba(70,53,35,0.08)]" ref={previewRef}>
              <div className="mb-4 flex items-center justify-between gap-3 border-b border-stone-300 pb-3">
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-stone-500">Live preview</p>
                  <p className="mt-1 text-[13px] text-stone-600">Desktop newspaper proportions are preserved on mobile and scaled down for a consistent preview.</p>
                </div>
              </div>
              <div ref={previewViewportRef} className="w-full overflow-hidden">
                <div className="flex justify-center" style={{ height: previewHeight ? `${previewHeight}px` : undefined }}>
                  <div
                    ref={previewCanvasRef}
                    className="shrink-0"
                    style={{
                      width: `${PREVIEW_CANVAS_WIDTH}px`,
                      transform: `scale(${previewScale})`,
                      transformOrigin: "top center",
                    }}
                  >
                    <EditorialNewspaperTemplate
                      blocks={previewBlocks}
                      featuredImage={data.image}
                      preserveDesktopLayout
                    />
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
