"use client";

import { useState, useEffect } from "react";
import { 
  Play, 
  Terminal, 
  Copy, 
  Check, 
  RotateCcw, 
  Upload, 
  CheckCircle2, 
  AlertCircle, 
  Clock, 
  Sparkles,
  Link as LinkIcon
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { EngramAPI, getStoredApiKey, setStoredApiKey } from "@/lib/api-client";

interface EndpointPreset {
  method: "GET" | "POST";
  path: string;
  defaultBody?: string;
  requiresFile?: boolean;
  description: string;
}

const PRESETS: Record<string, EndpointPreset> = {
  "/api/v1/query": {
    method: "POST",
    path: "/api/v1/query",
    description: "Full RAG retrieval, neural rerank, and Gemini answer generation with citations",
    defaultBody: JSON.stringify({
      query_text: "What were the key financial results and revenue drivers in Q3?",
      top_k: 5
    }, null, 2),
  },
  "/api/v1/search": {
    method: "POST",
    path: "/api/v1/search",
    description: "Hybrid dense (Qdrant) + sparse (BM25) search with BGE reranking",
    defaultBody: JSON.stringify({
      query_text: "data retention compliance and security policies",
      top_k: 3
    }, null, 2),
  },
  "/api/v1/documents": {
    method: "GET",
    path: "/api/v1/documents",
    description: "List all documents and processing statuses in the workspace",
  },
  "/api/v1/documents/ingest": {
    method: "POST",
    path: "/api/v1/documents/ingest",
    description: "Upload a PDF, DOCX, TXT file or supply a web URL",
    requiresFile: true,
  },
  "/health": {
    method: "GET",
    path: "/health",
    description: "Basic microservice liveness check",
  },
};

export default function PlaygroundPage() {
  const [selectedEndpoint, setSelectedEndpoint] = useState<string>("/api/v1/query");
  const [apiKey, setApiKey] = useState<string>("sk-engram-demo-testkey-8912");
  const [requestBody, setRequestBody] = useState<string>(PRESETS["/api/v1/query"].defaultBody || "");
  const [ingestMode, setIngestMode] = useState<"file" | "url">("file");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [inputUrl, setInputUrl] = useState<string>("https://raw.githubusercontent.com/example/spec.md");
  
  // Response states
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [responseStatus, setResponseStatus] = useState<number | null>(null);
  const [responseLatency, setResponseLatency] = useState<number | null>(null);
  const [responseBody, setResponseBody] = useState<string | null>(null);
  const [isCopied, setIsCopied] = useState<boolean>(false);

  useEffect(() => {
    const key = getStoredApiKey();
    if (key) setApiKey(key);
  }, []);

  const handleEndpointChange = (endpointKey: string) => {
    setSelectedEndpoint(endpointKey);
    const preset = PRESETS[endpointKey];
    if (preset.defaultBody) {
      setRequestBody(preset.defaultBody);
    } else {
      setRequestBody("");
    }
  };

  const handleExecuteRequest = async () => {
    setIsLoading(true);
    setResponseStatus(null);
    setResponseLatency(null);
    setResponseBody(null);
    const startTime = performance.now();

    try {
      const preset = PRESETS[selectedEndpoint];
      
      // Save user key to storage
      if (apiKey) setStoredApiKey(apiKey);

      if (selectedEndpoint === "/health") {
        const res = await EngramAPI.checkHealth();
        const elapsed = Math.round(performance.now() - startTime);
        setResponseStatus(200);
        setResponseLatency(elapsed);
        setResponseBody(JSON.stringify(res, null, 2));
      } else if (selectedEndpoint === "/api/v1/query") {
        let parsed = { query_text: "What were the results?", top_k: 5 };
        try {
          parsed = JSON.parse(requestBody);
        } catch {
          toast.error("Invalid JSON in request body");
          setIsLoading(false);
          return;
        }
        const res = await EngramAPI.query(parsed);
        const elapsed = Math.round(performance.now() - startTime);
        setResponseStatus(200);
        setResponseLatency(res.latency_ms || elapsed);
        setResponseBody(JSON.stringify(res, null, 2));
      } else if (selectedEndpoint === "/api/v1/search") {
        let parsed = { query_text: "compliance", top_k: 3 };
        try {
          parsed = JSON.parse(requestBody);
        } catch {
          toast.error("Invalid JSON in request body");
          setIsLoading(false);
          return;
        }
        const res = await EngramAPI.search(parsed);
        const elapsed = Math.round(performance.now() - startTime);
        setResponseStatus(200);
        setResponseLatency(res.latency_ms || elapsed);
        setResponseBody(JSON.stringify(res, null, 2));
      } else if (selectedEndpoint === "/api/v1/documents") {
        const docs = await EngramAPI.listDocuments();
        const elapsed = Math.round(performance.now() - startTime);
        setResponseStatus(200);
        setResponseLatency(elapsed);
        setResponseBody(JSON.stringify({ documents: docs, total: docs.length, skip: 0, limit: 20 }, null, 2));
      } else if (selectedEndpoint === "/api/v1/documents/ingest") {
        let res;
        if (ingestMode === "file") {
          if (!selectedFile) {
            toast.error("Please choose a file to ingest");
            setIsLoading(false);
            return;
          }
          res = await EngramAPI.ingestDocumentFile(selectedFile);
        } else {
          if (!inputUrl) {
            toast.error("Please enter a valid document URL");
            setIsLoading(false);
            return;
          }
          res = await EngramAPI.ingestDocumentUrl(inputUrl);
        }
        const elapsed = Math.round(performance.now() - startTime);
        setResponseStatus(200);
        setResponseLatency(elapsed);
        setResponseBody(JSON.stringify(res, null, 2));
      }
    } catch (err: any) {
      const elapsed = Math.round(performance.now() - startTime);
      setResponseStatus(500);
      setResponseLatency(elapsed);
      setResponseBody(JSON.stringify({
        error: {
          code: "REQUEST_FAILED",
          message: err?.message || "Execution error",
        }
      }, null, 2));
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopyResponse = () => {
    if (!responseBody) return;
    navigator.clipboard.writeText(responseBody);
    setIsCopied(true);
    toast.success("Response copied to clipboard");
    setTimeout(() => setIsCopied(false), 2000);
  };

  const currentPreset = PRESETS[selectedEndpoint];

  return (
    <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 flex-1 flex flex-col">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 mb-6 border-b border-white/[0.08] gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-emerald-400 mb-1">
            <Terminal className="w-4 h-4" />
            <span>INTERACTIVE API SANDBOX</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            Engram Playground
          </h1>
          <p className="text-xs text-zinc-400 mt-1">
            Live query and test the FastAPI backend microservice directly in your browser.
          </p>
        </div>

        {/* Action button */}
        <div className="flex items-center gap-3">
          <Button
            onClick={() => {
              setResponseBody(null);
              setResponseStatus(null);
              setResponseLatency(null);
            }}
            variant="ghost"
            size="sm"
            className="text-xs text-zinc-400 hover:text-white"
          >
            <RotateCcw className="w-3.5 h-3.5 mr-1" />
            <span>Clear</span>
          </Button>

          <Button
            onClick={handleExecuteRequest}
            disabled={isLoading}
            size="sm"
            className="bg-emerald-500 text-black font-semibold hover:bg-emerald-400 text-xs px-4 h-9 shadow-[0_0_15px_rgba(16,185,129,0.2)]"
          >
            {isLoading ? (
              <span className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full border-2 border-black border-t-transparent animate-spin" />
                Executing...
              </span>
            ) : (
              <span className="flex items-center gap-1.5">
                <Play className="w-3.5 h-3.5 fill-current" />
                Send Request
              </span>
            )}
          </Button>
        </div>
      </div>

      {/* Main Two-Column Playground */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 flex-1 items-stretch">
        
        {/* Left Column: Request Configuration */}
        <div className="lg:col-span-6 rounded-xl border border-white/[0.08] bg-[#08090d] p-5 flex flex-col space-y-4">
          
          <div className="flex items-center justify-between pb-3 border-b border-white/[0.06]">
            <span className="text-xs font-mono uppercase tracking-wider text-zinc-300 font-semibold">
              Request Configuration
            </span>
            <span className="text-[11px] font-mono text-zinc-500">
              Target: http://localhost:8000
            </span>
          </div>

          {/* Endpoint Selector */}
          <div className="space-y-1.5">
            <label className="text-xs font-mono text-zinc-400">Endpoint</label>
            <div className="flex items-center gap-2">
              <span className={`px-2 py-1.5 rounded text-xs font-mono font-bold border ${
                currentPreset.method === "POST" 
                  ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30"
                  : "bg-sky-500/10 text-sky-400 border-sky-500/30"
              }`}>
                {currentPreset.method}
              </span>
              <select
                value={selectedEndpoint}
                onChange={(e) => handleEndpointChange(e.target.value)}
                className="flex-1 bg-[#050608] border border-white/[0.08] rounded-md px-3 py-1.5 text-xs font-mono text-zinc-200 focus:outline-none focus:border-emerald-500/50"
              >
                {Object.keys(PRESETS).map((key) => (
                  <option key={key} value={key} className="bg-[#0c0d12]">
                    {PRESETS[key].method} {key}
                  </option>
                ))}
              </select>
            </div>
            <p className="text-[11px] text-zinc-500 font-mono mt-1">
              {currentPreset.description}
            </p>
          </div>

          {/* Headers: API Key */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-mono text-zinc-400">Header: x-api-key</label>
              <span className="text-[10px] font-mono text-emerald-400">Scoped Tenant Key</span>
            </div>
            <input
              type="text"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="sk-engram-..."
              className="w-full bg-[#050608] border border-white/[0.08] rounded-md px-3 py-1.5 text-xs font-mono text-zinc-300 focus:outline-none focus:border-emerald-500/50"
            />
          </div>

          {/* Request Body / Ingestion input */}
          <div className="flex-1 flex flex-col space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-mono text-zinc-400">
                {currentPreset.requiresFile ? "Ingestion Input" : "Request JSON Body"}
              </label>
              {currentPreset.requiresFile && (
                <div className="flex items-center gap-1 text-[11px] font-mono">
                  <button
                    onClick={() => setIngestMode("file")}
                    className={`px-2 py-0.5 rounded ${ingestMode === "file" ? "bg-white/[0.08] text-white" : "text-zinc-500"}`}
                  >
                    File
                  </button>
                  <button
                    onClick={() => setIngestMode("url")}
                    className={`px-2 py-0.5 rounded ${ingestMode === "url" ? "bg-white/[0.08] text-white" : "text-zinc-500"}`}
                  >
                    URL
                  </button>
                </div>
              )}
            </div>

            {currentPreset.requiresFile ? (
              <div className="flex-1 min-h-[180px] rounded-lg border border-dashed border-white/[0.1] bg-[#050608] p-6 flex flex-col items-center justify-center text-center">
                {ingestMode === "file" ? (
                  <div className="space-y-3">
                    <div className="w-10 h-10 rounded-full bg-white/[0.03] border border-white/[0.08] flex items-center justify-center mx-auto text-zinc-400">
                      <Upload className="w-5 h-5 text-emerald-400" />
                    </div>
                    <div>
                      <label className="cursor-pointer text-xs font-mono text-emerald-400 hover:text-emerald-300 underline">
                        Choose a document (PDF, DOCX, TXT, MD)
                        <input
                          type="file"
                          accept=".pdf,.docx,.txt,.md"
                          className="hidden"
                          onChange={(e) => {
                            if (e.target.files && e.target.files[0]) {
                              setSelectedFile(e.target.files[0]);
                              toast.success(`Selected: ${e.target.files[0].name}`);
                            }
                          }}
                        />
                      </label>
                    </div>
                    {selectedFile ? (
                      <div className="text-xs font-mono text-zinc-300 flex items-center gap-1.5 justify-center">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                        <span>{selectedFile.name} ({(selectedFile.size / 1024).toFixed(1)} KB)</span>
                      </div>
                    ) : (
                      <p className="text-[11px] text-zinc-500 font-mono">
                        No file chosen yet
                      </p>
                    )}
                  </div>
                ) : (
                  <div className="w-full space-y-3 px-4">
                    <div className="flex items-center gap-2">
                      <LinkIcon className="w-4 h-4 text-emerald-400 shrink-0" />
                      <input
                        type="url"
                        value={inputUrl}
                        onChange={(e) => setInputUrl(e.target.value)}
                        placeholder="https://example.com/document.pdf"
                        className="w-full bg-[#08090e] border border-white/[0.08] rounded-md px-3 py-1.5 text-xs font-mono text-zinc-200"
                      />
                    </div>
                    <p className="text-[11px] text-zinc-500 font-mono">
                      Engram will fetch, parse HTML/PDF, and index sections automatically.
                    </p>
                  </div>
                )}
              </div>
            ) : currentPreset.defaultBody ? (
              <textarea
                value={requestBody}
                onChange={(e) => setRequestBody(e.target.value)}
                rows={10}
                className="flex-1 w-full bg-[#050608] border border-white/[0.08] rounded-lg p-3.5 font-mono text-xs text-zinc-300 focus:outline-none focus:border-emerald-500/50 resize-none leading-relaxed"
                spellCheck={false}
              />
            ) : (
              <div className="flex-1 min-h-[160px] rounded-lg border border-dashed border-white/[0.06] flex items-center justify-center text-xs font-mono text-zinc-500">
                GET request does not require a request body.
              </div>
            )}
          </div>

        </div>

        {/* Right Column: Live Response Viewer */}
        <div className="lg:col-span-6 rounded-xl border border-white/[0.08] bg-[#08090d] p-5 flex flex-col space-y-4">
          
          <div className="flex items-center justify-between pb-3 border-b border-white/[0.06]">
            <div className="flex items-center gap-3">
              <span className="text-xs font-mono uppercase tracking-wider text-zinc-300 font-semibold">
                Response
              </span>
              {responseStatus !== null && (
                <span className={`px-2 py-0.5 rounded text-[11px] font-mono font-bold border ${
                  responseStatus === 200 || responseStatus === 201
                    ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30"
                    : "bg-rose-500/10 text-rose-400 border-rose-500/30"
                }`}>
                  {responseStatus} {responseStatus === 200 ? "OK" : responseStatus === 201 ? "CREATED" : "ERROR"}
                </span>
              )}
            </div>

            <div className="flex items-center gap-3">
              {responseLatency !== null && (
                <div className="flex items-center gap-1 text-[11px] font-mono text-zinc-400">
                  <Clock className="w-3 h-3 text-emerald-400" />
                  <span>{responseLatency} ms</span>
                </div>
              )}

              {responseBody && (
                <button
                  onClick={handleCopyResponse}
                  className="text-xs font-mono text-zinc-400 hover:text-white flex items-center gap-1 transition-colors"
                >
                  {isCopied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                  <span>Copy</span>
                </button>
              )}
            </div>
          </div>

          {/* Response Payload */}
          <div className="flex-1 min-h-[300px] rounded-lg bg-[#050608] border border-white/[0.06] p-4 font-mono text-xs overflow-auto flex flex-col">
            {isLoading ? (
              <div className="flex-1 flex flex-col items-center justify-center text-zinc-500 space-y-2">
                <div className="w-5 h-5 rounded-full border-2 border-emerald-400 border-t-transparent animate-spin" />
                <span className="text-xs font-mono">Running retrieval pipeline...</span>
              </div>
            ) : responseBody ? (
              <pre className="text-emerald-300/90 whitespace-pre-wrap leading-relaxed">
                <code>{responseBody}</code>
              </pre>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center text-zinc-600 text-center px-4 space-y-2">
                <Sparkles className="w-6 h-6 text-zinc-700" />
                <p className="text-xs font-mono">No request sent yet.</p>
                <p className="text-[11px] text-zinc-600">
                  Select an endpoint and click &quot;Send Request&quot; to inspect real-time outputs and latency.
                </p>
              </div>
            )}
          </div>

        </div>

      </div>

    </div>
  );
}
