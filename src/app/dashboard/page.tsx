"use client";

import { useEffect, useState } from "react";
import ApplicationForm from "@/components/ApplicationForm";
import ApplicationList, { type Application } from "@/components/ApplicationList";

export default function Dashboard() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingApp, setEditingApp] = useState<Application | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [resume, setResume] = useState<{ id: string; content: string } | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchApplications();
    fetchResume();
  }, []);

  const fetchApplications = async () => {
    const res = await fetch("/api/applications", { credentials: "include" });
    if (res.ok) {
      const data = await res.json();
      setApplications(data);
    }
    setIsLoading(false);
  };

  const fetchResume = async () => {
    const res = await fetch("/api/resumes", { credentials: "include" });
    if (res.ok) {
      const data = await res.json();
      if (data.length > 0) setResume(data[0]);
    }
  };

  const handleAdd = async (data: Partial<Application>) => {
    setError("");
    const res = await fetch("/api/applications", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
      credentials: "include",
    });
    if (res.ok) {
      const newApp = await res.json();
      setApplications([newApp, ...applications]);
      setShowForm(false);
    } else {
      const err = await res.json();
      setError(err.error || "Failed to add application. Are you signed in?");
    }
  };

  const handleUpdate = async (id: string, data: Partial<Application>) => {
    setError("");
    const res = await fetch(`/api/applications/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
      credentials: "include",
    });
    if (res.ok) {
      const updated = await res.json();
      setApplications(applications.map((a) => (a.id === id ? updated : a)));
    } else {
      const err = await res.json();
      setError(err.error || "Failed to update application");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this application?")) return;
    setError("");
    const res = await fetch(`/api/applications/${id}`, { method: "DELETE", credentials: "include" });
    if (res.ok) {
      setApplications(applications.filter((a) => a.id !== id));
    } else {
      const err = await res.json();
      setError(err.error || "Failed to delete application");
    }
  };

  const handleGenerateLetter = async (appId: string) => {
    if (!resume) {
      alert("Please upload a resume first in Settings");
      return;
    }
    setError("");
    const res = await fetch("/api/generate-letter", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ applicationId: appId, resumeId: resume.id }),
      credentials: "include",
    });
    if (res.ok) {
      const { coverLetter } = await res.json();
      setApplications(applications.map((a) => (a.id === appId ? { ...a, cover_letter: coverLetter } : a)));
    } else {
      const err = await res.json();
      setError(err.error || "Failed to generate cover letter");
    }
  };

  if (isLoading) return <div className="p-8 text-center">Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {error && <div className="mb-6 p-3 bg-red-100 text-red-700 rounded text-sm">{error}</div>}
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold">Job Application Tracker</h1>
          <div className="flex items-center gap-3">
            <a
              href="/dashboard/settings"
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-sm"
            >
              Settings
            </a>
            <button
              onClick={() => { setEditingApp(null); setShowForm(true); setError(""); }}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              + Add Application
            </button>
          </div>
        </div>

        {showForm && (
          <div className="mb-8">
            {error && <div className="mb-4 p-3 bg-red-100 text-red-700 rounded text-sm">{error}</div>}
            <ApplicationForm
              onSubmit={handleAdd}
              onCancel={() => { setShowForm(false); setError(""); }}
              isLoading={false}
            />
          </div>
        )}

        <ApplicationList
          applications={applications}
          onUpdate={handleUpdate}
          onDelete={handleDelete}
          onGenerateLetter={handleGenerateLetter}
        />
      </div>
    </div>
  );
}