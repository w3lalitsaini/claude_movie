import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getGroqCompletion } from "@/lib/ai/groq";
import { generateImage } from "@/lib/ai/huggingface";
import { uploadToCloudinary } from "@/lib/cloudinary";

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user?.role !== "admin") {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const { title } = await req.json();
    if (!title) {
      return NextResponse.json({ success: false, error: "Title is required" }, { status: 400 });
    }

    // 1. Generate Metadata using Groq
    const prompt = `Generate detailed movie metadata for the movie: "${title}". 
    Return ONLY a JSON object with the following fields:
    - description (synopsis, 3-4 paragraphs)
    - releaseYear (number)
    - duration (number in minutes)
    - imdbRating (number 0-10)
    - director (string)
    - cast (array of objects with name, character)
    - genres (array of strings)
    - metaTitle (SEO title)
    - metaDescription (SEO description, max 160 chars)
    - category (one of: bollywood, hollywood, south-hindi, dual-audio, web-series)
    - language (primary language)
    
    Ensure the JSON is valid and strictly follows the schema.`;

    const completion = await getGroqCompletion(prompt, "You are a professional movie database assistant. Return only valid JSON.");
    let metadata;
    try {
      // Clean the response from markdown if present
      const jsonStr = completion.replace(/```json|```/g, "").trim();
      metadata = JSON.parse(jsonStr);
    } catch (e) {
      console.error("Failed to parse Groq response:", completion);
      throw new Error("AI returned invalid data format. Please try again.");
    }

    // 2. Generate Poster & Backdrop Images using HuggingFace
    let poster = "";
    let backdrop = "";

    try {
      const posterPrompt = `Cinematic professional movie poster for "${title}". ${metadata.description.substring(0, 100)}. 8k, detailed.`;
      const backdropPrompt = `Cinematic wide landscape backdrop scene for "${title}". 8k, realistic.`;

      const [posterBuffer, backdropBuffer] = await Promise.all([
        generateImage(posterPrompt),
        generateImage(backdropPrompt)
      ]);

      // 3. Upload to Cloudinary
      const [posterRes, backdropRes] = await Promise.all([
        uploadToCloudinary(posterBuffer as Buffer),
        uploadToCloudinary(backdropBuffer as Buffer)
      ]);

      poster = (posterRes as any).secure_url;
      backdrop = (backdropRes as any).secure_url;
    } catch (err) {
      console.warn("Image generation failed, using placeholders:", err);
      // Fallback to high-quality placeholders if AI fails
      poster = `https://placehold.co/600x900/1a1a1a/ffffff?text=${encodeURIComponent(title)}+Poster`;
      backdrop = `https://placehold.co/1280x720/1a1a1a/ffffff?text=${encodeURIComponent(title)}+Backdrop`;
    }

    const finalData = {
      ...metadata,
      poster,
      backdrop,
    };

    return NextResponse.json({ success: true, data: finalData });
  } catch (error: any) {
    console.error("AI Generation Route Error:", error);
    return NextResponse.json({ success: false, error: error.message || "AI Generation failed" }, { status: 500 });
  }
}
