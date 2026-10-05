"use client";

import { useState } from "react";
import Link from "next/link";
import { 
  BookOpen, 
  Terminal, 
  Key, 
  FolderTree, 
  Search, 
  ShieldCheck, 
  AlertCircle, 
  Copy, 
  Check, 
  ChevronRight,
  ExternalLink,
  Code2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export default function DocsPage() {
  const [copiedSnippet, setCopiedSnippet] = useState<string | null>(null);

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedSnippet(id);
    toast.success("Snippet copied to clipboard");
    setTimeout(() => setCopiedSnippet(null), 2000);
  };

  const navLinks = [
    { title: "Introduction", href: "#introduction" },
    { title: "Quickstart", href: "#quickstart" },
    { title: "Architecture", href: "#architecture" },
    { title: "Authentication", href: "#authentication" },
    { title: "Document Ingestion", href: "#ingestion" },
    { title: "Structure & Chunking", href: "#structure" },
    { title: "Hybrid Search", href: "#search" },
    { title: "AI Query & Citations", href: "#query" },
    { title: "Error Handling", href: "#errors" },
  ];

  return (
    <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        
        {/* Left Sticky Sidebar */}
        <aside className="lg:col-span-3 hidden lg:block">
          <div className="sticky top-24 space-y-6 text-xs font-mono">
            <div>
              <span className="text-zinc-500 uppercase tracking-wider block mb-3 font-semibold">
                Documentation
              </span>
              <ul className="space-y-1.5 border-l border-white/[0.08] pl-3">
                {navLinks.map((item) => (
                  <li key={item.href}>
                    <a 
                      href={item.href}
                      className="text-zinc-400 hover:text-white transition-colors block py-1"
                    >
                      {item.title}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div className="pt-4 border-t border-white/[0.08]">
              <span className="text-zinc-500 uppercase tracking-wider block mb-3 font-semibold">
                Reference
              </span>
              <Link
                href="/docs/api"
                className="flex items-center gap-2 text-emerald-400 hover:text-emerald-300 transition-colors py-1"
              >
                <Code2 className="w-3.5 h-3.5" />
                <span>OpenAPI Explorer &rarr;</span>
              </Link>
              <Link
                href="/playground"
                className="flex items-center gap-2 text-zinc-400 hover:text-white transition-colors py-1 mt-1"
              >
                <Terminal className="w-3.5 h-3.5" />
                <span>Interactive Playground &rarr;</span>
              </Link>
            </div>
          </div>
        </aside>

        {/* Center Main Documentation */}
        <main className="lg:col-span-7 space-y-16 text-zinc-300 text-sm leading-relaxed">
          
          {/* Header */}
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-emerald-400 mb-2">
              <BookOpen className="w-4 h-4" />
              <span>DEVELOPER MANUAL</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">
              Engram Documentation
            </h1>
            <p className="text-base text-zinc-400 mt-3 leading-relaxed">
              Everything you need to integrate Engram’s vectorless, structure-aware RAG microservice into your applications.
            </p>
          </div>

          {/* 1. Introduction */}
          <section id="introduction" className="space-y-4 scroll-mt-24 pt-4 border-t border-white/[0.08]">
            <h2 className="text-2xl font-bold text-white">Introduction</h2>
            <p>
              Engram is a standalone, enterprise-grade <strong>RAG-as-a-service microservice</strong> built on FastAPI. It parses technical reports, regulatory disclosures, financial filings, and unstructured enterprise documents into hierarchical structure trees.
            </p>
            <p>
              Rather than blindly splitting documents into arbitrary chunks that sever tables and lose section headings, Engram models documents as tree nodes (sections, subsections, and pages). It couples this with dual-channel search (dense vector via Qdrant + sparse keyword via PostgreSQL BM25) and neural cross-encoder reranking to produce responses with guaranteed, page-level citations.
            </p>

            <div className="p-4 rounded-lg bg-emerald-500/[0.05] border border-emerald-500/20 text-xs text-emerald-300 flex items-start gap-3">
              <ShieldCheck className="w-4 h-4 shrink-0 text-emerald-400 mt-0.5" />
              <div>
                <strong className="block text-emerald-200 mb-1">Cryptographic Isolation</strong>
                Every organization and workspace is cryptographically separated. No data or query context can cross workspace boundaries.
              </div>
            </div>
          </section>

          {/* 2. Quickstart */}
          <section id="quickstart" className="space-y-4 scroll-mt-24 pt-6 border-t border-white/[0.08]">
            <h2 className="text-2xl font-bold text-white">Quickstart</h2>
            <p>
              You can make your first query to the Engram API in under two minutes. All requests expect your secret API key in the <code className="text-emerald-400 font-mono text-xs bg-white/[0.05] px-1.5 py-0.5 rounded">x-api-key</code> header.
            </p>

            <div className="rounded-lg border border-white/[0.08] bg-[#06070a] overflow-hidden">
              <div className="flex items-center justify-between px-4 py-2 border-b border-white/[0.06] text-xs font-mono text-zinc-400">
                <span>cURL Quick Query</span>
                <button
                  onClick={() => copyToClipboard(`curl -X POST http://localhost:8000/api/v1/query \\
  -H "x-api-key: sk-engram-your-key" \\
  -H "Content-Type: application/json" \\
  -d '{"query_text": "What are the Q3 financial results?"}'`, "qs-curl")}
                  className="hover:text-white"
                >
                  {copiedSnippet === "qs-curl" ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>
              <div className="p-4 font-mono text-xs overflow-x-auto text-zinc-300">
                <pre>
{`curl -X POST http://localhost:8000/api/v1/query \\
  -H "x-api-key: sk-engram-your-key" \\
  -H "Content-Type: application/json" \\
  -d '{"query_text": "What are the Q3 financial results?"}'`}
                </pre>
              </div>
            </div>
          </section>

          {/* 3. Architecture */}
          <section id="architecture" className="space-y-4 scroll-mt-24 pt-6 border-t border-white/[0.08]">
            <h2 className="text-2xl font-bold text-white">System Architecture</h2>
            <p>
              Engram sits between your client applications and raw unstructured document files. It exposes a unified REST contract backed by PostgreSQL, Qdrant, and asynchronous background worker queues.
            </p>
            <div className="p-4 rounded-lg bg-white/[0.02] border border-white/[0.08] font-mono text-xs text-zinc-400 space-y-2">
              <div className="text-white font-semibold">Pipeline Flow:</div>
              <div>1. Client &rarr; Ingestion API (Upload PDF / DOCX / Markdown)</div>
              <div>2. Engram Parser &rarr; Hierarchical Section Tree (Page numbers + Heading paths)</div>
              <div>3. Chunking Engine &rarr; Boundary-Preserving Chunks (Never crosses sections)</div>
              <div>4. Dual Retrieval &rarr; Qdrant Dense (1024d) + Postgres BM25 (RRF fusion)</div>
              <div>5. BGE Reranker &rarr; Neural Cross-Attention scoring</div>
              <div>6. LLM Engine &rarr; Grounded synthesis with citations [cit_1, cit_2]</div>
            </div>
          </section>

          {/* 4. Authentication */}
          <section id="authentication" className="space-y-4 scroll-mt-24 pt-6 border-t border-white/[0.08]">
            <h2 className="text-2xl font-bold text-white">Authentication & Keys</h2>
            <p>
              Engram uses a two-tier authentication architecture:
            </p>
            <ul className="list-disc pl-5 space-y-2">
              <li>
                <strong>Admin JWT Tokens (<code className="text-emerald-400 font-mono text-xs">Authorization: Bearer &lt;jwt&gt;</code>)</strong>: Used for organization registration, user authentication, creating workspaces, and issuing API keys.
              </li>
              <li>
                <strong>Service API Keys (<code className="text-emerald-400 font-mono text-xs">x-api-key: sk-engram-*</code>)</strong>: Used by backend servers and clients to ingest documents, manage collections, search, and perform AI queries.
              </li>
            </ul>

            <div className="p-4 rounded-lg bg-amber-500/[0.05] border border-amber-500/20 text-xs text-amber-300 flex items-start gap-3">
              <AlertCircle className="w-4 h-4 shrink-0 text-amber-400 mt-0.5" />
              <div>
                <strong>Secret Key Visibility:</strong> The raw API key value (<code className="font-mono">sk-engram-*</code>) is returned only once upon creation. Store it in a secure environment variable manager.
              </div>
            </div>
          </section>

          {/* 5. Document Ingestion */}
          <section id="ingestion" className="space-y-4 scroll-mt-24 pt-6 border-t border-white/[0.08]">
            <h2 className="text-2xl font-bold text-white">Document Ingestion</h2>
            <p>
              Documents can be ingested via binary file upload or URL scraping via <code className="text-emerald-400 font-mono text-xs">POST /api/v1/documents/ingest</code>.
            </p>
            <p>Supported file types include:</p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono">
              <div className="p-2.5 rounded bg-white/[0.02] border border-white/[0.08] text-center">PDF (.pdf)</div>
              <div className="p-2.5 rounded bg-white/[0.02] border border-white/[0.08] text-center">Word (.docx)</div>
              <div className="p-2.5 rounded bg-white/[0.02] border border-white/[0.08] text-center">Markdown (.md)</div>
              <div className="p-2.5 rounded bg-white/[0.02] border border-white/[0.08] text-center">Plain Text (.txt)</div>
            </div>
          </section>

          {/* 6. Structure & Chunking */}
          <section id="structure" className="space-y-4 scroll-mt-24 pt-6 border-t border-white/[0.08]">
            <h2 className="text-2xl font-bold text-white">Structure-Aware Chunking</h2>
            <p>
              Unlike traditional chunking algorithms that slice text blindly every 500 tokens, Engram executes structure-aware chunking:
            </p>
            <ul className="list-disc pl-5 space-y-2">
              <li>Paragraphs within a subsection are merged up to the token budget (300–600 tokens).</li>
              <li>Chunks <strong>NEVER</strong> merge across section boundaries.</li>
              <li>Tables are detected and chunked separately with preserved tabular formatting.</li>
              <li>Every chunk retains metadata: <code className="text-xs font-mono bg-white/[0.05] px-1 py-0.5 rounded">page_start</code>, <code className="text-xs font-mono bg-white/[0.05] px-1 py-0.5 rounded">page_end</code>, <code className="text-xs font-mono bg-white/[0.05] px-1 py-0.5 rounded">section_path</code> (e.g. &quot;3 &gt; 3.2&quot;), and <code className="text-xs font-mono bg-white/[0.05] px-1 py-0.5 rounded">content_hash</code>.</li>
            </ul>
          </section>

          {/* 7. Hybrid Search */}
          <section id="search" className="space-y-4 scroll-mt-24 pt-6 border-t border-white/[0.08]">
            <h2 className="text-2xl font-bold text-white">Hybrid Retrieval (<code className="text-emerald-400 font-mono text-base">POST /api/v1/search</code>)</h2>
            <p>
              When you need ranked retrieval chunks without generating a natural language summary, use the retrieval-only search endpoint. It performs:
            </p>
            <ol className="list-decimal pl-5 space-y-1.5 text-xs font-mono">
              <li>Dense semantic search via Qdrant (<code className="text-emerald-400">semantic_score</code>)</li>
              <li>Sparse keyword search via PostgreSQL full-text search (<code className="text-emerald-400">keyword_score</code>)</li>
              <li>Reciprocal Rank Fusion (<code className="text-emerald-400">fused_score</code>)</li>
              <li>BGE cross-encoder neural reranking (<code className="text-emerald-400">rerank_score</code>)</li>
            </ol>
          </section>

          {/* 8. AI Query */}
          <section id="query" className="space-y-4 scroll-mt-24 pt-6 border-t border-white/[0.08]">
            <h2 className="text-2xl font-bold text-white">AI Query with Citations (<code className="text-emerald-400 font-mono text-base">POST /api/v1/query</code>)</h2>
            <p>
              The full RAG query endpoint retrieves reranked candidates and passes them to the Gemini synthesis engine. The response includes:
            </p>
            <ul className="list-disc pl-5 space-y-1.5">
              <li><code className="text-xs font-mono text-emerald-400">answer</code>: Synthesized natural language explanation with bracketed citation keys (e.g. [cit_1]).</li>
              <li><code className="text-xs font-mono text-emerald-400">citations</code>: Array of citations with exact page numbers, document IDs, section paths, and snippets.</li>
              <li><code className="text-xs font-mono text-emerald-400">confidence</code>: Model confidence score (0.00 – 1.00).</li>
              <li><code className="text-xs font-mono text-emerald-400">latency_ms</code>: End-to-end execution time in milliseconds.</li>
            </ul>
          </section>

          {/* 9. Errors */}
          <section id="errors" className="space-y-4 scroll-mt-24 pt-6 border-t border-white/[0.08]">
            <h2 className="text-2xl font-bold text-white">Consistent Error Envelope</h2>
            <p>
              Engram adheres strictly to standard RFC error envelopes across all endpoints:
            </p>
            <div className="rounded-lg border border-white/[0.08] bg-[#06070a] p-4 font-mono text-xs text-red-300">
              <pre>
{`{
  "error": {
    "code": "NOT_FOUND | VALIDATION_ERROR | UNAUTHORIZED",
    "message": "Human readable description of the error",
    "details": {}
  }
}`}
              </pre>
            </div>
          </section>

        </main>

        {/* Right Sticky TOC */}
        <aside className="lg:col-span-2 hidden lg:block">
          <div className="sticky top-24 text-xs font-mono space-y-3">
            <span className="text-zinc-500 uppercase tracking-wider block font-semibold">
              On this page
            </span>
            <ul className="space-y-1.5 border-l border-white/[0.08] pl-3 text-zinc-500">
              {navLinks.map((item) => (
                <li key={item.href}>
                  <a href={item.href} className="hover:text-zinc-200 transition-colors block py-0.5">
                    {item.title}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </aside>

      </div>
    </div>
  );
}
