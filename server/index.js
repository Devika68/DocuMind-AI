import authMiddleware from "./middleware/authMiddleware.js";
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import rateLimit from "express-rate-limit";

import path from "path";
import { fileURLToPath } from "url";

import connectDB from "./db.js";
import authRoutes from "./routes/authRoutes.js";

// Load environment variables from server/.env
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, ".env") });

const app = express();
app.set("trust proxy", 1);
const PORT = process.env.PORT || 5000;

const API_KEY = process.env.GEMINI_API_KEY;
const MODEL = "gemini-3.5-flash-lite";

// ================= ENVIRONMENT VALIDATION =================

if (!API_KEY) {
  throw new Error("GEMINI_API_KEY is missing from server/.env");
}

if (!process.env.JWT_SECRET) {
  throw new Error("JWT_SECRET is missing from server/.env");
}

// ================= MIDDLEWARE =================

app.use(helmet());

const allowedOrigins = [
  "http://localhost:5173",
  "https://documind-ai-frontend-lh7w.onrender.com",
];

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  })
);

app.use(express.json({ limit: "5mb" }));
app.use(cookieParser());

// ================= LOGIN RATE LIMIT =================

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  standardHeaders: "draft-8",
  legacyHeaders: false,
  message: {
    error: "Too many authentication attempts. Please try again later.",
  },
});

// ================= AI API RATE LIMIT =================

const aiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 30,
  standardHeaders: "draft-8",
  legacyHeaders: false,
  message: {
    error: "Too many AI requests. Please try again after 15 minutes.",
  },
});


app.use("/api/auth/login", authLimiter);
app.use("/api/auth/register", authLimiter);

// ================= AUTHENTICATION ROUTES =================

app.use("/api/auth", authRoutes);

// ================= GEMINI HELPER =================

async function askGemini(prompt, maxOutputTokens = 1500) {
  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-goog-api-key": API_KEY,
      },
      signal: AbortSignal.timeout(60000),
      body: JSON.stringify({
        contents: [
          {
            parts: [{ text: prompt }],
          },
        ],
        generationConfig: {
          temperature: 0.3,
          maxOutputTokens,
        },
      }),
    }
  );

  const data = await response.json();

  if (!response.ok) {
    console.error("Gemini API error:", data);

    throw new Error(
      data.error?.message || "Gemini API request failed."
    );
  }

  const answer = data.candidates?.[0]?.content?.parts
    ?.map((part) => part.text || "")
    .join("")
    .trim();

  if (!answer) {
    throw new Error("Gemini returned an empty response.");
  }

  return answer;
}

// ================= DOCUMENT VALIDATION =================

function validateDocument(req, res) {
  const { documentText } = req.body;

  if (!documentText || typeof documentText !== "string") {
    res.status(400).json({
      error: "Please upload a PDF document first.",
    });

    return false;
  }

  if (documentText.length > 100000) {
    res.status(413).json({
      error: "The document is too large.",
    });

    return false;
  }

  return true;
}

// ================= HEALTH CHECK =================

app.get("/", (req, res) => {
  res.send("DocuMind AI Backend is running!");
});

// ================= AI DOCUMENT CHAT =================

