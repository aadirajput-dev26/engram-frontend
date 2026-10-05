"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  FileText, 
  FolderTree, 
  Search, 
  Layers, 
  Cpu, 
  CheckCircle2, 
  ArrowDown, 
  Binary, 
  Sparkles,
  ChevronRight,
  Database
} from "lucide-react";

interface StepDetails {
  title: string;
  badge: string;
  description: string;
  metrics: string[];
}

const STEP_DETAILS: Record<string, StepDetails> = {
  document: {
    title: "1. Enterprise Ingestion",
    badge: "POST /api/v1/documents/ingest",
    description: "Accepts PDFs, DOCX, Markdown, and URLs. Extracts text, tables, and typography metadata while tracking byte hashes.",
    metrics: ["PDF / DOCX / TXT / MD", "SHA-256 Checksum", "Streaming upload"],
  },
  structure: {
    title: "2. Hierarchical Structure Tree",
    badge: "Structure-Aware Modeling",
    description: "Constructs an index of sections, subsections, and page numbers. Preserves table structures and prevents splitting sentences across section boundaries.",
    metrics: ["Section Trees (3 > 3.2)", "Table integrity", "Token budget: 300-600"],
  },
  retrieval: {
    title: "3. Dual-Channel Search (Vector + BM25)",
    badge: "Qdrant + Postgres FTS",
    description: "Executes concurrent dense semantic retrieval in Qdrant and sparse keyword frequency in PostgreSQL, fused using Reciprocal Rank Fusion (RRF).",
    metrics: ["Dense: BGE-M3 (1024d)", "Sparse: BM25 ts_rank", "RRF k=60 fusion"],
  },
  reranker: {
    title: "4. Neural Reranking",
    badge: "BGE Cross-Encoder",
    description: "Applies deep cross-attention reranking over fused candidates to filter noise and score precise semantic relevance.",
    metrics: ["Cross-Encoder scoring", "Top-k candidate pruning", "Score: 0.9412"],
  },
  llm: {
    title: "5. Grounded Synthesis & Citations",
    badge: "POST /api/v1/query",
    description: "Synthesizes the answer strictly bound to retrieved context. Emits verifiable page and section citations with confidence calibration.",
    metrics: ["Gemini 1.5 Flash / Pro", "Page-level citations", "Structured evidence"],
  },
};

