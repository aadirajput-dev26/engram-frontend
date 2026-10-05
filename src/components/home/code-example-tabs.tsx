"use client";

import { useState } from "react";
import { Check, Copy, Terminal } from "lucide-react";
import { toast } from "sonner";

type Language = "curl" | "typescript" | "python";
type Action = "query" | "ingest" | "search";

const CODE_SNIPPETS: Record<Action, Record<Language, string>> = {
  query: {
    curl: `curl -X POST http://localhost:8000/api/v1/query \\
  -H "x-api-key: sk-engram-prod-8f92a10c" \\
  -H "Content-Type: application/json" \\
  -d '{
    "query_text": "What were the primary revenue drivers in Q3?",
    "top_k": 5
  }'`,
    typescript: `import { EngramClient } from "@engram/sdk";

const engram = new EngramClient({
  apiKey: process.env.ENGRAM_API_KEY, // sk-engram-*
});

const response = await engram.query({
  queryText: "What were the primary revenue drivers in Q3?",
  topK: 5,
});

console.log(response.answer);
// Response includes exact page-level citations:
for (const citation of response.citations) {
  console.log(\`Page \${citation.pageStart}: \${citation.snippet}\`);
}`,
    python: `from engram import EngramClient

client = EngramClient(api_key="sk-engram-prod-8f92a10c")

response = client.query(
    query_text="What were the primary revenue drivers in Q3?",
    top_k=5,
)

print(response.answer)
for cit in response.citations:
    print(f"[{cit.citation_id}] Page {cit.page_start}: {cit.snippet}")`,
  },

  ingest: {
    curl: `curl -X POST http://localhost:8000/api/v1/documents/ingest \\
  -H "x-api-key: sk-engram-prod-8f92a10c" \\
  -F "file=@financial_report_q3.pdf" \\
  -F "filename=financial_report_q3.pdf"`,
    typescript: `const formData = new FormData();
formData.append("file", fileBlob, "financial_report_q3.pdf");

const res = await fetch("http://localhost:8000/api/v1/documents/ingest", {
  method: "POST",
  headers: {
    "x-api-key": process.env.ENGRAM_API_KEY!,
  },
  body: formData,
});

const data = await res.json();
console.log(\`Document ID: \${data.document_id}, Status: \${data.status}\`);`,
    python: `import httpx

with open("financial_report_q3.pdf", "rb") as f:
    response = httpx.post(
        "http://localhost:8000/api/v1/documents/ingest",
        headers={"x-api-key": "sk-engram-prod-8f92a10c"},
        files={"file": ("financial_report_q3.pdf", f, "application/pdf")},
    )

print(response.json())
# Returns: {"document_id": "...", "job_id": "...", "status": "QUEUED"}`,
  },

  search: {
    curl: `curl -X POST http://localhost:8000/api/v1/search \\
  -H "x-api-key: sk-engram-prod-8f92a10c" \\
  -H "Content-Type: application/json" \\
  -d '{
    "query_text": "data retention compliance policies",
    "top_k": 3
  }'`,
    typescript: `const response = await fetch("http://localhost:8000/api/v1/search", {
  method: "POST",
  headers: {
    "x-api-key": process.env.ENGRAM_API_KEY!,
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    query_text: "data retention compliance policies",
    top_k: 3,
  }),
});

const results = await response.json();
// Returns ranked chunks with semantic + keyword + rerank scores`,
    python: `import httpx

response = httpx.post(
    "http://localhost:8000/api/v1/search",
    headers={
        "x-api-key": "sk-engram-prod-8f92a10c",
        "Content-Type": "application/json",
    },
    json={
        "query_text": "data retention compliance policies",
        "top_k": 3,
    },
)

for result in response.json()["results"]:
    print(f"Rerank Score: {result['rerank_score']} | {result['snippet']}")`,
  },
};

export function CodeExampleTabs() {
  const [selectedAction, setSelectedAction] = useState<Action>("query");
  const [selectedLanguage, setSelectedLanguage] = useState<Language>("curl");
  const [copied, setCopied] = useState(false);

  const currentCode = CODE_SNIPPETS[selectedAction][selectedLanguage];

  const handleCopy = () => {
    navigator.clipboard.writeText(currentCode);
    setCopied(true);
    toast.success("Code snippet copied to clipboard");
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="w-full rounded-xl border border-white/[0.08] bg-[#07090e] overflow-hidden shadow-2xl">
      {/* Top action selector */}
      <div className="flex flex-wrap items-center justify-between border-b border-white/[0.06] bg-white/[0.02] px-4 py-2.5 gap-2">
        <div className="flex items-center gap-1.5">
          <span className="text-[11px] font-mono text-zinc-500 mr-2">Endpoint:</span>
          {(["query", "ingest", "search"] as Action[]).map((action) => (
            <button
              key={action}
              onClick={() => setSelectedAction(action)}
              className={`px-2.5 py-1 rounded text-xs font-mono transition-all ${
                selectedAction === action
                  ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/30"
                  : "text-zinc-400 hover:text-zinc-200 hover:bg-white/[0.04]"
              }`}
            >
              {action === "query" && "POST /api/v1/query"}
              {action === "ingest" && "POST /api/v1/documents/ingest"}
              {action === "search" && "POST /api/v1/search"}
            </button>
          ))}
        </div>

        {/* Language Tabs */}
        <div className="flex items-center gap-1">
          {(["curl", "typescript", "python"] as Language[]).map((lang) => (
            <button
              key={lang}
              onClick={() => setSelectedLanguage(lang)}
              className={`px-2.5 py-1 rounded text-xs font-mono uppercase transition-all ${
                selectedLanguage === lang
                  ? "bg-white/[0.08] text-white"
                  : "text-zinc-500 hover:text-zinc-300"
              }`}
            >
              {lang === "curl" ? "cURL" : lang === "typescript" ? "TypeScript" : "Python"}
            </button>
          ))}

          <button
            onClick={handleCopy}
            className="ml-2 p-1.5 rounded hover:bg-white/[0.08] text-zinc-400 hover:text-white transition-colors"
            title="Copy Code"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* Code viewer */}
      <div className="p-4 sm:p-6 overflow-x-auto font-mono text-xs text-zinc-300 leading-relaxed bg-[#050608]">
        <pre className="selection:bg-emerald-500/30">
          <code>{currentCode}</code>
        </pre>
      </div>

      {/* Footer bar */}
      <div className="border-t border-white/[0.06] bg-white/[0.01] px-4 py-2 flex items-center justify-between text-[11px] font-mono text-zinc-500">
        <div className="flex items-center gap-2">
          <Terminal className="w-3.5 h-3.5 text-emerald-400" />
          <span>Real API contract derived from FastAPI backend</span>
        </div>
        <span>Authentication: x-api-key: sk-engram-*</span>
      </div>
    </div>
  );
}
