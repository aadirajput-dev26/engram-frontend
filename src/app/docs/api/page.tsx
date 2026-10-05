"use client";

import { useState } from "react";
import Link from "next/link";
import { 
  Code2, 
  Terminal, 
  Copy, 
  Check, 
  Play, 
  ChevronDown, 
  ChevronRight, 
  ExternalLink,
  Shield,
  Layers,
  FileText
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import openApiData from "@/lib/openapi.json";

interface EndpointDoc {
  id: string;
  method: "GET" | "POST" | "PUT" | "DELETE";
  path: string;
  group: string;
  summary: string;
  description: string;
  auth: "API Key" | "JWT Bearer" | "None";
  parameters?: Array<{ name: string; in: string; required: boolean; type: string; description: string }>;
  requestBodyExample?: string;
  responseStatus: string;
  responseExample: string;
  comingSoon?: boolean;
}

const ENDPOINTS: EndpointDoc[] = [
  // Health
  {
    id: "health-live",
    method: "GET",
    path: "/health",
    group: "Health",
    summary: "Basic Liveness Probe",
    description: "Returns alive status for load balancers and orchestrator health checks.",
    auth: "None",
    responseStatus: "200 OK",
    responseExample: `{\n  "status": "alive"\n}`,
  },
  {
    id: "health-ready",
    method: "GET",
    path: "/health/ready",
    group: "Health",
    summary: "Service Readiness Check",
    description: "Returns 200 when database, Qdrant vectors, and embedding models are initialized.",
    auth: "None",
    responseStatus: "200 OK",
    responseExample: `{\n  "status": "ready"\n}`,
  },

  // Auth & Workspaces
  {
    id: "auth-register",
    method: "POST",
    path: "/api/v1/auth/register",
    group: "Authentication & Tenants",
    summary: "Register Organization & Owner",
    description: "Creates a new tenant Organization and owner User account, returning an initial JWT access token.",
    auth: "None",
    requestBodyExample: `{\n  "org_name": "Engram Labs",\n  "org_slug": "engram-labs",\n  "email": "admin@engram.dev",\n  "password": "StrongPassword123!",\n  "full_name": "Developer"\n}`,
    responseStatus: "201 Created",
    responseExample: `{\n  "org_id": "bb5fada1-d7aa-4c49-af0d-117f2b074229",\n  "org_name": "Engram Labs",\n  "org_slug": "engram-labs",\n  "user_id": "804659e2-a722-488c-9bf2-cb952e73d25e",\n  "email": "admin@engram.dev",\n  "access_token": "eyJhbGciOiJIUzI1NiIsIn..."\n}`,
  },
  {
    id: "auth-login",
    method: "POST",
    path: "/api/v1/auth/login",
    group: "Authentication & Tenants",
    summary: "User Login",
    description: "Authenticates an existing user and returns a signed JWT access token.",
    auth: "None",
    requestBodyExample: `{\n  "email": "admin@engram.dev",\n  "password": "StrongPassword123!"\n}`,
    responseStatus: "200 OK",
    responseExample: `{\n  "access_token": "eyJhbGciOiJIUzI1NiIsIn...",\n  "user_id": "804659e2-a722-488c-9bf2-cb952e73d25e",\n  "org_id": "bb5fada1-d7aa-4c49-af0d-117f2b074229",\n  "email": "admin@engram.dev",\n  "full_name": "Developer"\n}`,
  },
  {
    id: "auth-workspaces-list",
    method: "GET",
    path: "/api/v1/auth/workspaces",
    group: "Authentication & Tenants",
    summary: "List Workspaces",
    description: "Lists all workspaces belonging to the caller's organization.",
    auth: "JWT Bearer",
    responseStatus: "200 OK",
    responseExample: `{\n  "workspaces": [\n    {\n      "workspace_id": "21af0e43-cd85-413e-8f38-655e5cc733c8",\n      "org_id": "bb5fada1-d7aa-4c49-af0d-117f2b074229",\n      "name": "Production",\n      "slug": "production",\n      "created_at": "2026-09-28T00:30:00Z"\n    }\n  ],\n  "total": 1\n}`,
  },
  {
    id: "auth-api-keys-post",
    method: "POST",
    path: "/api/v1/auth/api-keys",
    group: "Authentication & Tenants",
    summary: "Issue Scoped API Key",
    description: "Generates a secret sk-engram-* key for a workspace. The full secret is returned only once.",
    auth: "JWT Bearer",
    requestBodyExample: `{\n  "workspace_id": "21af0e43-cd85-413e-8f38-655e5cc733c8",\n  "name": "Production Ingestion Key"\n}`,
    responseStatus: "200 OK",
    responseExample: `{\n  "key_id": "e4f1511c-11eb-46dd-bee1-551e4a9368f6",\n  "key": "sk-engram-RPGpAHFWCT-9823475982734598273495",\n  "key_prefix": "sk-engram-RPGp...",\n  "name": "Production Ingestion Key",\n  "workspace_id": "21af0e43-cd85-413e-8f38-655e5cc733c8",\n  "created_at": "2026-09-28T00:32:49Z"\n}`,
  },

  // Collections
  {
    id: "collections-list",
    method: "GET",
    path: "/api/v1/collections",
    group: "Collections",
    summary: "List Collections",
    description: "Lists all folder collections in caller workspace.",
    auth: "API Key",
    responseStatus: "200 OK",
    responseExample: `[\n  {\n    "id": "99331122-4455-6677-8899-aabbccddeeff",\n    "name": "Financial Reports 2026",\n    "description": "Quarterly disclosures",\n    "document_count": 4\n  }\n]`,
  },
  {
    id: "collections-create",
    method: "POST",
    path: "/api/v1/collections",
    group: "Collections",
    summary: "Create Collection",
    description: "Creates an isolated folder collection for grouping documents.",
    auth: "API Key",
    requestBodyExample: `{\n  "name": "Legal Contracts",\n  "description": "Vendor master services agreements"\n}`,
    responseStatus: "201 Created",
    responseExample: `{\n  "id": "77a11223-9988-4455-6677-112233445566",\n  "name": "Legal Contracts",\n  "description": "Vendor master services agreements",\n  "document_count": 0\n}`,
  },

  // Documents
  {
    id: "documents-ingest",
    method: "POST",
    path: "/api/v1/documents/ingest",
    group: "Documents",
    summary: "Ingest Document (File or URL)",
    description: "Unified ingestion endpoint supporting multipart file uploads (PDF, DOCX, TXT, MD) or URL scraping.",
    auth: "API Key",
    requestBodyExample: `// Multipart Form-Data:\nfile: <binary PDF / DOCX>\nfilename: "quarterly_earnings.pdf"\nfolder_id: "optional-uuid"`,
    responseStatus: "200 OK",
    responseExample: `{\n  "document_id": "163e684f-189c-431f-aca0-3073fc9910e3",\n  "document_version_id": "4b6a9921-1234-5678-90ab-cdef12345678",\n  "job_id": "job_3389a1b2-cdef",\n  "status": "QUEUED"\n}`,
  },
  {
    id: "documents-list",
    method: "GET",
    path: "/api/v1/documents",
    group: "Documents",
    summary: "List Documents",
    description: "Lists all documents in workspace with processing status and pagination.",
    auth: "API Key",
    parameters: [
      { name: "skip", in: "query", required: false, type: "integer", description: "Pagination offset (default: 0)" },
      { name: "limit", in: "query", required: false, type: "integer", description: "Page size (default: 20, max: 100)" },
      { name: "folder_id", in: "query", required: false, type: "uuid", description: "Filter by collection ID" },
    ],
    responseStatus: "200 OK",
    responseExample: `{\n  "documents": [\n    {\n      "id": "163e684f-189c-431f-aca0-3073fc9910e3",\n      "filename": "sample_report.pdf",\n      "content_hash": "e3b0c44298fc1c149afbf4c8996fb92427ae41e4...",\n      "status": "READY",\n      "created_at": "2026-09-28T01:15:00Z"\n    }\n  ],\n  "total": 1,\n  "skip": 0,\n  "limit": 20\n}`,
  },
  {
    id: "documents-chunks",
    method: "GET",
    path: "/api/v1/documents/{document_id}/chunks",
    group: "Documents",
    summary: "Get Document Chunks",
    description: "Returns structure-aware parsed chunks with page boundaries and section paths.",
    auth: "API Key",
    responseStatus: "200 OK",
    responseExample: `{\n  "document_id": "163e684f-189c-431f-aca0-3073fc9910e3",\n  "chunks": [\n    {\n      "chunk_id": "c1f1e2d3-4567-8901-abcd-ef1234567890",\n      "chunk_index": 0,\n      "page_start": 4,\n      "page_end": 4,\n      "section_path": "Financial Highlights",\n      "chunk_type": "paragraph",\n      "snippet": "Q3 revenue reached $14.2M..."\n    }\n  ],\n  "total": 14\n}`,
  },
  {
    id: "documents-reprocess",
    method: "POST",
    path: "/api/v1/documents/{document_id}/process",
    group: "Documents",
    summary: "Reprocess Document",
    description: "Re-triggers parsing and indexing pipeline.",
    auth: "API Key",
    comingSoon: true,
    responseStatus: "501 Not Implemented",
    responseExample: `{\n  "error": {\n    "code": "NOT_IMPLEMENTED",\n    "message": "Reprocessing not yet implemented in microservice Slice 8."\n  }\n}`,
  },

  // Search & Query
  {
    id: "search-hybrid",
    method: "POST",
    path: "/api/v1/search",
    group: "Search & Query",
    summary: "Hybrid Retrieval Search",
    description: "Dual retrieval search (Qdrant Vector + BM25 Keyword + BGE Reranker) without LLM text synthesis.",
    auth: "API Key",
    requestBodyExample: `{\n  "query_text": "What is the Q3 revenue target?",\n  "top_k": 5,\n  "collection_id": "optional-uuid"\n}`,
    responseStatus: "200 OK",
    responseExample: `{\n  "results": [\n    {\n      "chunk_id": "c1f1e2d3-4567-8901-abcd-ef1234567890",\n      "document_id": "163e684f-189c-431f-aca0-3073fc9910e3",\n      "document_name": "Q3_Report.pdf",\n      "page_start": 4,\n      "page_end": 4,\n      "section_path": "Financial Highlights",\n      "snippet": "Q3 revenue reached $14.2M representing a 14% growth...",\n      "semantic_score": 0.8921,\n      "keyword_score": 0.7412,\n      "fused_score": 0.0321,\n      "rerank_score": 0.9412\n    }\n  ],\n  "total": 1,\n  "latency_ms": 38\n}`,
  },
  {
    id: "query-rag",
    method: "POST",
    path: "/api/v1/query",
    group: "Search & Query",
    summary: "Full RAG Query with Citations",
    description: "Executes full RAG retrieval, reranking, and Gemini LLM response synthesis with page-level citations.",
    auth: "API Key",
    requestBodyExample: `{\n  "query_text": "Summarize the key findings from the mining report.",\n  "top_k": 5\n}`,
    responseStatus: "200 OK",
    responseExample: `{\n  "answer": "The mining report indicates a 14% yield increase in Region B due to newly implemented extraction protocols [cit_1].",\n  "citations": [\n    {\n      "citation_id": "cit_1",\n      "document_id": "4fb2b824-159c-4f29-9e07-b538303c63ef",\n      "document_name": "synthetic_mining_report_35_pages.pdf",\n      "page_start": 12,\n      "page_end": 12,\n      "snippet": "Region B yield expanded by 14% year-over-year following system upgrade."\n    }\n  ],\n  "route_used": "hybrid",\n  "confidence": 0.96,\n  "latency_ms": 284\n}`,
  },
];

export default function ApiReferencePage() {
  const [selectedGroup, setSelectedGroup] = useState<string>("All");
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const groups = ["All", "Search & Query", "Documents", "Collections", "Authentication & Tenants", "Health"];

  const filteredEndpoints = selectedGroup === "All" 
    ? ENDPOINTS 
    : ENDPOINTS.filter((e) => e.group === selectedGroup);

  const copyCode = (code: string, id: string) => {
    navigator.clipboard.writeText(code);
    setCopiedId(id);
    toast.success("Copied to clipboard");
    setTimeout(() => setCopiedId(null), 2000);
  };

  const getMethodBadgeClass = (method: string) => {
    switch (method) {
      case "GET":
        return "bg-sky-500/10 text-sky-400 border-sky-500/30";
      case "POST":
        return "bg-emerald-500/10 text-emerald-400 border-emerald-500/30";
      case "PUT":
        return "bg-amber-500/10 text-amber-400 border-amber-500/30";
      case "DELETE":
        return "bg-rose-500/10 text-rose-400 border-rose-500/30";
      default:
        return "bg-zinc-500/10 text-zinc-400 border-zinc-500/30";
    }
  };

  return (
    <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
      
      {/* Title */}
      <div className="mb-8 pb-6 border-b border-white/[0.08] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-emerald-400 mb-2">
            <Code2 className="w-4 h-4" />
            <span>OPENAPI SPECIFICATION 3.1</span>
          </div>
          <h1 className="text-3xl font-bold text-white tracking-tight">
            Engram API Reference
          </h1>
          <p className="text-sm text-zinc-400 mt-1">
            Exact RESTful contracts derived directly from the backend FastAPI engine.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link href="/playground">
            <Button size="sm" className="bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 border border-emerald-500/30 text-xs font-mono">
              <Play className="w-3.5 h-3.5 mr-1.5" />
              <span>Open in Playground</span>
            </Button>
          </Link>
        </div>
      </div>

      {/* Filter Category Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-4 mb-8 text-xs font-mono">
        {groups.map((grp) => (
          <button
            key={grp}
            onClick={() => setSelectedGroup(grp)}
            className={`px-3 py-1.5 rounded-md transition-all whitespace-nowrap ${
              selectedGroup === grp
                ? "bg-white/[0.08] text-white border border-white/[0.12]"
                : "text-zinc-400 hover:text-zinc-200 hover:bg-white/[0.03]"
            }`}
          >
            {grp}
          </button>
        ))}
      </div>

      {/* Endpoint Cards List */}
      <div className="space-y-8">
        {filteredEndpoints.map((ep) => (
          <div 
            key={ep.id} 
            id={ep.id}
            className="rounded-xl border border-white/[0.08] bg-[#08090d] p-6 space-y-6 scroll-mt-24 shadow-lg hover:border-white/[0.15] transition-all"
          >
            
            {/* Top row: Verb + Path + Auth badge */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/[0.06] pb-4">
              <div className="flex items-center gap-3">
                <span className={`px-2 py-0.5 rounded text-xs font-mono font-bold border ${getMethodBadgeClass(ep.method)}`}>
                  {ep.method}
                </span>
                <span className="font-mono text-sm font-semibold text-white">
                  {ep.path}
                </span>
                {ep.comingSoon && (
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-zinc-800 text-zinc-400 border border-white/[0.06]">
                    Coming Soon (Slice 8)
                  </span>
                )}
              </div>

              <div className="flex items-center gap-3 text-xs font-mono">
                <span className="text-zinc-500">Auth:</span>
                <span className={`px-2 py-0.5 rounded border text-[11px] ${
                  ep.auth === "API Key"
                    ? "border-emerald-500/30 text-emerald-400 bg-emerald-500/10"
                    : ep.auth === "JWT Bearer"
                    ? "border-indigo-500/30 text-indigo-400 bg-indigo-500/10"
                    : "border-zinc-700 text-zinc-400 bg-zinc-800"
                }`}>
                  {ep.auth === "API Key" && "x-api-key: sk-engram-*"}
                  {ep.auth === "JWT Bearer" && "Authorization: Bearer <jwt>"}
                  {ep.auth === "None" && "Public"}
                </span>

                <Link href={`/playground?endpoint=${ep.path}&method=${ep.method}`}>
                  <button 
                    title="Test this endpoint in playground"
                    className="p-1.5 rounded hover:bg-white/[0.06] text-zinc-400 hover:text-emerald-400 transition-colors"
                  >
                    <Play className="w-3.5 h-3.5" />
                  </button>
                </Link>
              </div>
            </div>

            {/* Description */}
            <div>
              <h3 className="text-base font-semibold text-zinc-200 mb-1">
                {ep.summary}
              </h3>
              <p className="text-xs text-zinc-400 leading-relaxed">
                {ep.description}
              </p>
            </div>

            {/* Parameters table if present */}
            {ep.parameters && ep.parameters.length > 0 && (
              <div className="space-y-2">
                <span className="text-xs font-mono text-zinc-400 font-semibold block">Parameters:</span>
                <div className="border border-white/[0.06] rounded-md overflow-hidden font-mono text-xs">
                  {ep.parameters.map((param) => (
                    <div key={param.name} className="flex items-center justify-between p-2.5 border-b border-white/[0.04] last:border-b-0 bg-white/[0.01]">
                      <div className="flex items-center gap-2">
                        <span className="text-emerald-400 font-bold">{param.name}</span>
                        <span className="text-[10px] text-zinc-500">{param.in}</span>
                        <span className="text-[10px] text-zinc-600">({param.type})</span>
                      </div>
                      <span className="text-zinc-400 text-[11px]">{param.description}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Request & Response Grids */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              
              {/* Request */}
              {ep.requestBodyExample ? (
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs font-mono text-zinc-400">
                    <span>Request Body</span>
                    <button
                      onClick={() => copyCode(ep.requestBodyExample!, `req-${ep.id}`)}
                      className="hover:text-white"
                    >
                      {copiedId === `req-${ep.id}` ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                  <div className="p-3.5 rounded-lg bg-[#050608] border border-white/[0.06] font-mono text-xs text-zinc-300 overflow-x-auto">
                    <pre><code>{ep.requestBodyExample}</code></pre>
                  </div>
                </div>
              ) : (
                <div className="p-4 rounded-lg border border-dashed border-white/[0.06] flex items-center justify-center text-xs font-mono text-zinc-500">
                  No request body payload required
                </div>
              )}

              {/* Response */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs font-mono text-zinc-400">
                  <div className="flex items-center gap-2">
                    <span>Response</span>
                    <span className="text-[11px] text-emerald-400">({ep.responseStatus})</span>
                  </div>
                  <button
                    onClick={() => copyCode(ep.responseExample, `res-${ep.id}`)}
                    className="hover:text-white"
                  >
                    {copiedId === `res-${ep.id}` ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
                <div className="p-3.5 rounded-lg bg-[#050608] border border-white/[0.06] font-mono text-xs text-emerald-300/90 overflow-x-auto max-h-60">
                  <pre><code>{ep.responseExample}</code></pre>
                </div>
              </div>

            </div>

          </div>
        ))}
      </div>

    </div>
  );
}
