import React, { useState, useRef, useEffect } from "react";
import { useAppContext } from "../context/AppContext";
import { useNavigate } from "react-router-dom";

const BuilderPage = () => {
  const { logout } = useAppContext();


const navigate = useNavigate();
  const [messages, setMessages] = useState([
    { role: "assistant", content: "Hi! Describe the webpage you want to build." },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [generatedCode, setGeneratedCode] = useState("");
  const [activeTab, setActiveTab] = useState("preview");
  const chatEndRef = useRef(null);
  const iframeRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const extractCode = (text) => {
    const match = text.match(/```(?:html|jsx|tsx|javascript|js)?\n([\s\S]*?)```/);
    return match ? match[1].trim() : text.trim();
  };

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userMessage = { role: "user", content: input };
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInput("");
    setLoading(true);

    try {
      const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          
        },
        body: JSON.stringify({
          model: "llama-3.3-70b-versatile",
          messages: [
            {
              role: "system",
               content:
                 `You are PromptCode AI — an elite code generation engine. When a user describes anything, you generate a complete, beautiful, fully functional single-file HTML/CSS/JS application or any other tools when mentiontion by user.

STRICT RULES:
- Return ONLY code inside a html code block. Zero explanation. Zero preamble.
- Every output must be a complete standalone HTML file with embedded CSS and JS.
- UI must be stunning — gradients, animations, glassmorphism, modern fonts from Google Fonts.
- Mobile responsive by default using flexbox/grid.
- All features must actually work — forms submit, buttons click, counters count, games play.
- Use placeholder data to make it feel real and complete.
- If the user asks for an app, build the full app — not a skeleton.
- If the user asks for a game, it must be fully playable.
- If the user asks for a dashboard, populate it with realistic charts and data using Chart.js from CDN.
- If the user asks for a landing page, make it look like it costs $10,000.
- Dark mode by default unless user specifies otherwise.
- Smooth animations on every interaction using CSS transitions and keyframes.
- No Lorem Ipsum — write real, context-aware copy.
- Icons from Font Awesome CDN.
- Never truncate or cut off the code. Always output the complete file.`
            },
            { role: "user", content: input },
          ],
          temperature: 0.7,
          max_tokens: 2000,
        }),
      });

      const data = await response.json();

      if (data.error) {
        throw new Error(data.error.message || "Groq API error");
      }

      const aiText = data.choices?.[0]?.message?.content || "";
      const code = extractCode(aiText);

      setGeneratedCode(code);
      setMessages([
        ...newMessages,
        { role: "assistant", content: "Here's your page! Check the preview →" },
      ]);
      setActiveTab("preview");
    } catch (err) {
      console.error("Generation error:", err);
      setMessages([
        ...newMessages,
        { role: "assistant", content: `Something went wrong: ${err.message}` },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleDownload = () => {
    if (!generatedCode) return;

    const blob = new Blob([generatedCode], { type: "text/html" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = "index.html";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    URL.revokeObjectURL(url);
  };

  const previewSrcDoc =
    generatedCode ||
    "<p style='font-family:sans-serif;padding:16px;color:#999'>Preview will appear here</p>";

  return (
    <div className="flex h-screen w-full">
      {/* LEFT: Chat */}
      <div className="w-1/3 flex flex-col border-r border-zinc-200 bg-zinc-50">
        <div className="p-4 border-b border-zinc-200 bg-white flex items-center justify-between">
          <h1 className="text-lg font-semibold text-zinc-900">Builder Chat</h1>
        <button
  onClick={() => navigate("/")}  
  className="px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-lg hover:bg-red-700 transition duration-200 shadow-md"
>
  Logut
</button>

        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {messages.map((msg, i) => (
            <div
              key={i}
              className={`max-w-[85%] rounded-lg px-3 py-2 text-sm ${
                msg.role === "user"
                  ? "bg-black text-white ml-auto"
                  : "bg-white border border-zinc-200 text-zinc-800"
              }`}
            >
              {msg.content}
            </div>
          ))}
          {loading && (
            <div className="bg-white border border-zinc-200 text-zinc-500 text-sm rounded-lg px-3 py-2 max-w-[85%]">
              Generating...
            </div>
          )}
          <div ref={chatEndRef} />
        </div>

        <div className="p-4 border-t border-zinc-200 bg-white">
          <div className="flex gap-2">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Describe the webpage you want..."
              rows={2}
              className="flex-1 resize-none rounded-lg border border-zinc-300 px-3 py-2 text-sm outline-none focus:border-black"
            />
            <button
              onClick={handleSend}
              disabled={loading}
              className="rounded-lg bg-black px-4 text-white text-sm font-medium hover:bg-zinc-800 disabled:opacity-50"
            >
              Send
            </button>
          </div>
        </div>
      </div>

      {/* RIGHT: Code / Preview */}
      <div className="flex-1 flex flex-col">
        <div className="flex items-center border-b border-zinc-200 bg-white">
          <button
            onClick={() => setActiveTab("preview")}
            className={`px-4 py-2 text-sm font-medium ${
              activeTab === "preview"
                ? "border-b-2 border-black text-black"
                : "text-zinc-500"
            }`}
          >
            Preview
          </button>
          <button
            onClick={() => setActiveTab("code")}
            className={`px-4 py-2 text-sm font-medium ${
              activeTab === "code"
                ? "border-b-2 border-black text-black"
                : "text-zinc-500"
            }`}
          >
            Code
          </button>

          {generatedCode && (
            <button
              onClick={handleDownload}
              className="ml-auto mr-3 rounded-md bg-black px-3 py-1.5 text-xs font-medium text-white hover:bg-zinc-800 transition"
            >
              ⬇ Download Code
            </button>
          )}
        </div>

        <div className="flex-1 overflow-hidden">
          {!generatedCode ? (
            <div className="h-full flex items-center justify-center text-zinc-400 text-sm">
              Generated page will appear here
            </div>
          ) : activeTab === "preview" ? (
            <iframe
              ref={iframeRef}
              title="preview"
              srcDoc={previewSrcDoc}
              sandbox="allow-scripts"
              className="w-full h-full border-0"
            />
          ) : (
            <pre className="h-full overflow-auto p-4 text-sm bg-zinc-900 text-zinc-100">
              <code>{generatedCode}</code>
            </pre>
          )}
        </div>
      </div>
    </div>
  );
};

export default BuilderPage;
