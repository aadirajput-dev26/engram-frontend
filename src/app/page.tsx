"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArchitectureVisualizer } from "@/components/home/architecture-visualizer";
import { CodeExampleTabs } from "@/components/home/code-example-tabs";
import { 
  ArrowRight, 
  Terminal, 
  BookOpen, 
  CheckCircle2, 
  Layers, 
  FolderTree, 
  ShieldCheck, 
  Cpu, 
  Zap, 
  FileCheck
} from "lucide-react";
import { GithubIcon } from "@/components/icons/github";

export default function Home() {
  return (
    <div className="flex-1 flex flex-col relative">
      
      {/* Background Subtle Grid */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-[0.03]"
        style={{
          backgroundImage: "linear-gradient(to right, #ffffff 1px, transparent 1px), linear-gradient(to bottom, #ffffff 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />

      {/* 1. HERO SECTION */}
      <section className="relative pt-16 pb-20 md:pt-24 md:pb-28 px-4 sm:px-6 lg:px-8 border-b border-white/[0.06]">
        <div className="container mx-auto max-w-5xl flex flex-col items-center text-center relative z-10">
          
          {/* Eyebrow badge */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-emerald-500/30 bg-emerald-500/10 text-emerald-400 text-xs font-mono mb-8"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span>RAG INFRASTRUCTURE FOR DEVELOPERS</span>
          </motion.div>

          {/* Main Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl sm:text-6xl md:text-7xl font-sans font-bold tracking-tight text-white mb-6 max-w-4xl"
          >
            RAG without the <br className="hidden sm:block" />
            <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400 bg-clip-text text-transparent">
              vector complexity.
            </span>
          </motion.h1>

          {/* Supporting Copy */}
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-base sm:text-lg md:text-xl text-zinc-400 max-w-2xl mx-auto mb-10 leading-relaxed font-normal"
          >
            Engram is a vectorless, structure-aware RAG microservice. It parses complex enterprise documents into hierarchical section trees and uses reasoning-based retrieval to deliver grounded context with page-accurate citations.
          </motion.p>

          {/* Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center gap-4"
          >
            <Link href="/console">
              <Button 
                size="lg" 
                className="h-11 px-6 rounded-md bg-emerald-500 text-black font-semibold hover:bg-emerald-400 transition-all shadow-[0_0_20px_rgba(16,185,129,0.25)] flex items-center gap-2 text-sm"
              >
                <span>Get Started</span>
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>

            <Link href="/docs">
              <Button 
                variant="outline" 
                size="lg" 
                className="h-11 px-6 rounded-md border-white/[0.12] bg-white/[0.03] text-zinc-200 hover:bg-white/[0.08] hover:text-white transition-all text-sm flex items-center gap-2"
              >
                <BookOpen className="w-4 h-4 text-zinc-400" />
                <span>View Documentation</span>
              </Button>
            </Link>

            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs font-mono text-zinc-400 hover:text-white px-3 py-2 flex items-center gap-1.5 transition-colors"
            >
              <GithubIcon className="w-4 h-4" />
              <span>View on GitHub &rarr;</span>
            </a>
          </motion.div>

        </div>
      </section>

      {/* 2. HERO VISUAL / ARCHITECTURE VISUALIZER */}
      <section className="py-16 md:py-24 px-4 sm:px-6 lg:px-8 border-b border-white/[0.06] bg-[#07080c]">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-10">
            <span className="text-xs font-mono text-emerald-400 uppercase tracking-widest block mb-2">
              System Architecture
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
              Structure-Aware Document Traversal
            </h2>
            <p className="text-sm text-zinc-400 mt-2 max-w-xl mx-auto">
              Instead of slicing documents into random 500-token chunks, Engram builds a structural hierarchy preserving section contexts, headings, and tables.
            </p>
          </div>

          <ArchitectureVisualizer />
        </div>
      </section>

      {/* 3. CORE DIFFERENTIATOR SECTION */}
      <section className="py-20 md:py-28 px-4 sm:px-6 lg:px-8 border-b border-white/[0.06]">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <span className="text-xs font-mono text-zinc-400 uppercase tracking-widest block mb-2">
              The Paradigm Shift
            </span>
            <h2 className="text-2xl sm:text-4xl font-bold text-white tracking-tight">
              RAG, without the vector layer headaches.
            </h2>
            <p className="text-sm sm:text-base text-zinc-400 mt-3 max-w-2xl mx-auto">
              Traditional vector databases search for mathematical proximity, losing document hierarchy, page numbers, and table boundaries. Engram preserves structure from ingestion to synthesis.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            
            {/* Card 1: Traditional RAG */}
            <div className="rounded-xl border border-white/[0.08] bg-white/[0.01] p-6 sm:p-8 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-6">
                  <span className="text-xs font-mono px-2.5 py-1 rounded bg-zinc-800 text-zinc-400 border border-white/[0.08]">
                    TRADITIONAL RAG
                  </span>
                  <span className="text-xs font-mono text-red-400/80">Arbitrary Chunking</span>
                </div>

                <div className="space-y-3 font-mono text-xs text-zinc-400 border-l border-white/[0.08] pl-4 py-2">
                  <div className="flex items-center gap-2"><span>Document</span></div>
                  <div className="text-zinc-600">&darr; Fixed token chunks (blind splits)</div>
                  <div className="flex items-center gap-2"><span>Chunking Pipeline</span></div>
                  <div className="text-zinc-600">&darr; Generate dense vectors</div>
                  <div className="flex items-center gap-2"><span>Vector Database (Qdrant / Pinecone)</span></div>
                  <div className="text-zinc-600">&darr; Top-k Cosine Similarity</div>
                  <div className="flex items-center gap-2 text-zinc-300"><span>LLM (Missing section context & page numbers)</span></div>
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-white/[0.06] text-xs text-zinc-500 space-y-1">
                <div className="text-red-400 font-mono text-[11px]">&times; Slices tables in half</div>
                <div className="text-red-400 font-mono text-[11px]">&times; Loses parent section headings</div>
                <div className="text-red-400 font-mono text-[11px]">&times; Uncalibrated citations</div>
              </div>
            </div>

            {/* Card 2: Engram */}
            <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/[0.02] p-6 sm:p-8 flex flex-col justify-between relative shadow-[0_0_30px_rgba(16,185,129,0.05)]">
              <div>
                <div className="flex items-center justify-between mb-6">
                  <span className="text-xs font-mono px-2.5 py-1 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 font-medium">
                    ENGRAM ARCHITECTURE
                  </span>
                  <span className="text-xs font-mono text-emerald-400">Structure-Aware</span>
                </div>

                <div className="space-y-3 font-mono text-xs text-zinc-300 border-l border-emerald-500/30 pl-4 py-2">
                  <div className="flex items-center gap-2 text-white font-semibold"><span>Document</span></div>
                  <div className="text-emerald-500/60">&darr; Parses structure & section tree</div>
                  <div className="flex items-center gap-2 text-emerald-300"><span>Hierarchical Index (Sections & Tables)</span></div>
                  <div className="text-emerald-500/60">&darr; Boundary-preserving chunking</div>
                  <div className="flex items-center gap-2 text-emerald-300"><span>Dual-Channel Search (Vector + BM25)</span></div>
                  <div className="text-emerald-500/60">&darr; Reciprocal Rank Fusion + BGE Rerank</div>
                  <div className="flex items-center gap-2 text-white font-semibold"><span>LLM Synthesis + Exact Page Citations</span></div>
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-emerald-500/20 text-xs text-zinc-400 space-y-1">
                <div className="text-emerald-400 font-mono text-[11px]">&check; Preserves table structures completely</div>
                <div className="text-emerald-400 font-mono text-[11px]">&check; Section hierarchy paths (e.g. 3 &gt; 3.2)</div>
                <div className="text-emerald-400 font-mono text-[11px]">&check; Grounded citations with page numbers</div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 4. HOW IT WORKS (4-STEP TIMELINE) */}
      <section className="py-20 md:py-28 px-4 sm:px-6 lg:px-8 border-b border-white/[0.06] bg-[#07080c]">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <span className="text-xs font-mono text-emerald-400 uppercase tracking-widest block mb-2">
              Workflow
            </span>
            <h2 className="text-2xl sm:text-4xl font-bold text-white tracking-tight">
              From raw document to verified answer in 4 steps.
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 relative">
            
            {/* Step 1 */}
            <div className="rounded-lg border border-white/[0.08] bg-white/[0.02] p-5 relative">
              <span className="text-2xl font-mono font-bold text-emerald-400 block mb-4">01</span>
              <h3 className="text-base font-semibold text-white mb-2">Ingest</h3>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Upload PDFs, DOCX, Markdown, or supply a web URL. Engram computes cryptographic byte hashes and streams files securely.
              </p>
            </div>

            {/* Step 2 */}
            <div className="rounded-lg border border-white/[0.08] bg-white/[0.02] p-5 relative">
              <span className="text-2xl font-mono font-bold text-emerald-400 block mb-4">02</span>
              <h3 className="text-base font-semibold text-white mb-2">Index</h3>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Engram parses typography and layout to build a hierarchical section tree. Chunks are never split across section boundaries.
              </p>
            </div>

            {/* Step 3 */}
            <div className="rounded-lg border border-white/[0.08] bg-white/[0.02] p-5 relative">
              <span className="text-2xl font-mono font-bold text-emerald-400 block mb-4">03</span>
              <h3 className="text-base font-semibold text-white mb-2">Retrieve</h3>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Queries trigger dual dense + sparse search, fused with Reciprocal Rank Fusion (RRF) and scored by a cross-encoder neural reranker.
              </p>
            </div>

            {/* Step 4 */}
            <div className="rounded-lg border border-white/[0.08] bg-white/[0.02] p-5 relative">
              <span className="text-2xl font-mono font-bold text-emerald-400 block mb-4">04</span>
              <h3 className="text-base font-semibold text-white mb-2">Synthesize</h3>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Top-k verified candidates are synthesized into precise natural language answers with page citations [cit_1] and confidence scores.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* 5. DEVELOPER EXPERIENCE (CODE INTEGRATION) */}
      <section className="py-20 md:py-28 px-4 sm:px-6 lg:px-8 border-b border-white/[0.06]">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-12">
            <span className="text-xs font-mono text-emerald-400 uppercase tracking-widest block mb-2">
              Developer Experience
            </span>
            <h2 className="text-2xl sm:text-4xl font-bold text-white tracking-tight">
              Integrate in minutes with simple REST calls.
            </h2>
            <p className="text-sm text-zinc-400 mt-2 max-w-xl mx-auto">
              Every request is scoped to your organization workspace via <code className="text-emerald-400 bg-white/[0.05] px-1 py-0.5 rounded font-mono text-xs">x-api-key: sk-engram-*</code>.
            </p>
          </div>

          <CodeExampleTabs />
        </div>
      </section>

      {/* 6. PLATFORM CAPABILITIES */}
      <section className="py-20 md:py-24 px-4 sm:px-6 lg:px-8 bg-[#07080c]">
        <div className="container mx-auto max-w-6xl">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            <div className="space-y-3">
              <div className="w-9 h-9 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="text-base font-semibold text-white">Cryptographic Multi-Tenancy</h3>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Strict workspace and organization boundaries. Data, collections, and keys cannot cross-talk or leak between tenants.
              </p>
            </div>

            <div className="space-y-3">
              <div className="w-9 h-9 rounded-lg bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
                <FileCheck className="w-5 h-5" />
              </div>
              <h3 className="text-base font-semibold text-white">Page-Accurate Citations</h3>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Every generated statement contains explicit citations referencing exact PDF page numbers and section headers.
              </p>
            </div>

            <div className="space-y-3">
              <div className="w-9 h-9 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                <Zap className="w-5 h-5" />
              </div>
              <h3 className="text-base font-semibold text-white">FastAPI Native Performance</h3>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Asynchronous query pipeline delivering sub-300ms round trips for dense + sparse + reranked candidate generation.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* 7. BOTTOM CTA */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 border-t border-white/[0.06] text-center">
        <div className="container mx-auto max-w-3xl">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Ready to build structure-aware RAG?
          </h2>
          <p className="text-sm text-zinc-400 mb-8 max-w-lg mx-auto">
            Test the live endpoints directly in the playground or jump into the developer console to ingest your first document.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/console">
              <Button size="lg" className="h-11 px-6 rounded-md bg-emerald-500 text-black font-semibold hover:bg-emerald-400 text-sm">
                Open Developer Console &rarr;
              </Button>
            </Link>
            <Link href="/playground">
              <Button variant="outline" size="lg" className="h-11 px-6 rounded-md border-white/[0.12] bg-white/[0.03] text-zinc-200 hover:bg-white/[0.08] text-sm">
                Try API Playground
              </Button>
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}
