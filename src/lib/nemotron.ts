import OpenAI from "openai";

const apiKey = process.env.NEMOTRON_API_KEY;

if (!apiKey) {
  console.warn("NEMOTRON_API_KEY not set - cover letter generation will fail");
}

const nemotron = new OpenAI({
  baseURL: "https://integrate.api.nvidia.com/v1",
  apiKey: apiKey || "dummy-key",
  timeout: 30000,
  maxRetries: 2,
});

export async function generateCoverLetter(params: {
  resume: string;
  jobDescription: string;
  company: string;
  role: string;
}): Promise<string> {
  if (!apiKey) {
    throw new Error("NEMOTRON_API_KEY environment variable is not set. Get one at https://build.nvidia.com");
  }

  const prompt = `Write a compelling, personalized cover letter for the following job application:

Company: ${params.company}
Role: ${params.role}

Job Description:
${params.jobDescription}

My Resume/Background:
${params.resume}

Requirements:
- Address the hiring manager professionally
- Highlight 2-3 specific experiences from my resume that match the job requirements
- Show genuine interest in the company
- Keep it concise (3-4 paragraphs)
- Professional but personable tone
- No placeholders like [Company Name] - use the actual company name
`;

  try {
    const completion = await nemotron.chat.completions.create({
      model: "nvidia/nemotron-3-ultra-550b-a55b",
      messages: [
        {
          role: "system",
          content: "You are an expert career coach and professional writer. Write concise, compelling cover letters that get interviews.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      temperature: 0.7,
      max_tokens: 1000,
    });

    return completion.choices[0]?.message?.content || "Failed to generate cover letter";
  } catch (error: any) {
    if (error.code === 'EAI_AGAIN' || error.code === 'ENOTFOUND' || error.message?.includes('getaddrinfo')) {
      throw new Error("Cannot connect to NVIDIA API (DNS/network issue). Check server network access to integrate.api.nvidia.com");
    }
    if (error.status === 401) {
      throw new Error("Invalid NVIDIA API key. Check NEMOTRON_API_KEY at https://build.nvidia.com");
    }
    if (error.status === 404) {
      throw new Error("Model not found. The model name may have changed.");
    }
    throw new Error(`Nemotron API error: ${error.message || 'Unknown error'}`);
  }
}