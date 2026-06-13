"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";

type Resume = {
  id: string;
  content: string;
  file_name: string;
  created_at: string;
};

export default function SettingsPage() {
  const [resume, setResume] = useState<Resume | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [extractedText, setExtractedText] = useState("");

  useEffect(() => {
    fetchResume();
  }, []);

  const fetchResume = async () => {
    const res = await fetch("/api/resumes", { credentials: "include" });
    if (res.ok) {
      const data = await res.json();
      if (data.length > 0) setResume(data[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      extractText(selectedFile);
    }
  };

  const extractText = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      setExtractedText(text);
    };
    reader.readAsText(file);
  };

  const handleUpload = async () => {
    if (!extractedText) return;
    setIsUploading(true);

    const fileName = file?.name || "pasted-resume.txt";

    const res = await fetch("/api/resumes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content: extractedText, file_name: fileName }),
      credentials: "include",
    });

    if (res.ok) {
      const data = await res.json();
      setResume(data);
      setFile(null);
      setExtractedText("");
      alert("Resume uploaded successfully!");
    } else {
      alert("Failed to upload resume");
    }
    setIsUploading(false);
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Settings</h1>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Resume</h2>

        {resume ? (
          <div>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              Current: <span className="font-medium">{resume.file_name}</span>
              <span className="text-sm text-gray-500 ml-2">({new Date(resume.created_at).toLocaleDateString()})</span>
            </p>
            <details className="mb-4">
              <summary className="cursor-pointer text-blue-600">Preview extracted text</summary>
              <pre className="mt-2 p-3 bg-gray-100 dark:bg-gray-700 rounded text-sm max-h-64 overflow-auto whitespace-pre-wrap">
                {resume.content.slice(0, 2000)}...
              </pre>
            </details>
            <p className="text-sm text-gray-500">Upload a new resume to replace this one.</p>
          </div>
        ) : (
          <p className="text-gray-500 mb-4">No resume uploaded yet. Add one below to enable AI cover letters.</p>
        )}

        <div className="border-t dark:border-gray-700 pt-6">
          <h3 className="font-medium mb-4">Upload New Resume</h3>
          <input
            type="file"
            accept=".txt,.md"
            onChange={handleFileChange}
            className="mb-4 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
          />
          <p className="text-xs text-gray-500 mb-4">PDF not supported directly. Convert to .txt first, or paste text below.</p>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Or paste resume text directly</label>
            <textarea
              value={extractedText}
              onChange={(e) => setExtractedText(e.target.value)}
              rows={8}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              placeholder="Paste your resume content here..."
            />
          </div>

          <button
            onClick={handleUpload}
            disabled={isUploading || !extractedText}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            {isUploading ? "Uploading..." : "Save Resume"}
          </button>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4">Environment Variables</h2>
        <p className="text-gray-600 dark:text-gray-300 mb-4">
          Make sure these are set in your <code>.env.local</code>:
        </p>
        <ul className="space-y-2 text-sm font-mono text-gray-700 dark:text-gray-200">
          <li>NEXT_PUBLIC_SUPABASE_URL=your_supabase_url</li>
          <li>NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key</li>
          <li>NEMOTRON_API_KEY=your_nvidia_api_key</li>
        </ul>
      </div>
    </div>
  );
}