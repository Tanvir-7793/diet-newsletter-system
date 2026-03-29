"use client";

import React from "react";
import { NewsletterTemplate } from "@/lib/templates";

interface TemplateCustomizerProps {
  templateName: string;
  onTemplateNameChange: (name: string) => void;
  templateDescription: string;
  onTemplateDescriptionChange: (desc: string) => void;
  config: NewsletterTemplate["config"];
  onConfigChange: (config: NewsletterTemplate["config"]) => void;
}

export function TemplateCustomizer({
  templateName,
  onTemplateNameChange,
  templateDescription,
  onTemplateDescriptionChange,
  config,
  onConfigChange,
}: TemplateCustomizerProps) {
  const updateBackground = (type: "color" | "gradient" | "image", value: string) => {
    onConfigChange({
      ...config,
      background: { ...config.background, type, value },
    });
  };

  const updateTitlePosition = (key: string, value: any) => {
    onConfigChange({
      ...config,
      layout: {
        ...config.layout,
        titlePosition: { ...config.layout.titlePosition, [key]: value },
      },
    });
  };

  const updateContentPosition = (key: string, value: any) => {
    onConfigChange({
      ...config,
      layout: {
        ...config.layout,
        contentPosition: { ...config.layout.contentPosition, [key]: value },
      },
    });
  };

  return (
    <div className="space-y-6 bg-white p-4 sm:p-6 rounded-lg shadow-lg">
      {/* Template Name & Description */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Template Info</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Template Name
            </label>
            <input
              type="text"
              value={templateName}
              onChange={(e) => onTemplateNameChange(e.target.value)}
              placeholder="My Custom Template"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <input
              type="text"
              value={templateDescription}
              onChange={(e) => onTemplateDescriptionChange(e.target.value)}
              placeholder="Describe your template design"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>
        </div>
      </div>

      {/* Background Customizer */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Background</h3>
        <div className="space-y-3">
          <div>
            <label className="flex items-center">
              <input
                type="radio"
                name="bg-type"
                checked={config.background.type === "color"}
                onChange={() => updateBackground("color", "#ffffff")}
                className="mr-2"
              />
              <span className="text-sm font-medium text-gray-700">Solid Color</span>
            </label>
            {config.background.type === "color" && (
              <div className="mt-2 flex items-center gap-2">
                <input
                  type="color"
                  value={config.background.value}
                  onChange={(e) => updateBackground("color", e.target.value)}
                  className="w-12 h-10 rounded cursor-pointer"
                />
                <span className="text-sm text-gray-600">{config.background.value}</span>
              </div>
            )}
          </div>

          <div>
            <label className="flex items-center">
              <input
                type="radio"
                name="bg-type"
                checked={config.background.type === "gradient"}
                onChange={() => updateBackground("gradient", "linear-gradient(135deg, #3B82F6 0%, #9333EA 100%)")}
                className="mr-2"
              />
              <span className="text-sm font-medium text-gray-700">Gradient</span>
            </label>
            {config.background.type === "gradient" && (
              <div className="mt-2">
                <input
                  type="text"
                  value={config.background.value}
                  onChange={(e) => updateBackground("gradient", e.target.value)}
                  placeholder="linear-gradient(135deg, #3B82F6 0%, #9333EA 100%)"
                  className="w-full px-3 py-2 text-xs border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>
            )}
          </div>

          <div>
            <label className="flex items-center">
              <input
                type="radio"
                name="bg-type"
                checked={config.background.type === "image"}
                onChange={() => updateBackground("image", "")}
                className="mr-2"
              />
              <span className="text-sm font-medium text-gray-700">Image</span>
            </label>
            {config.background.type === "image" && (
              <div className="mt-2">
                <input
                  type="text"
                  value={config.background.value}
                  onChange={(e) => updateBackground("image", e.target.value)}
                  placeholder="https://example.com/image.jpg"
                  className="w-full px-3 py-2 text-xs border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Title Customization */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Title Styling</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Font Size: {config.layout.titlePosition.fontSize}
            </label>
            <input
              type="range"
              min="20"
              max="60"
              value={parseInt(config.layout.titlePosition.fontSize) || 32}
              onChange={(e) => updateTitlePosition("fontSize", `text-${e.target.value}`)}
              className="w-full"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Color</label>
            <div className="flex gap-2">
              {["text-white", "text-black", "text-blue-600", "text-gray-900"].map((color) => (
                <button
                  key={color}
                  onClick={() => updateTitlePosition("color", color)}
                  className={`px-3 py-2 text-xs rounded border-2 font-medium ${
                    config.layout.titlePosition.color === color
                      ? "border-blue-500 bg-blue-50"
                      : "border-gray-300"
                  }`}
                >
                  {color.split("-").pop()}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Alignment</label>
            <div className="flex gap-2">
              {["left", "center", "right"].map((align) => (
                <button
                  key={align}
                  onClick={() => updateTitlePosition("textAlign", align)}
                  className={`px-4 py-2 text-sm rounded border-2 font-medium ${
                    config.layout.titlePosition.textAlign === align
                      ? "border-blue-500 bg-blue-50"
                      : "border-gray-300"
                  }`}
                >
                  {align.charAt(0).toUpperCase() + align.slice(1)}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Font Weight</label>
            <div className="flex gap-2">
              {["font-normal", "font-bold", "font-black"].map((weight) => (
                <button
                  key={weight}
                  onClick={() => updateTitlePosition("fontWeight", weight)}
                  className={`px-4 py-2 text-sm rounded border-2 font-medium ${
                    config.layout.titlePosition.fontWeight === weight
                      ? "border-blue-500 bg-blue-50"
                      : "border-gray-300"
                  }`}
                >
                  {weight.replace("font-", "").charAt(0).toUpperCase() + weight.replace("font-", "").slice(1)}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Content Customization */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Content Styling</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Color</label>
            <div className="flex gap-2">
              {["text-white", "text-black", "text-gray-700", "text-gray-900"].map((color) => (
                <button
                  key={color}
                  onClick={() => updateContentPosition("color", color)}
                  className={`px-3 py-2 text-xs rounded border-2 font-medium ${
                    config.layout.contentPosition.color === color
                      ? "border-blue-500 bg-blue-50"
                      : "border-gray-300"
                  }`}
                >
                  {color.split("-").pop()}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Alignment</label>
            <div className="flex gap-2">
              {["left", "center", "right", "justify"].map((align) => (
                <button
                  key={align}
                  onClick={() => updateContentPosition("textAlign", align)}
                  className={`px-4 py-2 text-sm rounded border-2 font-medium ${
                    config.layout.contentPosition.textAlign === align
                      ? "border-blue-500 bg-blue-50"
                      : "border-gray-300"
                  }`}
                >
                  {align.charAt(0).toUpperCase() + align.slice(1)}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
