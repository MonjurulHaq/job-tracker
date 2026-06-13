"use client";

import { useState } from "react";

type Application = {
  id: string;
  company: string;
  role: string;
  job_description?: string;
  cover_letter?: string;
};

type Props = {
  application: Application;
  onClose: () => void;
  onRegenerate: () => Promise<void>;
};

export default function CoverLetterGenerator({ application, onClose, onRegenerate }: Props) {
  const [coverLetter, setCoverLetter] = useState(application.cover_letter || "");
  const [isGenerating, setIsGenerating] = useState(false);
  const [editedLetter, setEditedLetter] = useState(application.cover_letter || "");

  const handleGenerate = async () => {
    setIsGenerating(true);
    try {
      await onRegenerate();
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSave = async () => {
    const res = await fetch(`/api/applications/${application.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ cover_letter: editedLetter }),
    });
    if (res.ok) {
      setCoverLetter(editedLetter);
      alert("Cover letter saved!");
    }
  };

  return (
    <div className="mt-4 p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg border border-purple-200 dark:border-purple-800">
      <div className="flex items-center justify-between mb-4">
        <h4 className="font-semibold text-purple-800 dark:text-purple-200">
          Cover Letter for {application.company} - {application.role}
        </h4>
        <button onClick={onClose} className="text-gray-500 hover:text-gray-700">×</button>
      </div>

      <div className="flex gap-2 mb-4">
        <button
          onClick={handleGenerate}
          disabled={isGenerating}
          className="px-3 py-1 text-sm bg-purple-600 text-white rounded hover:bg-purple-700 disabled:opacity-50"
        >
          {isGenerating ? "Generating..." : "Generate with AI"}
        </button>
        <button
          onClick={handleSave}
          className="px-3 py-1 text-sm border border-purple-300 dark:border-purple-700 rounded hover:bg-purple-100 dark:hover:bg-purple-900/30"
        >
          Save Changes
        </button>
      </div>

      <textarea
        value={editedLetter || coverLetter}
        onChange={(e) => setEditedLetter(e.target.value)}
        rows={12}
        className="w-full px-4 py-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg font-mono text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
        placeholder="Cover letter will appear here..."
      />
    </div>
  );
}