app.post("/api/chat", authMiddleware, aiLimiter, async (req, res) => {
  console.log("\nNew chat request received.");

  const { question, documentText } = req.body || {};

  // Validate document text
  if (
    typeof documentText !== "string" ||
    !documentText.trim()
  ) {
    return res.status(400).json({
      error: "Please upload a valid document.",
    });
  }

  // Maximum document text: approximately 1 million characters
  const MAX_DOCUMENT_LENGTH = 1_000_000;

  if (documentText.length > MAX_DOCUMENT_LENGTH) {
    return res.status(413).json({
      error: "Document content is too large. Please upload a smaller document.",
    });
  }

  // Validate question
  if (
    typeof question !== "string" ||
    !question.trim()
  ) {
    return res.status(400).json({
      error: "Please enter a valid question.",
    });
  }

  if (question.length > 2000) {
    return res.status(413).json({
      error: "Your question is too long.",
    });
  }

  try {
    console.log("Generating document answer...");

    const prompt = `
You are DocuMind AI, an intelligent document assistant.

Answer the user's question using ONLY the supplied document.

Instructions:
- Give accurate and clear answers.
- Use simple language.
- Organize answers with bullet points when useful.
- Do not invent information.
- Include page citations for factual claims.
- The document contains page markers such as Page 1 and Page 2.
- Never invent page numbers.
- If information is unavailable, say so.
- Finish with a Sources section listing relevant pages.

DOCUMENT:
${documentText}

USER QUESTION:
${question}
`;

    const startTime = Date.now();
    const answer = await askGemini(prompt, 1024);

    console.log(
      "Chat response time:",
      Date.now() - startTime,
      "ms"
    );

    return res.json({ answer });

  } catch (error) {
    console.error("Chat error:", error);

    return res.status(
      error.name === "TimeoutError" ? 504 : 500
    ).json({
      error:
        error.name === "TimeoutError"
          ? "Gemini took too long to respond. Please try again."
          : error.message,
    });
  }
});
// ================= AI DOCUMENT SUMMARIZER =================

app.post("/api/summarize", authMiddleware, aiLimiter, async (req, res) => {
  console.log("\nNew document summary request received.");

  if (!validateDocument(req, res)) return;

  const { documentText } = req.body;

  try {
    console.log("Generating document summary...");

    const prompt = `
You are DocuMind AI, an intelligent document summarization assistant.

Create a useful, accurate and well-organized summary
of the uploaded document.

Use ONLY the information in the document.

Follow this structure:

# Executive Summary
Give a concise overview of the document.

# Key Points
List the most important information.

# Important Skills or Concepts
Identify important skills, technologies, terms or concepts
when they are present in the document.
If this section is not relevant, say so.

# Important Details
Include relevant names, dates, figures or facts
that are explicitly mentioned in the document.

# Conclusion
Give a short concluding overview.

CITATION RULES:
- Use the page markers provided in the document.
- Add page citations to factual points where possible.
- Never invent page numbers.
- If a page reference is uncertain, do not create one.

Keep the summary readable and avoid unnecessary repetition.
Do not add outside information.

DOCUMENT:
${documentText}

Generate the summary now.
`;

    const startTime = Date.now();
    const generatedSummary = await askGemini(prompt, 1800);

    // Remove email addresses
    const summaryWithoutEmails = generatedSummary.replace(
      /\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/gi,
      "[Email hidden]"
    );

    // Remove common phone number formats
    const summary = summaryWithoutEmails.replace(
      /(?:\+\d{1,3}[\s-]?)?\d{10}\b/g,
      "[Phone number hidden]"
    );

    console.log(
      "Summary response time:",
      Date.now() - startTime,
      "ms"
    );

    console.log("Document summary generated successfully.");

    return res.json({ summary });

  } catch (error) {
    console.error("Summary error:", error);

    return res.status(
      error.name === "TimeoutError" ? 504 : 500
    ).json({
      error:
        error.name === "TimeoutError"
          ? "Summary generation took too long. Please try again."
          : "Unable to generate summary. Please try again.",
    });
  }
});
// ================= START SERVER =================

async function startServer() {
  try {
    await connectDB();

    app.listen(PORT, () => {
      console.log("------------------------------------");
      console.log("       DOCUMIND AI BACKEND");
      console.log("------------------------------------");
      console.log(`Server: http://localhost:${PORT}`);
      console.log(`Gemini model: ${MODEL}`);
      console.log("MongoDB: Connected");
      console.log("Authentication: Enabled");
      console.log("Register API: /api/auth/register");
      console.log("Login API: /api/auth/login");
      console.log("Current User API: /api/auth/me");
      console.log("Logout API: /api/auth/logout");
      console.log("Chat API: /api/chat");
      console.log("Summary API: /api/summarize");
      console.log("Status: Running");
      console.log("------------------------------------");
    });

  } catch (error) {
    console.error(
      "Could not start DocuMind AI:",
      error.message
    );

    process.exit(1);
  }
}

startServer();
