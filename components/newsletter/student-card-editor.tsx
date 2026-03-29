"use client";

import { useState } from "react";
import { StudentCard } from "@/lib/templates";

interface StudentCardEditorProps {
  students: StudentCard[];
  onStudentsChange: (students: StudentCard[]) => void;
}

export function StudentCardEditor({
  students,
  onStudentsChange
}: StudentCardEditorProps) {
  const [editingId, setEditingId] = useState<string | null>(null);

  const handleAddStudent = () => {
    const newStudent: StudentCard = {
      id: `student-${Date.now()}`,
      name: "Student Name",
      department: "Department",
      imageUrl: ""
    };
    onStudentsChange([...students, newStudent]);
  };

  const handleUpdateStudent = (id: string, updates: Partial<StudentCard>) => {
    onStudentsChange(
      students.map(s => s.id === id ? { ...s, ...updates } : s)
    );
  };

  const handleDeleteStudent = (id: string) => {
    onStudentsChange(students.filter(s => s.id !== id));
  };

  const handleImageUpload = (id: string, file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const imageUrl = e.target?.result as string;
      handleUpdateStudent(id, { imageUrl });
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h4 className="font-medium text-gray-900">Student List</h4>
        <button
          onClick={handleAddStudent}
          className="inline-flex items-center gap-1 px-3 py-1 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Add Student
        </button>
      </div>

      {students.length === 0 ? (
        <div className="text-center py-6 text-gray-500 border-2 border-dashed border-gray-300 rounded-lg">
          <p className="text-sm">No students added. Click "Add Student" to begin.</p>
        </div>
      ) : (
        <div className="space-y-3 max-h-96 overflow-y-auto">
          {students.map((student) => (
            <div
              key={student.id}
              className="bg-gray-50 rounded-lg p-3 border border-gray-200 hover:border-blue-300 transition-colors"
            >
              <div className="flex gap-3">
                {/* Image preview */}
                <div className="flex-shrink-0">
                  <div className="w-16 h-16 rounded-full border-2 border-blue-900 overflow-hidden bg-yellow-300 flex items-center justify-center flex-shrink-0">
                    {student.imageUrl ? (
                      <img
                        src={student.imageUrl}
                        alt={student.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-blue-900 text-xl font-bold">
                        {student.name.charAt(0)}
                      </span>
                    )}
                  </div>
                </div>

                {/* Student info inputs */}
                <div className="flex-1 min-w-0">
                  <div className="space-y-2">
                    <input
                      type="text"
                      value={student.name}
                      onChange={(e) => handleUpdateStudent(student.id, { name: e.target.value })}
                      placeholder="Student name"
                      className="w-full px-2 py-1 bg-white border border-gray-300 rounded text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                    />
                    <input
                      type="text"
                      value={student.department}
                      onChange={(e) => handleUpdateStudent(student.id, { department: e.target.value })}
                      placeholder="Department"
                      className="w-full px-2 py-1 bg-white border border-gray-300 rounded text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                    />
                    <label className="flex items-center gap-2 cursor-pointer text-xs text-blue-600 hover:text-blue-700">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            handleImageUpload(student.id, file);
                          }
                        }}
                        className="hidden"
                      />
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      Upload Photo
                    </label>
                  </div>
                </div>

                {/* Delete button */}
                <button
                  onClick={() => handleDeleteStudent(student.id)}
                  className="flex-shrink-0 text-red-500 hover:text-red-700 hover:bg-red-50 rounded p-2 transition-colors"
                  title="Delete student"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
