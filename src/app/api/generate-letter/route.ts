import { NextRequest, NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase-server";
import { generateCoverLetter } from "@/lib/nemotron";

export async function POST(request: NextRequest) {
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { applicationId, resumeId } = await request.json();

  const [appRes, resumeRes] = await Promise.all([
    supabase.from("applications").select("*").eq("id", applicationId).eq("user_id", user.id).single(),
    supabase.from("resumes").select("*").eq("id", resumeId).eq("user_id", user.id).single(),
  ]);

  if (appRes.error || !appRes.data) {
    return NextResponse.json({ error: "Application not found" }, { status: 404 });
  }
  if (resumeRes.error || !resumeRes.data) {
    return NextResponse.json({ error: "Resume not found" }, { status: 404 });
  }

  const application = appRes.data;
  const resume = resumeRes.data;

  try {
    const coverLetter = await generateCoverLetter({
      resume: resume.content,
      jobDescription: application.job_description || "",
      company: application.company,
      role: application.role,
    });

    await supabase
      .from("applications")
      .update({ cover_letter: coverLetter })
      .eq("id", applicationId);

    return NextResponse.json({ coverLetter });
  } catch (error: any) {
    console.error("Cover letter generation failed:", error);
    return NextResponse.json({ error: error.message || "Failed to generate cover letter" }, { status: 500 });
  }
}