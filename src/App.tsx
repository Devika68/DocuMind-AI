import { useEffect, useState } from "react";
import { Link, Navigate, Route, Routes, useNavigate } from "react-router-dom";
import Login from "./pages/login";
import Register from "./pages/register";
import type { ChangeEvent, ReactNode } from "react";
import * as pdfjsLib from "pdfjs-dist";
import pdfWorker from "pdfjs-dist/build/pdf.worker.min.mjs?url";

import Footer from "./components/Footer";
import Pricing from "./components/Pricing";
import HowItWorks from "./components/HowItWorks";
import Features from "./components/Features";

import {
  Sparkles,
  ArrowRight,
  FileText,
  Upload,
  Bell,
  Plus,
  BrainCircuit,
  ShieldCheck,
  Zap,
  Menu,
  X,
  Bot,
  User,
} from "lucide-react";

pdfjsLib.GlobalWorkerOptions.workerSrc = pdfWorker;

type AuthUser = { id: string; name: string; email: string };

// ================= NAVBAR =================

function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeLink, setActiveLink] = useState("#features");

  const navLinks = [
    { label: "Features", href: "#features" },
    { label: "How it works", href: "#how-it-works" },
    { label: "Pricing", href: "#pricing" },
  ];

  const handleNavigation = (href: string) => {
    setActiveLink(href);
    setMobileMenuOpen(false);
  };

  return (
    <nav className="relative z-50 flex items-center justify-between py-6">
      <a href="#" className="flex items-center gap-2 text-xl font-bold">
        <Sparkles className="text-violet-400" />
        <span>DocuMind AI</span>
      </a>

      <div className="hidden items-center gap-3 md:flex">
        {navLinks.map((link) => (
          <a
            key={link.href}
            href={link.href}
            onClick={() => handleNavigation(link.href)}
            className={`rounded-xl border px-4 py-2 text-sm font-medium transition-all duration-300 ${
              activeLink === link.href
                ? "border-[3px] border-white bg-white/10 text-white shadow-[0_0_10px_rgba(255,255,255,0.8),0_0_25px_rgba(255,255,255,0.35)]"
                : "border-transparent text-gray-400 hover:border-violet-400/50 hover:text-white"
            }`}
          >
            {link.label}
          </a>
        ))}
      </div>

      <div className="hidden items-center gap-4 md:flex">
        <Link to="/login" className="text-sm text-gray-300 hover:text-white">
          Log in
        </Link>

        <Link
          to="/register"
          className="rounded-xl bg-violet-600 px-5 py-2.5 text-sm font-semibold hover:bg-violet-500"
        >
          Get started
        </Link>
      </div>

      <button
        type="button"
        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        className="rounded-lg border border-white/10 p-2 text-white md:hidden"
        aria-label="Toggle navigation menu"
        aria-expanded={mobileMenuOpen}
      >
        {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
      </button>

      {mobileMenuOpen && (
        <div className="absolute left-0 right-0 top-full mt-2 flex flex-col gap-2 rounded-2xl border border-white/10 bg-[#101020] p-4 shadow-xl md:hidden">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={() => handleNavigation(link.href)}
              className={`rounded-xl border px-4 py-3 text-sm font-medium transition-all ${
                activeLink === link.href
                  ? "border-[3px] border-white bg-white/10 text-white"
                  : "border-transparent text-gray-400 hover:border-violet-400/50 hover:text-white"
              }`}
            >
              {link.label}
            </a>
          ))}

          <Link
            to="/register"
            onClick={() => setMobileMenuOpen(false)}
            className="mt-2 rounded-xl bg-violet-600 px-4 py-3 text-center text-sm font-semibold text-white"
          >
            Get started
          </Link>
        </div>
      )}
    </nav>
  );
}

// ================= PRODUCT PREVIEW =================

