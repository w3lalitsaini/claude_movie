import Groq from "groq-sdk";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

export async function getGroqCompletion(prompt: string, systemPrompt: string = "You are a helpful assistant.") {
  try {
    const chatCompletion = await groq.chat.completions.create({
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: prompt },
      ],
      model: "llama-3.3-70b-versatile",
      temperature: 0.7,
      max_tokens: 2048,
    });

    return chatCompletion.choices[0]?.message?.content || "";
  } catch (error) {
    console.error("Groq API Error:", error);
    throw error;
  }
}
