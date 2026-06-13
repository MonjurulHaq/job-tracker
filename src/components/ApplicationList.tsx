"use client";

import { useState } from "react";
import ApplicationForm from "./ApplicationForm";
import CoverLetterGenerator from "./CoverLetterGenerator";

export type ApplicationStatus = "applied" | "interviewing" | "offer" | "rejected" | "saved";

export type Application = {
  id: string;
  company: string;
  role: string;
  status: ApplicationStatus;
  job_url?: string;
  job_description?: string;
  notes?: string;
  cover_letter?: string;
  created_at: string;
};

type Props = {
  applications: Application[];
  onUpdate: (id: string, data: Partial<Application>) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
  onGenerateLetter: (appId: string) => Promise<void>;
};

const statusColors: Record<ApplicationStatus, string> = {
  saved: "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200",
  applied: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
  interviewing: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
  offer: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
  rejected: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
};

export default function ApplicationList({ applications, onUpdate, onDelete, onGenerateLetter }: Props) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [letterAppId, setLetterAppId] = useState<string | null>(null);
  const [generatingId, setGeneratingId] = useState<string | null>(null);

  const handleEdit = (app: Application) => setEditingId(app.id);
  const handleCancel = () => setEditingId(null);
  const handleSave = async (data: Partial<Application> & { status?: ApplicationStatus }) => {
    if (editingId) {
      await onUpdate(editingId, data);
      setEditingId(null);
    }
  };

  const handleGenerateLetter = async (appId: string) => {
    setGeneratingId(appId);
    try {
      await onGenerateLetter(appId);
    } finally {
      setGeneratingId(null);
    }
  };

  if (applications.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 dark:text-gray-400 mb-4">No applications yet. Add your first one!</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {applications.map((app) => (
        <div key={app.id} className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
          {editingId === app.id ? (
            <ApplicationForm
              initialData={app}
              onSubmit={handleSave}
              onCancel={handleCancel}
            />
          ) : (
            <>
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-semibold">{app.company}</h3>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${statusColors[app.status]}`}>
                      {app.status}
                    </span>
                  </div>
                  <p className="text-gray-600 dark:text-gray-300">{app.role}</p>
                  {app.job_url && (
                    <a href={app.job_url} target="_blank" rel="noopener" className="text-sm text-blue-600 hover:underline mt-1 inline-block">
                      View Job Posting
                    </a>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  {app.job_description && !app.cover_letter && (
                    <button
                      onClick={() => handleGenerateLetter(app.id)}
                      disabled={generatingId === app.id}
                      className="px-3 py-1 text-sm bg-purple-600 text-white rounded hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {generatingId === app.id ? "Generating..." : "Generate with AI"}
                    </button>
                  )}
                  {app.cover_letter && (
                    <button
                      onClick={() => setLetterAppId(app.id)}
                      className="px-3 py-1 text-sm bg-purple-600 text-white rounded hover:bg-purple-700"
                    >
                      View Cover Letter
                    </button>
                  )}
                  <button
                    onClick={() => handleEdit(app)}
                    className="px-3 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => onDelete(app.id)}
                    className="px-3 py-1 text-sm text-red-600 hover:text-red-700"
                  >
                    Delete
                  </button>
                </div>
              </div>

              {app.job_description && (
                <details className="mt-4">
                  <summary className="text-sm text-gray-500 cursor-pointer">Job Description</summary>
                  <pre className="mt-2 p-3 bg-gray-100 dark:bg-gray-700 rounded text-sm whitespace-pre-wrap">{app.job_description}</pre>
                </details>
              )}

              {app.notes && (
                <details className="mt-4">
                  <summary className="text-sm text-gray-500 cursor-pointer">Notes</summary>
                  <pre className="mt-2 p-3 bg-gray-100 dark:bg-gray-700 rounded text-sm whitespace-pre-wrap">{app.notes}</pre>
                </details>
              )}
            </>
          )}

          {letterAppId === app.id && (
            <CoverLetterGenerator
              application={app}
              onClose={() => setLetterAppId(null)}
              onRegenerate={() => onGenerateLetter(app.id)}
            />
          )}
        </div>
      ))}
    </div>
  );
}