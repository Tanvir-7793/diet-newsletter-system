"use client";

import React, { useEffect, useRef, useState } from "react";
import "quill/dist/quill.snow.css";

interface QuillEditorProps {
  value: string;
  onChange: (content: string) => void;
  placeholder?: string;
}

export function QuillEditor({
  value,
  onChange,
  placeholder = "Write your newsletter content...",
}: QuillEditorProps) {
  const quillRef = useRef<HTMLDivElement>(null);
  const quillInstanceRef = useRef<any>(null);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!isClient || !quillRef.current || quillInstanceRef.current) return;

    // Dynamically import Quill only on client side
    import("quill").then((QuillModule) => {
      const Quill = QuillModule.default;

      const quill = new Quill(quillRef.current!, {
        theme: "snow",
        placeholder: placeholder,
        modules: {
          toolbar: [
            ["bold", "italic", "underline"],
            ["list", { list: "ordered" }, { list: "bullet" }],
            [{ header: [1, 2, 3, false] }],
            ["link"],
            ["clean"],
          ],
        },
      });

      quillInstanceRef.current = quill;

      // Set initial value
      if (value) {
        quill.root.innerHTML = value;
      }

      // Handle changes
      quill.on("text-change", () => {
        const html = quill.root.innerHTML;
        onChange(html === "<p><br></p>" ? "" : html);
      });
    });

    return () => {
      quillInstanceRef.current = null;
    };
  }, [isClient]);

  if (!isClient) {
    return <div className="bg-white border border-gray-300 rounded-lg h-40" />;
  }

  return (
    <div className="space-y-2">
      <div
        ref={quillRef}
        className="bg-white border border-gray-300 rounded-lg overflow-hidden"
        style={{ minHeight: "150px" }}
      />
    </div>
  );
}
