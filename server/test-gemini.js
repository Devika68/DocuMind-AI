import dotenv from "dotenv";

dotenv.config({ path: "./server/.env" });

const apiKey = process.env.GEMINI_API_KEY;

async function testGemini() {
  try {
    console.log("Testing Gemini text generation...");

    const response = await fetch(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-3.5-flash-lite:generateContent",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-goog-api-key": apiKey,
        },
        signal: AbortSignal.timeout(60000),
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: "Reply with only: DocuMind AI is working!",
                },
              ],
            },
          ],
          generationConfig: {
            maxOutputTokens: 50,
          },
        }),
      }
    );

    const data = await response.json();

    console.log("HTTP Status:", response.status);

    if (!response.ok) {
      console.log("API Error:", data.error?.message);
      return;
    }

    console.log(
      "Gemini Answer:",
      data.candidates?.[0]?.content?.parts?.[0]?.text
    );

  } catch (error) {
    console.log("Test failed:", error.message);
  }
}

testGemini();