function ProductPreview() {
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [pdfPage, setPdfPage] = useState(1);
  const [pdfPageCount, setPdfPageCount] = useState(0);

  const [uploadError, setUploadError] = useState("");
  const [extractedText, setExtractedText] = useState("");
  const [isExtracting, setIsExtracting] = useState(false);

  const [question, setQuestion] = useState("");

  type ChatMessage = {
    role: "user" | "ai";
    text: string;
  };

  type ChatConversation = {
    id: string;
    title: string;
    messages: ChatMessage[];
  };

  // Load saved conversations
  const [conversations, setConversations] = useState<ChatConversation[]>(() => {
    try {
      const savedChats = localStorage.getItem("documind-chat-history");

      if (!savedChats) return [];

      const parsedChats = JSON.parse(savedChats);

      return Array.isArray(parsedChats)
        ? (parsedChats as ChatConversation[])
        : [];
    } catch (error) {
      console.error("Could not load chat history:", error);
      return [];
    }
  });

  // Save conversations
  useEffect(() => {
    try {
      localStorage.setItem(
        "documind-chat-history",
        JSON.stringify(conversations)
      );
    } catch (error) {
      console.error("Could not save chat history:", error);
    }
  }, [conversations]);

  const [activeConversationId, setActiveConversationId] = useState<
    string | null
  >(null);

  const activeConversation = conversations.find(
    (conversation) => conversation.id === activeConversationId
  );

  const messages = activeConversation?.messages ?? [];

  const [isAsking, setIsAsking] = useState(false);
  const [chatError, setChatError] = useState("");

  // Summary states
  const [summary, setSummary] = useState("");
  const [isSummarizing, setIsSummarizing] = useState(false);
  const [summaryError, setSummaryError] = useState("");

  // Automatically scroll chat to the latest message
  useEffect(() => {
    const chatContainer = document.getElementById("chat-messages");

    if (chatContainer) {
      chatContainer.scrollTo({
        top: chatContainer.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [messages.length, isAsking]);

  // Clean up PDF preview URL
  useEffect(() => {
    return () => {
      if (pdfUrl) {
        URL.revokeObjectURL(pdfUrl);
      }
    };
  }, [pdfUrl]);

  // ================= PDF UPLOAD =================

  const handlePdfUpload = async (
    event: ChangeEvent<HTMLInputElement>
  ) => {
    const input = event.currentTarget;
    const file = input.files?.[0];

    if (!file) return;

    if (
      file.type !== "application/pdf" &&
      !file.name.toLowerCase().endsWith(".pdf")
    ) {
      setUploadError("Please select a valid PDF file.");
      input.value = "";
      return;
    }
    
// Reject empty files
if (file.size === 0) {
  setUploadError("The selected PDF is empty. Please choose another file.");
  input.value = "";
  return;
}

// Maximum file size: 10 MB
const MAX_FILE_SIZE = 10 * 1024 * 1024;

if (file.size > MAX_FILE_SIZE) {
  setUploadError("PDF size must not exceed 10 MB.");
  input.value = "";
  return;
}


    setUploadError("");
    setExtractedText("");
    setPdfFile(file);
    setPdfPage(1);
    setPdfPageCount(0);

    setActiveConversationId(null);
    setChatError("");
    setQuestion("");

    setSummary("");
    setSummaryError("");
    setIsExtracting(true);

    const newPdfUrl = URL.createObjectURL(file);
    setPdfUrl(newPdfUrl);

    input.value = "";

    try {
      const arrayBuffer = await file.arrayBuffer();

      const pdf = await pdfjsLib.getDocument({
        data: new Uint8Array(arrayBuffer),
      }).promise;

      setPdfPageCount(pdf.numPages);
      setPdfPage(1);

      let fullText = "";

      for (
        let pageNumber = 1;
        pageNumber <= pdf.numPages;
        pageNumber++
      ) {
        const page = await pdf.getPage(pageNumber);
        const content = await page.getTextContent();

        const pageText = content.items
          .map((item) => ("str" in item ? item.str : ""))
          .join(" ");

        fullText += `\n\nPage ${pageNumber}\n${pageText}`;
      }

      setExtractedText(fullText.trim());

      if (!fullText.trim()) {
        setUploadError(
          "No selectable text was found. This may be a scanned PDF."
        );
      }
    } catch (error) {
      console.error("PDF extraction error:", error);

      setUploadError(
        "Could not read this PDF. Please try another PDF file."
      );
    } finally {
      setIsExtracting(false);
    }
  };

  // ================= CHAT HISTORY =================

  const handleNewChat = () => {
    if (isAsking) return;

    setActiveConversationId(null);
    setQuestion("");
    setChatError("");
  };

  const handleSelectConversation = (conversationId: string) => {
    if (isAsking) return;

    setActiveConversationId(conversationId);
    setQuestion("");
    setChatError("");
  };

  // ================= GEMINI AI CHAT =================

  const handleAskQuestion = async () => {
    if (!question.trim() || !extractedText || isAsking) return;

    const userQuestion = question.trim();

    const conversationId =
      activeConversationId ?? crypto.randomUUID();

    const userMessage: ChatMessage = {
      role: "user",
      text: userQuestion,
    };

    if (!activeConversationId) {
      setActiveConversationId(conversationId);

      setConversations((previous) => [
        {
          id: conversationId,
          title:
            userQuestion.length > 42
              ? `${userQuestion.slice(0, 42)}...`
              : userQuestion,
          messages: [userMessage],
        },
        ...previous,
      ]);
    } else {
      setConversations((previous) =>
        previous.map((conversation) =>
          conversation.id === conversationId
            ? {
                ...conversation,
                messages: [
                  ...conversation.messages,
                  userMessage,
                ],
              }
            : conversation
        )
      );
    }

    setQuestion("");
    setChatError("");
    setIsAsking(true);

    try {
      const response = await fetch("https://documind-ai-buwz.onrender.com/api/chat", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
       
        body: JSON.stringify({
          question: userQuestion,
          documentText: extractedText,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error || "Failed to get an AI response."
        );
      }

      setConversations((previous) =>
        previous.map((conversation) =>
          conversation.id === conversationId
            ? {
                ...conversation,
                messages: [
                  ...conversation.messages,
                  {
                    role: "ai",
                    text: data.answer,
                  },
                ],
              }
            : conversation
        )
      );
    } catch (error) {
      console.error("Chat error:", error);

      setChatError(
        error instanceof Error
          ? error.message
          : "Something went wrong. Please try again."
      );
    } finally {
      setIsAsking(false);
    }
  };

  // ================= AI DOCUMENT SUMMARY =================

  const handleGenerateSummary = async () => {
    if (!extractedText || isSummarizing) return;

    setIsSummarizing(true);
    setSummaryError("");
    setSummary("");

    try {
      const response = await fetch(
        "https://documind-ai-buwz.onrender.com/api/summarize",
        {
  method: "POST",
  credentials: "include",
  headers: {
    "Content-Type": "application/json",
  },
          body: JSON.stringify({
            documentText: extractedText,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error || "Failed to generate summary."
        );
      }

      setSummary(data.summary);
    } catch (error) {
      console.error("Summary error:", error);

      setSummaryError(
        error instanceof Error
          ? error.message
          : "Something went wrong. Please try again."
      );
    } finally {
      setIsSummarizing(false);
    }
  };

  // ================= FORMATTED AI RESPONSES =================

 
const renderInlineContent = (text: string): ReactNode[] => {
  const pattern = /(\*\*.*?\*\*|\*[^*]+?\*|\[?Page\s+\d+\]?)/gi;
  const parts = text.split(pattern);

  return parts.map((part, index) => {
    // Bold text: **text**
    const boldMatch = part.match(/^\*\*(.*?)\*\*$/);

    if (boldMatch) {
      return (
        <strong
          key={index}
          className="font-semibold text-white"
        >
          {boldMatch[1]}
        </strong>
      );
    }

    // Italic text: *text*
    const italicMatch = part.match(/^\*([^*]+)\*$/);

    if (italicMatch) {
      return (
        <em key={index} className="italic text-slate-300">
          {italicMatch[1]}
        </em>
      );
    }

    // Clickable PDF page references
    const pageMatch = part.match(/^\[?Page\s+(\d+)\]?$/i);

    if (pageMatch) {
      const pageNumber = Number(pageMatch[1]);

      const isValidPage =
        Number.isInteger(pageNumber) &&
        pageNumber >= 1 &&
        pageNumber <= pdfPageCount;

      if (isValidPage) {
        return (
          <button
            key={index}
            type="button"
            onClick={() => {
              setPdfPage(pageNumber);

              window.setTimeout(() => {
                document.getElementById("pdf-preview")?.scrollIntoView({
                  behavior: "smooth",
                  block: "center",
                });
              }, 0);
            }}
            className="mx-1 inline-flex items-center gap-1 rounded-md border border-violet-400/30 bg-violet-500/10 px-2 py-0.5 text-xs font-semibold text-violet-300 transition hover:border-violet-400 hover:bg-violet-500/20 hover:text-white"
            title={`Open PDF page ${pageNumber}`}
          >
            <FileText size={12} />
            Page {pageNumber}
          </button>
        );
      }
    }

    return <span key={index}>{part}</span>;
  });
};

  const renderAnswer = (text: string) => {
    const lines = text.split("\n");

    return (
      <div className="space-y-2 text-left">
        {lines.map((line, index) => {
          const trimmedLine = line.trim();

          if (!trimmedLine) {
            return <div key={index} className="h-1" />;
          }

          const headingMatch = trimmedLine.match(
            /^(#{1,3})\s+(.+)$/
          );

          if (headingMatch) {
            return (
              <h4
                key={index}
                className="pt-2 text-sm font-bold text-white"
              >
                {renderInlineContent(headingMatch[2])}
              </h4>
            );
          }

          const bulletMatch = trimmedLine.match(
            /^[-*•]\s+(.+)$/
          );

          if (bulletMatch) {
            return (
              <div
                key={index}
                className="flex items-start gap-2 pl-1"
              >
                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-violet-400" />

                <p className="min-w-0 flex-1">
                  {renderInlineContent(bulletMatch[1])}
                </p>
              </div>
            );
          }

          const numberedMatch = trimmedLine.match(
            /^\d+[.)]\s+(.+)$/
          );

          if (numberedMatch) {
            return (
              <div
                key={index}
                className="flex items-start gap-2 pl-1"
              >
                <span className="font-semibold text-violet-300">
                  {trimmedLine.match(/^\d+/)?.[0]}.
                </span>

                <p className="min-w-0 flex-1">
                  {renderInlineContent(numberedMatch[1])}
                </p>
              </div>
            );
          }

          return (
            <p key={index}>
              {renderInlineContent(trimmedLine)}
            </p>
          );
        })}
      </div>
    );
  };

  // ================= PRODUCT PREVIEW UI =================

  return (
    <div
      id="workspace"
      className="relative mx-auto mt-16 w-full max-w-7xl scroll-mt-8"
    >
      <div className="absolute -inset-5 rounded-3xl bg-violet-600/20 blur-3xl" />

      <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-[#101225] shadow-2xl shadow-violet-950/40">
        {/* Dashboard Header */}
        <div className="flex items-center justify-between border-b border-white/10 px-5 py-4">
          <div className="flex items-center gap-2">
            <div className="h-2.5 w-2.5 rounded-full bg-red-400" />
            <div className="h-2.5 w-2.5 rounded-full bg-yellow-400" />
            <div className="h-2.5 w-2.5 rounded-full bg-green-400" />

            <span className="ml-3 text-xs text-slate-400">
              DocuMind Workspace
            </span>
          </div>

          <Bell size={17} className="text-slate-400" />
        </div>

        {/* Dashboard Content */}
        <div className="grid min-h-[350px] md:grid-cols-[210px_1fr]">
          {/* Sidebar */}
          <aside className="hidden border-r border-white/10 p-5 md:block">
            <label
              htmlFor="pdf-upload"
              className="mb-7 flex w-full cursor-pointer items-center justify-center gap-2 rounded-lg bg-violet-600 px-3 py-2.5 text-sm font-medium transition hover:bg-violet-500"
            >
              <Plus size={16} />
              Upload PDF
            </label>

            <p className="mb-3 text-xs text-slate-500">
              WORKSPACE
            </p>

            <div className="flex items-center gap-2 rounded-lg bg-white/5 p-3 text-sm text-white">
              <FileText size={16} className="text-violet-400" />
              My Documents
            </div>

            <div className="mt-6 flex items-center justify-between">
              <p className="text-xs text-slate-500">
                CHAT HISTORY
              </p>

              <button
                type="button"
                onClick={handleNewChat}
                disabled={!extractedText || isAsking}
                className="rounded-md p-1.5 text-violet-300 transition hover:bg-violet-500/15 hover:text-white disabled:opacity-40"
                title="Start a new chat"
                aria-label="Start a new chat"
              >
                <Plus size={16} />
              </button>
            </div>

            <button
              type="button"
              onClick={handleNewChat}
              disabled={!extractedText || isAsking}
              className="mt-2 flex w-full items-center gap-2 rounded-lg border border-violet-400/20 bg-violet-500/10 p-3 text-left text-sm text-violet-200 transition hover:bg-violet-500/20 disabled:opacity-40"
            >
              <Plus size={15} />
              New Chat
            </button>

            <div className="mt-3 max-h-64 space-y-1 overflow-y-auto">
              {conversations.length === 0 ? (
                <p className="px-2 py-3 text-xs leading-5 text-slate-500">
                  Your conversations will appear here.
                </p>
              ) : (
                conversations.map((conversation) => (
                  <button
                    key={conversation.id}
                    type="button"
                    onClick={() =>
                      handleSelectConversation(conversation.id)
                    }
                    disabled={isAsking}
                    className={`w-full truncate rounded-lg px-3 py-2.5 text-left text-xs transition ${
                      activeConversationId === conversation.id
                        ? "bg-white/10 text-white"
                        : "text-slate-400 hover:bg-white/5 hover:text-white"
                    }`}
                    title={conversation.title}
                  >
                    <span className="mr-2 inline-block text-violet-400">
                      •
                    </span>
                    {conversation.title}
                  </button>
                ))
              )}
            </div>
          </aside>

          {/* Main Dashboard */}
          <div className="min-w-0 p-4 sm:p-6 md:p-8">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-sm text-slate-400">
                  Your workspace
                </p>

                <h2 className="mt-1 text-xl font-semibold">
                  Good morning!
                </h2>
              </div>

              <div className="rounded-full bg-violet-500/10 px-3 py-2 text-xs text-violet-300">
                <Sparkles size={13} className="mr-1 inline" />
                AI powered
              </div>
            </div>

            {/* PDF Input */}
            <input
              id="pdf-upload"
              type="file"
              accept=".pdf,application/pdf"
              className="hidden"
              onChange={handlePdfUpload}
            />

            {/* Upload Area */}
            <div className="mt-7 rounded-xl border border-dashed border-violet-400/40 bg-violet-500/[0.04] p-6 text-center">
              <Upload size={30} className="mx-auto text-violet-400" />

              <h3 className="mt-3 text-base font-semibold text-white">
                Upload your PDF document
              </h3>

              <p className="mt-2 text-sm text-slate-400">
                Select a PDF file from your computer to get started.
              </p>

              <label
                htmlFor="pdf-upload"
                className="mt-5 inline-flex cursor-pointer items-center gap-2 rounded-lg bg-violet-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-violet-500"
              >
                <Upload size={16} />
                Choose PDF
              </label>

              <p className="mt-3 text-xs text-slate-500">
                PDF files only
              </p>

              {uploadError && (
                <p className="mt-3 text-sm text-red-400">
                  {uploadError}
                </p>
              )}

              {isExtracting && (
                <p className="mt-3 text-sm text-violet-300">
                  Reading your PDF. Please wait...
                </p>
              )}
            </div>

            {/* Uploaded File Details */}
            {pdfFile && pdfUrl && (
              <div className="mt-6 rounded-xl border border-white/10 bg-white/[0.03] p-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="flex min-w-0 items-center gap-3">
                    <FileText
                      className="shrink-0 text-violet-400"
                      size={24}
                    />

                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium text-white">
                        {pdfFile.name}
                      </p>

                      <p className="mt-1 text-xs text-slate-400">
                        {(pdfFile.size / (1024 * 1024)).toFixed(2)} MB
                      </p>
                    </div>
                  </div>

                  <label
                    htmlFor="pdf-upload"
                    className="cursor-pointer rounded-lg border border-white/15 px-3 py-2 text-xs text-slate-300 transition hover:border-violet-400 hover:text-white"
                  >
                    Change PDF
                  </label>
                </div>

                <div className="mt-5 overflow-hidden rounded-lg border border-white/10 bg-white">
                  <iframe
                    key={`${pdfUrl}-page-${pdfPage}`}
                    id="pdf-preview"
                    src={`${pdfUrl}#page=${pdfPage}`}
                    title={`Uploaded PDF preview - page ${pdfPage}`}
                    className="h-[500px] w-full"
                  />
                </div>

                {/* Extracted Text */}
                <div className="mt-5 rounded-xl border border-white/10 bg-white/[0.03] p-5">
                  <div className="flex items-center gap-2">
                    <BrainCircuit
                      size={19}
                      className="text-violet-400"
                    />

                    <h3 className="font-semibold text-white">
                      Extracted document text
                    </h3>
                  </div>

                  {isExtracting ? (
                    <p className="mt-3 text-sm text-violet-300">
                      Reading your PDF...
                    </p>
                  ) : extractedText ? (
                    <div className="mt-4 max-h-[400px] overflow-y-auto whitespace-pre-wrap break-words text-sm leading-7 text-slate-300">
                      {extractedText}
                    </div>
                  ) : (
                    <p className="mt-3 text-sm text-slate-400">
                      No readable text available.
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* Statistics */}
            {!pdfFile && (
              <div className="mt-7 grid gap-4 sm:grid-cols-2">
                <div className="rounded-xl border border-white/10 bg-white/[0.03] p-5">
                  <FileText className="text-violet-400" />
                  <p className="mt-4 text-2xl font-bold">24</p>
                  <p className="mt-1 text-xs text-slate-400">
                    Demo documents analysed
                  </p>
                </div>

                <div className="rounded-xl border border-white/10 bg-white/[0.03] p-5">
                  <BrainCircuit className="text-cyan-400" />
                  <p className="mt-4 text-2xl font-bold">86</p>
                  <p className="mt-1 text-xs text-slate-400">
                    Demo questions answered
                  </p>
                </div>
              </div>
            )}

            {/* ================= AI DOCUMENT SUMMARY ================= */}

            <div className="mt-5 rounded-xl border border-cyan-400/20 bg-cyan-500/5 p-5">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2 text-sm font-semibold text-white">
                    <BrainCircuit size={19} className="text-cyan-400" />
                    AI Document Summary
                  </div>

                  <p className="mt-2 text-xs text-slate-400">
                    Generate a clear summary of your uploaded PDF.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={handleGenerateSummary}
                  disabled={!extractedText || isExtracting || isSummarizing}
                  className="rounded-lg bg-cyan-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-cyan-500 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {isSummarizing ? (
                    "Generating..."
                  ) : (
                    <>
                      <Sparkles size={15} className="mr-2 inline" />
                      Generate Summary
                    </>
                  )}
                </button>
              </div>

              {!extractedText && (
                <p className="mt-4 text-sm text-slate-500">
                  Upload a PDF to generate its summary.
                </p>
              )}

              {isSummarizing && (
                <p className="mt-4 text-sm text-cyan-300">
                  <Sparkles size={15} className="mr-2 inline animate-pulse" />
                  Gemini is analysing your document...
                </p>
              )}

              {summaryError && (
                <p className="mt-4 text-sm text-red-400">
                  {summaryError}
                </p>
              )}

              {summary && (
                <div className="mt-5 rounded-xl border border-white/10 bg-white/[0.04] p-5">
                  <div className="mb-3 flex items-center gap-2">
                    <FileText size={17} className="text-cyan-400" />

                    <h3 className="font-semibold text-white">
                      Document Summary
                    </h3>
                  </div>

                 <div className="break-words text-left text-sm leading-7 text-slate-300">
  {renderAnswer(summary)}
</div>
                </div>
              )}
            </div>

            {/* ================= AI DOCUMENT CHAT ================= */}

            <div className="mt-5 rounded-xl border border-violet-400/20 bg-violet-500/5 p-4 sm:p-5">
              {/* Chat Header */}
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2 text-sm font-semibold">
                  <Sparkles size={18} className="text-violet-400" />
                  Chat with your document
                </div>

                <button
                  type="button"
                  onClick={handleNewChat}
                  disabled={!extractedText || isAsking}
                  className="rounded-lg border border-white/10 px-3 py-2 text-xs font-medium text-slate-300 transition hover:border-violet-400/50 hover:text-white disabled:opacity-40"
                >
                  <Plus size={13} className="mr-1 inline" />
                  New Chat
                </button>
              </div>

              <p className="mt-2 text-xs text-slate-400">
                Ask questions and get answers based on your uploaded PDF.
              </p>

              {!extractedText && (
                <p className="mt-4 text-sm text-slate-500">
                  Upload a PDF and wait for text extraction to finish to start chatting.
                </p>
              )}

              {/* Previous Conversations */}
              {conversations.length > 0 && (
                <div className="mt-5 rounded-xl border border-white/10 bg-[#080914]/60 p-4">
                  <div className="mb-3 flex items-center justify-between">
                    <p className="text-xs font-semibold tracking-wide text-slate-400">
                      PREVIOUS CONVERSATIONS
                    </p>

                    <span className="text-xs text-slate-500">
                      {conversations.length} chats
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {conversations.map((conversation) => (
                      <button
                        key={conversation.id}
                        type="button"
                        onClick={() =>
                          handleSelectConversation(conversation.id)
                        }
                        disabled={isAsking}
                        className={`max-w-full truncate rounded-lg border px-3 py-2 text-xs transition ${
                          activeConversationId === conversation.id
                            ? "border-violet-400 bg-violet-500/20 text-white"
                            : "border-white/10 bg-white/5 text-slate-300 hover:border-violet-400/50"
                        }`}
                        title={conversation.title}
                      >
                        {conversation.title}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Chat Messages */}
              <div
                id="chat-messages"
                className="mt-5 max-h-[480px] min-h-0 space-y-5 overflow-y-auto rounded-xl border border-white/10 bg-[#090b19]/80 p-3 sm:p-5"
                aria-live="polite"
              >
                {messages.length === 0 && !isAsking && (
                  <div className="flex min-h-[180px] flex-col items-center justify-center text-center">
                    <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-2xl border border-violet-400/20 bg-violet-500/10">
                      <BrainCircuit
                        size={23}
                        className="text-violet-400"
                      />
                    </div>

                    <h3 className="text-sm font-semibold text-white">
                      Start a conversation
                    </h3>

                    <p className="mt-2 max-w-sm text-xs leading-6 text-slate-400">
                      Ask anything about your uploaded document. DocuMind AI
                      will find relevant information and provide answers with
                      page references.
                    </p>
                  </div>
                )}

                {messages.map((message, index) => (
                  <div
                    key={index}
                    className={`flex w-full items-start gap-3 ${
                      message.role === "user"
                        ? "justify-end"
                        : "justify-start"
                    }`}
                  >
                    {message.role === "ai" && (
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-violet-400/20 bg-violet-500/15">
                        <Bot size={19} className="text-violet-300" />
                      </div>
                    )}

                    <div
                      className={`min-w-0 max-w-[90%] rounded-2xl px-4 py-3 sm:max-w-[85%] ${
                        message.role === "user"
                          ? "rounded-tr-sm border border-violet-400/20 bg-violet-600/20 text-white"
                          : "rounded-tl-sm border border-white/10 bg-[#171a30] text-slate-300"
                      }`}
                    >
                      <div
                        className={`mb-2 flex items-center gap-2 text-xs font-semibold ${
                          message.role === "user"
                            ? "justify-end text-violet-200"
                            : "text-violet-300"
                        }`}
                      >
                        {message.role === "user" ? (
                          <>
                            You
                            <User size={13} />
                          </>
                        ) : (
                          <>
                            <Sparkles size={13} />
                            DocuMind AI
                          </>
                        )}
                      </div>

                      <div className="break-words text-left text-sm leading-7">
                        {message.role === "ai"
                          ? renderAnswer(message.text)
                          : message.text}
                      </div>
                    </div>

                    {message.role === "user" && (
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/10">
                        <User size={18} className="text-slate-300" />
                      </div>
                    )}
                  </div>
                ))}

                {/* AI Loading Indicator */}
                {isAsking && (
                  <div className="flex items-start gap-3">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-violet-400/20 bg-violet-500/15">
                      <Bot size={19} className="text-violet-300" />
                    </div>

                    <div className="rounded-2xl rounded-tl-sm border border-white/10 bg-[#171a30] px-4 py-3">
                      <p className="mb-2 text-xs font-semibold text-violet-300">
                        DocuMind AI
                      </p>

                      <div className="flex items-center gap-2 text-sm text-slate-400">
                        <span className="h-2 w-2 animate-bounce rounded-full bg-violet-400" />
                        <span className="h-2 w-2 animate-bounce rounded-full bg-violet-400 [animation-delay:150ms]" />
                        <span className="h-2 w-2 animate-bounce rounded-full bg-violet-400 [animation-delay:300ms]" />
                        <span className="ml-1">
                          Analysing your document...
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Chat Error */}
              {chatError && (
                <p className="mt-3 rounded-lg border border-red-400/20 bg-red-500/10 p-3 text-sm text-red-400">
                  {chatError}
                </p>
              )}

              {/* Chat Input */}
              <div className="mt-4 flex flex-col gap-3 sm:flex-row">
                <input
                  type="text"
                  value={question}
                  onChange={(event) => setQuestion(event.target.value)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter") {
                      event.preventDefault();
                      void handleAskQuestion();
                    }
                  }}
                  disabled={!extractedText || isAsking}
                  placeholder="Ask something about your PDF..."
                  className="min-w-0 flex-1 rounded-xl border border-white/10 bg-[#080914] px-4 py-3.5 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-violet-400 disabled:opacity-50"
                />

                <button
                  type="button"
                  onClick={handleAskQuestion}
                  disabled={
                    !extractedText || !question.trim() || isAsking
                  }
                  className="rounded-xl bg-violet-600 px-5 py-3.5 text-sm font-semibold text-white transition hover:bg-violet-500 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {isAsking ? "Thinking..." : "Ask AI"}

                  <ArrowRight
                    size={16}
                    className="ml-2 inline"
                  />
                </button>
              </div>

              <p className="mt-3 text-center text-[11px] text-slate-500">
                DocuMind AI can make mistakes. Verify important information
                with your original document.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ================= LANDING PAGE =================

function LandingPage() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-[#080914] px-5 text-white">
      <div className="pointer-events-none absolute left-1/2 top-0 h-[500px] w-[700px] -translate-x-1/2 rounded-full bg-violet-700/10 blur-[140px]" />

      <div className="relative mx-auto max-w-7xl">
        <Navbar />

        <section className="pb-20 pt-20 text-center md:pt-28">
          <div className="mx-auto inline-flex items-center gap-2 rounded-full border border-violet-400/20 bg-violet-500/10 px-4 py-2 text-xs text-violet-300">
            <Sparkles size={14} />
            Introducing intelligent document analysis
          </div>

          <h1 className="mx-auto mt-8 max-w-4xl text-4xl font-bold leading-tight tracking-tight sm:text-6xl md:text-7xl">
            Your documents.
            <br />
            <span className="bg-gradient-to-r from-violet-400 via-purple-300 to-cyan-300 bg-clip-text text-transparent">
              Smarter than ever.
            </span>
          </h1>

          <p className="mx-auto mt-7 max-w-2xl text-base leading-8 text-slate-400 md:text-lg">
            Upload, understand and explore your documents with AI.
            Find answers, uncover insights and save hours of reading.
          </p>

          <div className="mt-9 flex flex-wrap items-center justify-center gap-4">
            <Link
              to="/register"
              className="rounded-full bg-violet-600 px-7 py-3.5 text-sm font-semibold shadow-lg shadow-violet-900/40 transition hover:-translate-y-1 hover:bg-violet-500"
            >
              Start for free
              <ArrowRight size={17} className="ml-2 inline" />
            </Link>

            <Link
              to="/login"
              className="rounded-full border border-white/15 px-7 py-3.5 text-sm font-semibold text-slate-200 transition hover:bg-white/5"
            >
              <Upload size={16} className="mr-2 inline" />
              Explore workspace
            </Link>
          </div>

          <div className="mt-7 flex flex-wrap justify-center gap-6 text-xs text-slate-500">
            <span>
              <ShieldCheck size={14} className="mr-1 inline text-green-400" />
              Secure workspace
            </span>

            <span>
              <Zap size={14} className="mr-1 inline text-yellow-400" />
              AI-powered insights
            </span>

            <span>
              <FileText size={14} className="mr-1 inline text-violet-400" />
              PDF support
            </span>
          </div>
        </section>

        <Features />
        <HowItWorks />
        <Pricing />
        <Footer />
      </div>
    </main>
  );
}

// ================= PROTECTED WORKSPACE =================

type WorkspacePageProps = {
  user: AuthUser;
  onLogout: () => void;
};

function WorkspacePage({ user, onLogout }: WorkspacePageProps) {
  return (
    <main className="relative min-h-screen overflow-hidden bg-[#080914] px-5 py-6 text-white">
      <div className="pointer-events-none absolute left-1/2 top-0 h-[500px] w-[700px] -translate-x-1/2 rounded-full bg-violet-700/10 blur-[140px]" />

      <div className="relative mx-auto max-w-7xl">
        <header className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <Link to="/" className="flex items-center gap-2 text-xl font-bold">
            <Sparkles className="text-violet-400" />
            <span>DocuMind AI</span>
          </Link>

          <div className="flex items-center gap-3">
            <span className="hidden text-sm text-slate-400 sm:inline">
              Welcome, {user.name}
            </span>

            <button
              type="button"
              onClick={onLogout}
              className="rounded-xl border border-white/15 px-4 py-2 text-sm font-medium text-slate-200 transition hover:border-violet-400/50 hover:bg-white/5"
            >
              Log out
            </button>
          </div>
        </header>

        <ProductPreview />
      </div>
    </main>
  );
}

// ================= MAIN APP / ROUTING =================

function App() {
  const navigate = useNavigate();

  const [user, setUser] = useState<AuthUser | null>(null);
  const [checkingSession, setCheckingSession] = useState(true);

  // Check whether the user already has a valid login session
  useEffect(() => {
    let isMounted = true;

    const checkSession = async () => {
      try {
        const response = await fetch("https://documind-ai-buwz.onrender.com/api/auth/me", {
          method: "GET",
          credentials: "include",
        });

        if (!response.ok) {
          if (isMounted) {
            setUser(null);
          }
          return;
        }

        const data = await response.json();

        if (isMounted && data.user) {
          setUser(data.user as AuthUser);
        }
      } catch (error) {
        console.error("Session check failed:", error);

        if (isMounted) {
          setUser(null);
        }
      } finally {
        if (isMounted) {
          setCheckingSession(false);
        }
      }
    };

    void checkSession();

    return () => {
      isMounted = false;
    };
  }, []);

  // Called after successful login or registration
  const handleAuthenticated = (authenticatedUser: AuthUser) => {
    setUser(authenticatedUser);
    navigate("/workspace", { replace: true });
  };

  // Log out the current user
  const handleLogout = async () => {
    try {
      await fetch("https://documind-ai-buwz.onrender.com/api/auth/logout", {
        method: "POST",
        credentials: "include",
      });
    } catch (error) {
      console.error("Logout request failed:", error);
    } finally {
      setUser(null);
      navigate("/", { replace: true });
    }
  };

  // Wait until the existing login session has been checked
  if (checkingSession) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#080914] text-sm text-slate-300">
        Checking your session...
      </div>
    );
  }

  return (
    <Routes>
      {/* Public landing page */}
      <Route
        path="/"
        element={
          user ? <Navigate to="/workspace" replace /> : <LandingPage />
        }
      />

      {/* Login page */}
      <Route
        path="/login"
        element={
          user ? (
            <Navigate to="/workspace" replace />
          ) : (
            <Login onAuthenticated={handleAuthenticated} />
          )
        }
      />

      {/* Registration page */}
      <Route
        path="/register"
        element={
          user ? (
            <Navigate to="/workspace" replace />
          ) : (
            <Register onAuthenticated={handleAuthenticated} />
          )
        }
      />

      {/* Protected workspace */}
      <Route
        path="/workspace"
        element={
          user ? (
            <WorkspacePage user={user} onLogout={handleLogout} />
          ) : (
            <Navigate to="/login" replace />
          )
        }
      />

      {/* Unknown routes */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;