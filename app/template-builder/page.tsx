"use client";

import { useState } from "react";
import { NewsletterTemplate, saveCustomTemplate, getCustomTemplates, deleteCustomTemplate } from "@/lib/templates";
import { NewsletterPreview } from "@/components/newsletter/newsletter-preview";
import { QuillEditor } from "@/components/newsletter/quill-editor";
import { TemplateCustomizer } from "@/components/newsletter/template-customizer";
import Link from "next/link";

export const dynamic = "force-dynamic";

const defaultConfig: NewsletterTemplate["config"] = {
  background: {
    type: "color",
    value: "#ffffff",
  },
  layout: {
    titlePosition: {
      x: "center-x",
      y: "top-16",
      textAlign: "center",
      fontSize: "text-4xl",
      fontWeight: "font-bold",
      color: "text-black",
    },
    contentPosition: {
      x: "left-8",
      y: "top-36",
      textAlign: "left",
      fontSize: "text-base",
      lineHeight: "leading-relaxed",
      color: "text-gray-800",
    },
    logoPosition: {
      x: "center-x",
      y: "top-8",
      size: "w-16 h-16",
    },
  },
  footer: {
    position: "bottom-right",
    fontSize: "text-xs",
    color: "text-gray-600",
    opacity: 60,
  },
};

export default function TemplateBuilderPage() {
  const [templateName, setTemplateName] = useState("My Custom Template");
  const [templateDescription, setTemplateDescription] = useState(
    "A beautiful custom newsletter template"
  );
  const [config, setConfig] = useState<NewsletterTemplate["config"]>(defaultConfig);
  const [quillContent, setQuillContent] = useState("<p>Your content here...</p>");
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState("");
  const [customTemplates, setCustomTemplates] = useState<NewsletterTemplate[]>(getCustomTemplates());

  const handleSaveTemplate = async () => {
    console.log("Save button clicked"); // Debug log
    console.log("Template name:", templateName);

    if (!templateName.trim()) {
      setSaveMessage("❌ Please enter a template name");
      setTimeout(() => setSaveMessage(""), 3000);
      return;
    }

    setIsSaving(true);
    try {
      console.log("Creating template with config:", config);

      const newTemplate: NewsletterTemplate = {
        id: `custom-builder-${Date.now()}`,
        name: templateName.trim(),
        description: templateDescription.trim(),
        preview: "bg-gradient-to-br from-gray-100 to-gray-200",
        config: config,
      };

      console.log("New template object:", newTemplate);

      // Save to localStorage
      saveCustomTemplate(newTemplate);
      console.log("Template saved successfully");

      setSaveMessage(
        `✅ Template "${templateName}" created successfully! Go to the editor to use it.`
      );

      // Reset form after 3 seconds
      setTimeout(() => {
        setTemplateName("My Custom Template");
        setTemplateDescription("A beautiful custom newsletter template");
        setConfig(defaultConfig);
        setQuillContent("<p>Your content here...</p>");
        setCustomTemplates(getCustomTemplates());
        setSaveMessage("");
      }, 3000);
    } catch (error) {
      console.error("Error saving template:", error);
      setSaveMessage(`❌ Failed to save template: ${error instanceof Error ? error.message : "Unknown error"}`);
      setTimeout(() => setSaveMessage(""), 3000);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteTemplate = (templateId: string) => {
    const template = customTemplates.find(t => t.id === templateId);
    if (!template) return;

    if (confirm(`Are you sure you want to delete "${template.name}"?`)) {
      deleteCustomTemplate(templateId);
      setCustomTemplates(getCustomTemplates());
      setSaveMessage(`✅ Template "${template.name}" deleted successfully!`);
      setTimeout(() => setSaveMessage(""), 3000);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Create Template</h1>
              <p className="text-sm text-gray-600 mt-1">Design a custom newsletter template</p>
            </div>
            <Link
              href="/editor"
              className="inline-flex items-center px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors"
            >
              ← Back to Editor
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Success Message */}
        {saveMessage && (
          <div className={`mb-6 p-4 rounded-lg text-center font-medium ${
            saveMessage.includes("✅")
              ? "bg-green-100 text-green-800"
              : "bg-red-100 text-red-800"
          }`}>
            {saveMessage}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column: Form Controls */}
          <div className="lg:col-span-2 order-2 lg:order-1">
            <TemplateCustomizer
              templateName={templateName}
              onTemplateNameChange={setTemplateName}
              templateDescription={templateDescription}
              onTemplateDescriptionChange={setTemplateDescription}
              config={config}
              onConfigChange={setConfig}
            />

            {/* Content Editor */}
            <div className="mt-6 bg-white p-4 sm:p-6 rounded-lg shadow-lg">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Content (Quill Editor)</h3>
              <QuillEditor
                value={quillContent}
                onChange={setQuillContent}
                placeholder="Write your newsletter content with formatting..."
              />
            </div>

            {/* Action Buttons */}
            <div className="mt-6 flex gap-3">
              <button
                onClick={handleSaveTemplate}
                disabled={isSaving}
                className="flex-1 bg-green-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-green-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {isSaving ? (
                  <>
                    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Saving...
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    Save Template
                  </>
                )}
              </button>
              <Link
                href="/editor"
                className="flex-1 bg-gray-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-gray-700 transition-colors text-center"
              >
                Cancel
              </Link>
            </div>
          </div>

          {/* Right Column: Preview */}
          <div className="lg:col-span-1 order-1 lg:order-2">
            <div className="sticky top-24 bg-white p-4 rounded-lg shadow-lg">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Preview</h3>
              <div className="overflow-auto" style={{ maxHeight: "600px" }}>
                <NewsletterPreview
                  template={{
                    id: "builder-preview",
                    name: templateName,
                    description: templateDescription,
                    preview: "bg-white",
                    config: config,
                  }}
                  title={templateName}
                  content={quillContent.replace(/<[^>]*>/g, "")} // Strip HTML for text
                  fontSize={15}
                  titleFontSize={27}
                  className="w-full"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Custom Templates Section */}
        {customTemplates.length > 0 && (
          <div className="mt-8 bg-white p-6 rounded-lg shadow-lg">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Your Custom Templates</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {customTemplates.map((template) => (
                <div
                  key={template.id}
                  className="p-4 border border-gray-200 rounded-lg hover:border-blue-500 transition-colors"
                >
                  <h4 className="font-semibold text-gray-900">{template.name}</h4>
                  <p className="text-sm text-gray-600 mt-1">{template.description || "No description"}</p>
                  <div className="flex gap-2 mt-4">
                    <button
                      onClick={() => {
                        setTemplateName(template.name);
                        setTemplateDescription(template.description);
                        setConfig(template.config);
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }}
                      className="flex-1 px-3 py-2 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 transition-colors"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteTemplate(template.id)}
                      className="px-3 py-2 bg-red-600 text-white text-sm rounded hover:bg-red-700 transition-colors"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