export function ArchitectureVisualizer() {
  const [activeStep, setActiveStep] = useState<string>("structure");

  return (
    <div className="w-full rounded-xl border border-white/[0.08] bg-[#090b10] p-6 lg:p-8 relative overflow-hidden shadow-2xl">
      {/* Background ambient gradient */}
      <div className="absolute -top-24 -left-24 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none" />

      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 mb-6 border-b border-white/[0.06] gap-2">
        <div className="flex items-center gap-2.5">
          <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="font-mono text-xs uppercase tracking-wider text-zinc-300 font-semibold">
            Engram Architecture Pipeline
          </span>
        </div>
        <span className="text-[11px] font-mono text-zinc-500">
          Click any stage to inspect execution details
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Interactive Diagram */}
        <div className="lg:col-span-7 flex flex-col items-center select-none">
          
          {/* Node 1: Document */}
          <motion.div
            whileHover={{ scale: 1.02 }}
            onClick={() => setActiveStep("document")}
            className={`w-full max-w-md p-3.5 rounded-lg border cursor-pointer transition-all ${
              activeStep === "document"
                ? "border-emerald-500/60 bg-emerald-500/[0.08] text-white shadow-[0_0_15px_rgba(16,185,129,0.15)]"
                : "border-white/[0.08] bg-white/[0.02] text-zinc-400 hover:border-white/[0.2]"
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <FileText className={`w-4 h-4 ${activeStep === "document" ? "text-emerald-400" : "text-zinc-500"}`} />
                <span className="font-mono text-xs font-medium">Your Document</span>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/[0.04] text-zinc-400 border border-white/[0.06]">
                PDF / DOCX / URL
              </span>
            </div>
          </motion.div>

          {/* Flow Connector */}
          <div className="h-6 w-px bg-gradient-to-b from-white/20 to-emerald-500/40 relative my-0.5">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-emerald-400" />
          </div>

          {/* Node 2: Document Structure Hierarchical Index */}
          <motion.div
            whileHover={{ scale: 1.02 }}
            onClick={() => setActiveStep("structure")}
            className={`w-full max-w-md p-4 rounded-lg border cursor-pointer transition-all ${
              activeStep === "structure"
                ? "border-emerald-500/60 bg-emerald-500/[0.08] text-white shadow-[0_0_20px_rgba(16,185,129,0.2)]"
                : "border-white/[0.08] bg-white/[0.02] text-zinc-400 hover:border-white/[0.2]"
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-3">
                <FolderTree className={`w-4 h-4 ${activeStep === "structure" ? "text-emerald-400" : "text-zinc-500"}`} />
                <span className="font-mono text-xs font-semibold text-zinc-200">
                  Document Structure & Hierarchical Index
                </span>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                Core Engine
              </span>
            </div>
            {/* Visual mini-tree */}
            <div className="pl-6 border-l border-white/[0.08] text-[11px] font-mono text-zinc-400 space-y-1 mt-2">
              <div className="flex items-center gap-1.5">
                <span className="text-zinc-600">├─</span>
                <span className="text-zinc-300">1.0 Executive Summary</span>
              </div>
              <div className="flex items-center gap-1.5 pl-3">
                <span className="text-zinc-600">└─</span>
                <span className="text-zinc-400">1.2 Financial Performance (p. 4-6)</span>
              </div>
            </div>
          </motion.div>

          {/* Split Connector */}
          <div className="w-full max-w-md my-1 relative h-6 flex justify-center">
            <div className="w-48 h-full border-t border-l border-r border-white/20 rounded-t-sm" />
          </div>

          {/* Node 3: Dual-Channel Search (Vector + Keyword) */}
          <div className="w-full max-w-md grid grid-cols-2 gap-3">
            {/* Vector Search */}
            <motion.div
              whileHover={{ scale: 1.02 }}
              onClick={() => setActiveStep("retrieval")}
              className={`p-3 rounded-lg border cursor-pointer transition-all ${
                activeStep === "retrieval"
                  ? "border-cyan-500/60 bg-cyan-500/[0.08] text-white"
                  : "border-white/[0.08] bg-white/[0.02] text-zinc-400 hover:border-white/[0.2]"
              }`}
            >
              <div className="flex items-center gap-2 mb-1">
                <Binary className="w-3.5 h-3.5 text-cyan-400" />
                <span className="font-mono text-[11px] font-medium text-zinc-200">Vector Search</span>
              </div>
              <div className="text-[10px] font-mono text-zinc-500">Qdrant dense (1024d)</div>
            </motion.div>

            {/* Keyword Search */}
            <motion.div
              whileHover={{ scale: 1.02 }}
              onClick={() => setActiveStep("retrieval")}
              className={`p-3 rounded-lg border cursor-pointer transition-all ${
                activeStep === "retrieval"
                  ? "border-cyan-500/60 bg-cyan-500/[0.08] text-white"
                  : "border-white/[0.08] bg-white/[0.02] text-zinc-400 hover:border-white/[0.2]"
              }`}
            >
              <div className="flex items-center gap-2 mb-1">
                <Search className="w-3.5 h-3.5 text-cyan-400" />
                <span className="font-mono text-[11px] font-medium text-zinc-200">BM25 Search</span>
              </div>
              <div className="text-[10px] font-mono text-zinc-500">PostgreSQL FTS</div>
            </motion.div>
          </div>

          {/* Merge Connector */}
          <div className="w-full max-w-md my-1 relative h-6 flex justify-center">
            <div className="w-48 h-full border-b border-l border-r border-white/20 rounded-b-sm" />
          </div>

          {/* Node 4: BGE Reranker */}
          <motion.div
            whileHover={{ scale: 1.02 }}
            onClick={() => setActiveStep("reranker")}
            className={`w-full max-w-md p-3.5 rounded-lg border cursor-pointer transition-all ${
              activeStep === "reranker"
                ? "border-emerald-500/60 bg-emerald-500/[0.08] text-white shadow-[0_0_15px_rgba(16,185,129,0.15)]"
                : "border-white/[0.08] bg-white/[0.02] text-zinc-400 hover:border-white/[0.2]"
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Layers className={`w-4 h-4 ${activeStep === "reranker" ? "text-emerald-400" : "text-zinc-500"}`} />
                <span className="font-mono text-xs font-semibold text-zinc-200">
                  BGE Cross-Encoder Reranker
                </span>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/[0.04] text-zinc-400 border border-white/[0.06]">
                RRF &rarr; Top-K
              </span>
            </div>
          </motion.div>

          {/* Connector */}
          <div className="h-6 w-px bg-gradient-to-b from-white/20 to-emerald-500/40 relative my-0.5" />

          {/* Node 5: Relevant Context & LLM */}
          <motion.div
            whileHover={{ scale: 1.02 }}
            onClick={() => setActiveStep("llm")}
            className={`w-full max-w-md p-3.5 rounded-lg border cursor-pointer transition-all ${
              activeStep === "llm"
                ? "border-emerald-500/60 bg-emerald-500/[0.08] text-white shadow-[0_0_15px_rgba(16,185,129,0.15)]"
                : "border-white/[0.08] bg-white/[0.02] text-zinc-400 hover:border-white/[0.2]"
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Cpu className={`w-4 h-4 ${activeStep === "llm" ? "text-emerald-400" : "text-zinc-500"}`} />
                <span className="font-mono text-xs font-semibold text-zinc-200">
                  LLM Synthesis + Page Citations
                </span>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                Answer + [cit_1]
              </span>
            </div>
          </motion.div>

        </div>

        {/* Right Column: Step Telemetry & Inspector */}
        <div className="lg:col-span-5 border border-white/[0.08] rounded-lg p-5 bg-white/[0.01]">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeStep}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
              className="space-y-4"
            >
              {/* Step Title & Badge */}
              <div>
                <span className="text-[10px] font-mono uppercase tracking-wider text-emerald-400 px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20">
                  {STEP_DETAILS[activeStep].badge}
                </span>
                <h4 className="text-base font-semibold text-white font-mono mt-2">
                  {STEP_DETAILS[activeStep].title}
                </h4>
              </div>

              {/* Description */}
              <p className="text-xs text-zinc-400 leading-relaxed">
                {STEP_DETAILS[activeStep].description}
              </p>

              {/* Execution Specs */}
              <div className="space-y-2 pt-2">
                <span className="text-[11px] font-mono text-zinc-500 uppercase tracking-wider">
                  Technical Specifications
                </span>
                <div className="space-y-1.5">
                  {STEP_DETAILS[activeStep].metrics.map((metric, i) => (
                    <div key={i} className="flex items-center gap-2 text-xs font-mono text-zinc-300">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      <span>{metric}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Live Preview Box */}
              <div className="pt-3 border-t border-white/[0.06]">
                <span className="text-[11px] font-mono text-zinc-500 block mb-2">
                  Output Snapshot
                </span>
                <div className="p-3 rounded bg-[#06070a] border border-white/[0.08] font-mono text-[11px] text-zinc-400 leading-relaxed overflow-x-auto">
                  {activeStep === "document" && (
                    <pre className="text-emerald-300">
{`{
  "document_id": "4fb2b824-159c",
  "status": "QUEUED",
  "job_id": "job_99a8b7c6",
  "mime": "application/pdf"
}`}
                    </pre>
                  )}
                  {activeStep === "structure" && (
                    <pre className="text-emerald-300">
{`{
  "section": "1.0 Executive Summary",
  "path": "1 > 1.2",
  "page_range": [4, 6],
  "chunks_created": 3
}`}
                    </pre>
                  )}
                  {activeStep === "retrieval" && (
                    <pre className="text-cyan-300">
{`{
  "semantic_score": 0.8921,
  "keyword_score": 0.7412,
  "fused_rrf_score": 0.0321
}`}
                    </pre>
                  )}
                  {activeStep === "reranker" && (
                    <pre className="text-emerald-300">
{`{
  "rerank_score": 0.9412,
  "top_k_selected": 5,
  "latency_ms": 38
}`}
                    </pre>
                  )}
                  {activeStep === "llm" && (
                    <pre className="text-emerald-300">
{`{
  "answer": "Q3 revenue grew by 18.4% [cit_1].",
  "citations": [{ "id": "cit_1", "page": 4 }],
  "latency_ms": 284
}`}
                    </pre>
                  )}
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

      </div>
    </div>
  );
}
