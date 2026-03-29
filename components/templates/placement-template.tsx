"use client";

import { useState } from "react";
import { NewsletterTemplate, StudentCard } from "@/lib/templates";

interface PlacementTemplateProps {
  template: NewsletterTemplate;
  companyName: string;
  students?: StudentCard[];
  className?: string;
  onStudentPositionChange?: (studentId: string, gridCol: number, gridRow: number) => void;
  isDraggable?: boolean;
}

export function PlacementTemplate({
  template,
  companyName,
  students = [],
  className = "",
  onStudentPositionChange,
  isDraggable = false
}: PlacementTemplateProps) {
  const [draggingStudentId, setDraggingStudentId] = useState<string | null>(null);

  const GRID_COLS = 6;
  const GRID_ROWS = 4;
  const CELL_WIDTH = 100 / GRID_COLS; // 16.67%
  const CELL_HEIGHT = 100 / GRID_ROWS; // 25%

  const isGridCellOccupied = (gridCol: number, gridRow: number, excludeId?: string) => {
    return students.some(
      s => s.position?.gridCol === gridCol &&
           s.position?.gridRow === gridRow &&
           s.id !== excludeId
    );
  };

  const getDefaultPosition = (index: number) => {
    // Auto-position: fill left-to-right, then next row
    return {
      gridCol: index % GRID_COLS,
      gridRow: Math.floor(index / GRID_COLS)
    };
  };

  const handleMouseDown = (e: React.MouseEvent, studentId: string) => {
    if (!isDraggable) return;
    e.preventDefault();
    setDraggingStudentId(studentId);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!draggingStudentId || !onStudentPositionChange) return;

    const containerRect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    const relativeX = (e.clientX - containerRect.left) / containerRect.width;
    const relativeY = (e.clientY - containerRect.top) / containerRect.height;

    // Calculate nearest grid cell
    let gridCol = Math.round(relativeX * GRID_COLS - 0.5);
    let gridRow = Math.round(relativeY * GRID_ROWS - 0.5);

    // Clamp to grid bounds
    gridCol = Math.max(0, Math.min(GRID_COLS - 1, gridCol));
    gridRow = Math.max(0, Math.min(GRID_ROWS - 1, gridRow));

    // Check for overlap
    if (isGridCellOccupied(gridCol, gridRow, draggingStudentId)) {
      // Skip position update if occupied
      return;
    }

    onStudentPositionChange(draggingStudentId, gridCol, gridRow);
  };

  const handleMouseUp = () => {
    setDraggingStudentId(null);
  };

  const { useState } = require('react');
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

  return (
    <div
      className={`w-full bg-white flex flex-col relative ${className}`}
      style={{
        ...getBackgroundStyle(),
        backgroundSize: 'contain',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center',
        aspectRatio: '210 / 297'
      }}
    >
      {/* Content wrapper - overlays on top of background image */}
      <div className="flex flex-col h-full relative z-20">
        {/* Company name section - below the congratulations text */}
        <div className="text-center px-6 py-52 flex-shrink-0">
          <p className="text-purple-900 text-base font-semibold leading-snug">
            {companyName}
          </p>
        </div>

        {/* Students grid section - fills middle area */}
        <div className="flex-1 overflow-hidden px-6 py-4 flex flex-col items-center justify-center">
          {students.length > 0 ? (
            <div className="grid grid-cols-3 gap-4 auto-rows-max w-full">
              {students.map((student) => (
                <div key={student.id} className="flex flex-col items-center">
                  {/* Circular image with border */}
                  <div className="mb-2 relative">
                    <div className="w-16 h-16 rounded-full border-4 border-blue-900 overflow-hidden bg-yellow-300 flex items-center justify-center">
                      {student.imageUrl ? (
                        <img
                          src={student.imageUrl}
                          alt={student.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-yellow-200 to-yellow-400 flex items-center justify-center">
                          <span className="text-blue-900 text-sm font-bold">
                            {student.name.charAt(0)}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Student info */}
                  <p className="font-bold text-center text-blue-900 text-xs leading-tight">
                    {student.name}
                  </p>
                  <p className="text-center text-gray-700 text-xs mt-0.5">
                    ({student.department})
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex items-center justify-center h-full text-gray-400">
              <p className="text-center text-sm">Add students from editor</p>
            </div>
          )}
        </div>

        {/* Footer - already in background image, just add transparent space */}
        <div className="h-12 flex-shrink-0"></div>
      </div>
    </div>
  );
}
