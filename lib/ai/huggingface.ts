export async function generateImage(prompt: string) {
  try {
    const response = await fetch(
      "https://api-inference.huggingface.co/models/CompVis/stable-diffusion-v1-4",
      {
        headers: {
          Authorization: `Bearer ${process.env.HUGGINGFACE_API_KEY}`,
          "Content-Type": "application/json",
        },
        method: "POST",
        body: JSON.stringify({ inputs: prompt }),
      }
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || "Hugging Face API Error");
    }

    const blob = await response.blob();
    const buffer = Buffer.from(await blob.arrayBuffer());
    return buffer;
  } catch (error) {
    console.error("HuggingFace Image Generation Error:", error);
    throw error;
  }
}
