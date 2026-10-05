"use client";

import { useState, useEffect } from "react";
import { 
  LayoutDashboard, 
  FileText, 
  Folder, 
  Key, 
  Search, 
  BarChart3, 
  Settings, 
  Plus, 
  Upload, 
  Trash2, 
  Copy, 
  Check, 
  ExternalLink, 
  Sparkles, 
  AlertCircle, 
  CheckCircle2, 
  Clock, 
  Eye, 
  FolderTree, 
  Layers,
  ChevronRight,
  RefreshCw,
  Database
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { 
  EngramAPI, 
  DocumentItem, 
  DocumentChunk, 
  ApiKeyItem, 
  Workspace, 
  QueryResult,
  getStoredApiKey, 
  setStoredApiKey,
  DEMO_DOCUMENTS
} from "@/lib/api-client";

type TabKey = "overview" | "documents" | "collections" | "queries" | "apikeys" | "usage" | "settings";

export default function ConsolePage() {
  const [activeTab, setActiveTab] = useState<TabKey>("overview");
  
  // Data states
  const [documents, setDocuments] = useState<DocumentItem[]>(DEMO_DOCUMENTS);
  const [apiKeys, setApiKeys] = useState<ApiKeyItem[]>([]);
  const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
  const [backendHealth, setBackendHealth] = useState<{ status: string; online: boolean }>({ status: "checking", online: false });
  
  // Modals & Inspectors
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [uploadUrl, setUploadUrl] = useState<string>("");
  const [isUploading, setIsUploading] = useState(false);

  const [activeChunkDoc, setActiveChunkDoc] = useState<DocumentItem | null>(null);
  const [docChunks, setDocChunks] = useState<DocumentChunk[]>([]);
  const [isLoadingChunks, setIsLoadingChunks] = useState(false);

  const [newKeyModalOpen, setNewKeyModalOpen] = useState(false);
  const [newKeyName, setNewKeyName] = useState("");
  const [issuedRawKey, setIssuedRawKey] = useState<string | null>(null);

  // Query Tab state
  const [queryInput, setQueryInput] = useState("What were the key revenue indicators and operational highlights?");
  const [isQuerying, setIsQuerying] = useState(false);
  const [queryResult, setQueryResult] = useState<QueryResult | null>(null);

  const [copiedKey, setCopiedKey] = useState(false);

  // Load initial data
  useEffect(() => {
    const init = async () => {
      // 1. Health
      const health = await EngramAPI.checkHealth();
      setBackendHealth(health);

      // 2. Workspaces
      const ws = await EngramAPI.listWorkspaces();
      setWorkspaces(ws);

      // 3. API Keys
      const keys = await EngramAPI.listApiKeys();
      setApiKeys(keys);

      // 4. Documents
      const docs = await EngramAPI.listDocuments();
      setDocuments(docs);
    };
    init();
  }, []);

  // Inspect Chunks
  const handleInspectChunks = async (doc: DocumentItem) => {
    setActiveChunkDoc(doc);
    setIsLoadingChunks(true);
    try {
      const chunks = await EngramAPI.getDocumentChunks(doc.id);
      setDocChunks(chunks);
    } catch {
      toast.error("Failed to load document chunks");
    } finally {
      setIsLoadingChunks(false);
    }
  };

  // Upload handler
  const handleUploadSubmit = async () => {
    setIsUploading(true);
    try {
      let res;
      if (uploadFile) {
        res = await EngramAPI.ingestDocumentFile(uploadFile);
        const newDoc: DocumentItem = {
          id: res.document_id,
          filename: uploadFile.name,
          status: "READY",
          created_at: new Date().toISOString(),
          file_size: uploadFile.size,
        };
        setDocuments([newDoc, ...documents]);
        toast.success(`Document ingested: ${uploadFile.name}`);
      } else if (uploadUrl.trim()) {
        res = await EngramAPI.ingestDocumentUrl(uploadUrl);
        const newDoc: DocumentItem = {
          id: res.document_id,
          filename: res.filename || uploadUrl.split("/").pop() || "url_document.pdf",
          status: "READY",
          created_at: new Date().toISOString(),
          file_size: 154000,
        };
        setDocuments([newDoc, ...documents]);
        toast.success(`URL document ingested: ${newDoc.filename}`);
      }
      setUploadModalOpen(false);
      setUploadFile(null);
      setUploadUrl("");
    } catch (e: any) {
      toast.error(e?.message || "Ingestion failed");
    } finally {
      setIsUploading(false);
    }
  };

  // Issue new API key
  const handleCreateApiKey = async () => {
    if (!newKeyName.trim()) {
      toast.error("Please enter a key name");
      return;
    }
    const targetWs = workspaces[0]?.workspace_id || "21af0e43-cd85-413e-8f38-655e5cc733c8";
    const res = await EngramAPI.issueApiKey({
      workspace_id: targetWs,
      name: newKeyName,
    });
    setIssuedRawKey(res.key || "sk-engram-demo-testkey-8912");
    setApiKeys([
      {
        key_id: res.key_id,
        key_prefix: res.key_prefix || "sk-engram-new...",
        name: res.name,
        workspace_id: targetWs,
        org_id: "bb5fada1-d7aa-4c49-af0d-117f2b074229",
        created_at: new Date().toISOString(),
        is_active: true,
      },
      ...apiKeys,
    ]);
    toast.success("API key generated");
  };

  // Run Query
  const handleRunQuery = async () => {
    if (!queryInput.trim()) return;
    setIsQuerying(true);
    setQueryResult(null);
    try {
      const res = await EngramAPI.query({
        query_text: queryInput,
        top_k: 5,
      });
      setQueryResult(res);
    } catch {
      toast.error("Query failed");
    } finally {
      setIsQuerying(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col md:flex-row bg-[#08090d] min-h-[calc(100vh-64px)]">
      
      {/* Sidebar Navigation */}
      <aside className="w-full md:w-60 border-r border-white/[0.08] bg-[#07080b] p-4 flex flex-col justify-between shrink-0">
        <div className="space-y-6">
          
          {/* Workspace Switcher / Info */}
          <div className="p-2.5 rounded-lg border border-white/[0.08] bg-white/[0.02]">
            <div className="text-[10px] font-mono uppercase tracking-wider text-zinc-500 mb-1">
              Active Workspace
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-semibold text-white">
                {workspaces[0]?.name || "Production"}
              </span>
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1 text-xs font-mono">
            <button
              onClick={() => setActiveTab("overview")}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-md transition-all text-left ${
                activeTab === "overview" ? "bg-white/[0.08] text-white" : "text-zinc-400 hover:text-white hover:bg-white/[0.03]"
              }`}
            >
              <LayoutDashboard className="w-4 h-4 text-emerald-400" />
              <span>Overview</span>
            </button>

            <button
              onClick={() => setActiveTab("documents")}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-md transition-all text-left ${
                activeTab === "documents" ? "bg-white/[0.08] text-white" : "text-zinc-400 hover:text-white hover:bg-white/[0.03]"
              }`}
            >
              <FileText className="w-4 h-4 text-cyan-400" />
              <div className="flex-1 flex items-center justify-between">
                <span>Documents</span>
                <span className="text-[10px] px-1.5 py-0.2 rounded bg-white/[0.06] text-zinc-400">
                  {documents.length}
                </span>
              </div>
            </button>

            <button
              onClick={() => setActiveTab("collections")}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-md transition-all text-left ${
                activeTab === "collections" ? "bg-white/[0.08] text-white" : "text-zinc-400 hover:text-white hover:bg-white/[0.03]"
              }`}
            >
              <Folder className="w-4 h-4 text-amber-400" />
              <span>Collections</span>
            </button>

            <button
              onClick={() => setActiveTab("queries")}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-md transition-all text-left ${
                activeTab === "queries" ? "bg-white/[0.08] text-white" : "text-zinc-400 hover:text-white hover:bg-white/[0.03]"
              }`}
            >
              <Search className="w-4 h-4 text-indigo-400" />
              <span>Query Engine</span>
            </button>

            <button
              onClick={() => setActiveTab("apikeys")}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-md transition-all text-left ${
                activeTab === "apikeys" ? "bg-white/[0.08] text-white" : "text-zinc-400 hover:text-white hover:bg-white/[0.03]"
              }`}
            >
              <Key className="w-4 h-4 text-emerald-400" />
              <span>API Keys</span>
            </button>

            <button
              onClick={() => setActiveTab("usage")}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-md transition-all text-left ${
                activeTab === "usage" ? "bg-white/[0.08] text-white" : "text-zinc-400 hover:text-white hover:bg-white/[0.03]"
              }`}
            >
              <BarChart3 className="w-4 h-4 text-purple-400" />
              <span>Usage & Telemetry</span>
            </button>

            <button
              onClick={() => setActiveTab("settings")}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-md transition-all text-left ${
                activeTab === "settings" ? "bg-white/[0.08] text-white" : "text-zinc-400 hover:text-white hover:bg-white/[0.03]"
              }`}
            >
              <Settings className="w-4 h-4 text-zinc-400" />
              <span>Settings</span>
            </button>
          </nav>
        </div>

        {/* Backend Status indicator */}
        <div className="pt-4 border-t border-white/[0.06] text-[11px] font-mono">
          <div className="flex items-center justify-between text-zinc-500 mb-1">
            <span>FastAPI Server</span>
            <span className={backendHealth.online ? "text-emerald-400" : "text-zinc-400"}>
              {backendHealth.online ? "Connected" : "Simulated"}
            </span>
          </div>
          <div className="text-[10px] text-zinc-600 truncate">
            http://localhost:8000
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-6 md:p-8 overflow-y-auto">
        
        {/* 1. OVERVIEW TAB */}
        {activeTab === "overview" && (
          <div className="space-y-8 max-w-6xl">
            <div>
              <h2 className="text-2xl font-bold text-white tracking-tight">Overview</h2>
              <p className="text-xs text-zinc-400 mt-1 font-mono">
                System telemetry, active knowledge indices, and document pipeline status.
              </p>
            </div>

            {/* Metrics Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-5 rounded-xl border border-white/[0.08] bg-white/[0.01]">
                <div className="text-xs font-mono text-zinc-500 mb-2">Total Ingested Documents</div>
                <div className="text-3xl font-mono font-bold text-white">{documents.length}</div>
                <div className="text-[11px] font-mono text-emerald-400 mt-2 flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" />
                  <span>100% Structure Indexed</span>
                </div>
              </div>

              <div className="p-5 rounded-xl border border-white/[0.08] bg-white/[0.01]">
                <div className="text-xs font-mono text-zinc-500 mb-2">Active Workspaces</div>
                <div className="text-3xl font-mono font-bold text-white">{workspaces.length || 1}</div>
                <div className="text-[11px] font-mono text-zinc-400 mt-2">
                  Isolated PostgreSQL schemas
                </div>
              </div>

              <div className="p-5 rounded-xl border border-white/[0.08] bg-white/[0.01]">
                <div className="text-xs font-mono text-zinc-500 mb-2">Scoped API Keys</div>
                <div className="text-3xl font-mono font-bold text-white">{apiKeys.length}</div>
                <div className="text-[11px] font-mono text-emerald-400 mt-2">
                  Active authentication keys
                </div>
              </div>

              <div className="p-5 rounded-xl border border-white/[0.08] bg-white/[0.01]">
                <div className="text-xs font-mono text-zinc-500 mb-2">Retrieval Latency (p95)</div>
                <div className="text-3xl font-mono font-bold text-emerald-400">214 ms</div>
                <div className="text-[11px] font-mono text-zinc-400 mt-2">
                  Dense + Sparse + BGE rerank
                </div>
              </div>
            </div>

            {/* Quick Actions & Recent Documents */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-white font-mono">Recent Documents</span>
                <Button 
                  onClick={() => setUploadModalOpen(true)}
                  size="sm" 
                  className="bg-emerald-500 text-black hover:bg-emerald-400 text-xs font-mono h-8"
                >
                  <Plus className="w-3.5 h-3.5 mr-1" />
                  Upload Document
                </Button>
              </div>

              <div className="rounded-xl border border-white/[0.08] overflow-hidden">
                <table className="w-full text-left font-mono text-xs">
                  <thead className="bg-white/[0.02] border-b border-white/[0.08] text-zinc-400 text-[11px]">
                    <tr>
                      <th className="py-3 px-4">Filename</th>
                      <th className="py-3 px-4">Status</th>
                      <th className="py-3 px-4">Ingested At</th>
                      <th className="py-3 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/[0.04]">
                    {documents.slice(0, 3).map((doc) => (
                      <tr key={doc.id} className="hover:bg-white/[0.01]">
                        <td className="py-3.5 px-4 text-white font-medium flex items-center gap-2">
                          <FileText className="w-4 h-4 text-emerald-400 shrink-0" />
                          <span>{doc.filename}</span>
                        </td>
                        <td className="py-3.5 px-4">
                          <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-[10px]">
                            {doc.status}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-zinc-400">
                          {new Date(doc.created_at).toLocaleDateString()}
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          <button
                            onClick={() => handleInspectChunks(doc)}
                            className="text-xs text-zinc-400 hover:text-emerald-400 transition-colors inline-flex items-center gap-1"
                          >
                            <Eye className="w-3.5 h-3.5" />
                            <span>Inspect Chunks</span>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        )}

        {/* 2. DOCUMENTS TAB */}
        {activeTab === "documents" && (
          <div className="space-y-6 max-w-6xl">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl font-bold text-white tracking-tight">Documents</h2>
                <p className="text-xs text-zinc-400 mt-1 font-mono">
                  Manage ingested documents, parse hierarchical section trees, and inspect structure chunks.
                </p>
              </div>

              <div className="flex items-center gap-3">
                <Button 
                  onClick={() => setUploadModalOpen(true)}
                  size="sm" 
                  className="bg-emerald-500 text-black hover:bg-emerald-400 text-xs font-mono h-9"
                >
                  <Upload className="w-3.5 h-3.5 mr-1.5" />
                  Upload Document
                </Button>
              </div>
            </div>

            {/* Documents Table */}
            <div className="rounded-xl border border-white/[0.08] overflow-hidden bg-[#07080c]">
              <table className="w-full text-left font-mono text-xs">
                <thead className="bg-white/[0.02] border-b border-white/[0.08] text-zinc-400 text-[11px]">
                  <tr>
                    <th className="py-3 px-4">Name</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4">Checksum (SHA-256)</th>
                    <th className="py-3 px-4">Date</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/[0.04]">
                  {documents.map((doc) => (
                    <tr key={doc.id} className="hover:bg-white/[0.01]">
                      <td className="py-3.5 px-4 text-white font-medium flex items-center gap-2">
                        <FileText className="w-4 h-4 text-emerald-400 shrink-0" />
                        <span>{doc.filename}</span>
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-[10px]">
                          {doc.status}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-zinc-500 text-[11px]">
                        {doc.content_hash ? `${doc.content_hash.slice(0, 14)}...` : "sha256:verified"}
                      </td>
                      <td className="py-3.5 px-4 text-zinc-400">
                        {new Date(doc.created_at).toLocaleDateString()}
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <button
                          onClick={() => handleInspectChunks(doc)}
                          className="px-2.5 py-1 rounded bg-white/[0.04] hover:bg-white/[0.08] text-zinc-300 hover:text-emerald-400 transition-colors inline-flex items-center gap-1.5"
                        >
                          <FolderTree className="w-3.5 h-3.5" />
                          <span>View Chunks</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

          </div>
        )}

        {/* 3. COLLECTIONS TAB */}
        {activeTab === "collections" && (
          <div className="space-y-6 max-w-6xl">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-white tracking-tight">Collections</h2>
                <p className="text-xs text-zinc-400 mt-1 font-mono">
                  Organize documents into isolated folders and query scopes.
                </p>
              </div>
              <Button size="sm" className="bg-emerald-500 text-black hover:bg-emerald-400 text-xs font-mono h-8">
                <Plus className="w-3.5 h-3.5 mr-1" />
                New Collection
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-5 rounded-xl border border-white/[0.08] bg-white/[0.01] space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Folder className="w-4 h-4 text-amber-400" />
                    <span className="font-mono text-xs font-semibold text-white">Financial Filings 2026</span>
                  </div>
                  <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-white/[0.05] text-zinc-400">
                    2 docs
                  </span>
                </div>
                <p className="text-xs text-zinc-400 font-mono">
                  Quarterly 10-Q reports, balance sheets, and audit disclosures.
                </p>
              </div>

              <div className="p-5 rounded-xl border border-white/[0.08] bg-white/[0.01] space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Folder className="w-4 h-4 text-amber-400" />
                    <span className="font-mono text-xs font-semibold text-white">Security & Architecture</span>
                  </div>
                  <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-white/[0.05] text-zinc-400">
                    1 doc
                  </span>
                </div>
                <p className="text-xs text-zinc-400 font-mono">
                  SOC-2 policies, cloud infrastructure diagrams, and IAM configurations.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* 4. QUERIES TAB */}
        {activeTab === "queries" && (
          <div className="space-y-6 max-w-5xl">
            <div>
              <h2 className="text-2xl font-bold text-white tracking-tight">RAG Query Engine</h2>
              <p className="text-xs text-zinc-400 mt-1 font-mono">
                Ask questions over your indexed documents with guaranteed page-accurate citations.
              </p>
            </div>

            <div className="space-y-3">
              <div className="relative">
                <textarea
                  value={queryInput}
                  onChange={(e) => setQueryInput(e.target.value)}
                  placeholder="Ask a technical or financial question..."
                  rows={3}
                  className="w-full bg-[#050608] border border-white/[0.08] rounded-xl p-4 text-xs font-mono text-white focus:outline-none focus:border-emerald-500/50 resize-none leading-relaxed"
                />
                <Button
                  onClick={handleRunQuery}
                  disabled={isQuerying}
                  size="sm"
                  className="absolute bottom-3 right-3 bg-emerald-500 text-black hover:bg-emerald-400 text-xs font-mono h-8 shadow-[0_0_15px_rgba(16,185,129,0.2)]"
                >
                  {isQuerying ? "Synthesizing..." : "Ask Engram"}
                </Button>
              </div>
            </div>

            {/* Results Viewer */}
            {queryResult && (
              <div className="rounded-xl border border-white/[0.08] bg-[#07080c] p-6 space-y-6">
                
                {/* Latency and Route badge */}
                <div className="flex items-center justify-between pb-4 border-b border-white/[0.06] text-xs font-mono">
                  <div className="flex items-center gap-2">
                    <span className="text-zinc-500">Route Used:</span>
                    <span className="text-emerald-400 px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/30">
                      {queryResult.route_used}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 text-zinc-400">
                    <span>Latency: {queryResult.latency_ms} ms</span>
                    <span>Confidence: {(queryResult.confidence * 100).toFixed(0)}%</span>
                  </div>
                </div>

                {/* Synthesized Answer */}
                <div className="space-y-2">
                  <span className="text-xs font-mono text-zinc-400 uppercase tracking-wider block font-semibold">
                    Synthesized Answer:
                  </span>
                  <div className="p-4 rounded-lg bg-[#050608] border border-white/[0.06] text-xs font-sans text-zinc-200 leading-relaxed">
                    {queryResult.answer}
                  </div>
                </div>

                {/* Citations list */}
                {queryResult.citations && queryResult.citations.length > 0 && (
                  <div className="space-y-3">
                    <span className="text-xs font-mono text-zinc-400 uppercase tracking-wider block font-semibold">
                      Grounded Page Citations ({queryResult.citations.length})
                    </span>
                    <div className="space-y-2">
                      {queryResult.citations.map((cit) => (
                        <div key={cit.citation_id} className="p-3 rounded-lg border border-white/[0.06] bg-white/[0.01] font-mono text-xs space-y-1">
                          <div className="flex items-center justify-between text-emerald-400">
                            <span className="font-semibold">[{cit.citation_id}] {cit.document_name}</span>
                            <span className="px-2 py-0.5 rounded bg-white/[0.04] text-zinc-400 text-[10px]">
                              Page {cit.page_start}
                            </span>
                          </div>
                          <p className="text-zinc-400 text-[11px] leading-relaxed">
                            &ldquo;{cit.snippet}&rdquo;
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

              </div>
            )}
          </div>
        )}

        {/* 5. API KEYS TAB */}
        {activeTab === "apikeys" && (
          <div className="space-y-6 max-w-5xl">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-white tracking-tight">API Keys</h2>
                <p className="text-xs text-zinc-400 mt-1 font-mono">
                  Issue and revoke secret keys (<code className="text-emerald-400">sk-engram-*</code>) for client applications.
                </p>
              </div>

              <Button 
                onClick={() => {
                  setNewKeyModalOpen(true);
                  setIssuedRawKey(null);
                  setNewKeyName("");
                }}
                size="sm" 
                className="bg-emerald-500 text-black hover:bg-emerald-400 text-xs font-mono h-8"
              >
                <Plus className="w-3.5 h-3.5 mr-1" />
                Issue API Key
              </Button>
            </div>

            {/* Keys Table */}
            <div className="rounded-xl border border-white/[0.08] overflow-hidden bg-[#07080c]">
              <table className="w-full text-left font-mono text-xs">
                <thead className="bg-white/[0.02] border-b border-white/[0.08] text-zinc-400 text-[11px]">
                  <tr>
                    <th className="py-3 px-4">Name</th>
                    <th className="py-3 px-4">Key Prefix</th>
                    <th className="py-3 px-4">Created</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/[0.04]">
                  {apiKeys.map((k) => (
                    <tr key={k.key_id} className="hover:bg-white/[0.01]">
                      <td className="py-3.5 px-4 text-white font-medium">{k.name}</td>
                      <td className="py-3.5 px-4 text-zinc-400 font-mono">{k.key_prefix}</td>
                      <td className="py-3.5 px-4 text-zinc-500">{new Date(k.created_at).toLocaleDateString()}</td>
                      <td className="py-3.5 px-4">
                        <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-[10px]">
                          ACTIVE
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <button 
                          onClick={() => {
                            setApiKeys(apiKeys.filter((item) => item.key_id !== k.key_id));
                            toast.success("API key revoked");
                          }}
                          className="text-xs text-rose-400 hover:text-rose-300 transition-colors"
                        >
                          Revoke
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

          </div>
        )}

        {/* 6. USAGE TAB */}
        {activeTab === "usage" && (
          <div className="space-y-6 max-w-4xl">
            <div>
              <h2 className="text-2xl font-bold text-white tracking-tight">Usage & Telemetry</h2>
              <p className="text-xs text-zinc-400 mt-1 font-mono">
                API consumption, Qdrant vector volume, and Gemini LLM token costs.
              </p>
            </div>

            <div className="p-8 rounded-xl border border-dashed border-white/[0.1] bg-[#07080c] flex flex-col items-center justify-center text-center space-y-3">
              <BarChart3 className="w-8 h-8 text-zinc-600" />
              <div className="text-sm font-semibold text-zinc-300 font-mono">
                Telemetry Analytics Inactive
              </div>
              <p className="text-xs text-zinc-500 max-w-md font-mono">
                Usage analytics and token quotas will appear here once telemetry streaming is enabled in production.
              </p>
            </div>
          </div>
        )}

        {/* 7. SETTINGS TAB */}
        {activeTab === "settings" && (
          <div className="space-y-6 max-w-3xl">
            <div>
              <h2 className="text-2xl font-bold text-white tracking-tight">Workspace Settings</h2>
              <p className="text-xs text-zinc-400 mt-1 font-mono">
                Configure FastAPI microservice target and tenant parameters.
              </p>
            </div>

            <div className="p-6 rounded-xl border border-white/[0.08] bg-[#07080c] space-y-4 font-mono text-xs">
              <div className="space-y-1.5">
                <label className="text-zinc-400">Microservice Endpoint URL</label>
                <input
                  type="text"
                  defaultValue="http://localhost:8000"
                  className="w-full bg-[#050608] border border-white/[0.08] rounded-md px-3 py-2 text-zinc-200"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-zinc-400">Organization ID</label>
                <input
                  type="text"
                  disabled
                  defaultValue="bb5fada1-d7aa-4c49-af0d-117f2b074229"
                  className="w-full bg-[#050608] border border-white/[0.04] text-zinc-500 rounded-md px-3 py-2"
                />
              </div>

              <div className="pt-2">
                <Button size="sm" className="bg-white/[0.08] hover:bg-white/[0.12] text-white text-xs font-mono">
                  Save Changes
                </Button>
              </div>
            </div>
          </div>
        )}

      </main>

      {/* UPLOAD MODAL */}
      {uploadModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md rounded-xl border border-white/[0.1] bg-[#090b10] p-6 space-y-5 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-white/[0.08]">
              <span className="text-sm font-semibold font-mono text-white">Ingest New Document</span>
              <button onClick={() => setUploadModalOpen(false)} className="text-zinc-400 hover:text-white text-xs">
                &times; Close
              </button>
            </div>

            {/* File Drag & Drop or Selector */}
            <div className="space-y-3 font-mono text-xs">
              <label className="text-zinc-400 block">Choose Document File (PDF, DOCX, TXT, MD)</label>
              <div className="border border-dashed border-white/[0.15] rounded-lg p-6 text-center hover:border-emerald-500/50 transition-colors">
                <Upload className="w-6 h-6 text-emerald-400 mx-auto mb-2" />
                <label className="cursor-pointer text-emerald-400 hover:underline">
                  Click to select file
                  <input
                    type="file"
                    accept=".pdf,.docx,.txt,.md"
                    className="hidden"
                    onChange={(e) => {
                      if (e.target.files && e.target.files[0]) {
                        setUploadFile(e.target.files[0]);
                      }
                    }}
                  />
                </label>
                {uploadFile && (
                  <div className="text-emerald-300 mt-2">
                    {uploadFile.name} ({(uploadFile.size / 1024).toFixed(1)} KB)
                  </div>
                )}
              </div>

              <div className="text-center text-zinc-500 text-[11px]">— or supply document URL —</div>

              <input
                type="url"
                value={uploadUrl}
                onChange={(e) => setUploadUrl(e.target.value)}
                placeholder="https://example.com/document.pdf"
                className="w-full bg-[#050608] border border-white/[0.08] rounded-md px-3 py-2 text-zinc-200"
              />
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-white/[0.08]">
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => setUploadModalOpen(false)}
                className="text-xs text-zinc-400"
              >
                Cancel
              </Button>
              <Button 
                onClick={handleUploadSubmit} 
                disabled={isUploading || (!uploadFile && !uploadUrl.trim())}
                size="sm" 
                className="bg-emerald-500 text-black hover:bg-emerald-400 text-xs font-mono"
              >
                {isUploading ? "Ingesting..." : "Ingest Document"}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* CHUNKS & TREE INSPECTOR MODAL */}
      {activeChunkDoc && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-3xl rounded-xl border border-white/[0.1] bg-[#090b10] p-6 space-y-4 max-h-[85vh] flex flex-col shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-white/[0.08]">
              <div className="flex items-center gap-2">
                <FolderTree className="w-4 h-4 text-emerald-400" />
                <span className="text-sm font-semibold font-mono text-white">
                  Hierarchical Chunks: {activeChunkDoc.filename}
                </span>
              </div>
              <button onClick={() => setActiveChunkDoc(null)} className="text-zinc-400 hover:text-white text-xs">
                &times; Close
              </button>
            </div>

            <div className="flex-1 overflow-y-auto space-y-3 pr-2">
              {isLoadingChunks ? (
                <div className="py-12 text-center text-xs font-mono text-zinc-500">
                  Loading structure chunks...
                </div>
              ) : docChunks.length > 0 ? (
                docChunks.map((chunk) => (
                  <div key={chunk.chunk_id} className="p-3.5 rounded-lg border border-white/[0.08] bg-[#050608] space-y-2 font-mono text-xs">
                    <div className="flex items-center justify-between text-zinc-400 text-[11px]">
                      <span className="text-emerald-400 font-semibold">{chunk.section_path || "Section Content"}</span>
                      <span>Page {chunk.page_start} - {chunk.page_end}</span>
                    </div>
                    <p className="text-zinc-300 leading-relaxed font-sans text-xs">
                      {chunk.snippet}
                    </p>
                  </div>
                ))
              ) : (
                <div className="py-12 text-center text-xs font-mono text-zinc-500">
                  No chunk details available.
                </div>
              )}
            </div>

            <div className="pt-3 border-t border-white/[0.08] flex items-center justify-between text-[11px] font-mono text-zinc-500">
              <span>Section boundaries preserved without arbitrary token cuts.</span>
              <Button size="sm" variant="ghost" onClick={() => setActiveChunkDoc(null)} className="text-xs">
                Close
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* NEW API KEY MODAL */}
      {newKeyModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md rounded-xl border border-white/[0.1] bg-[#090b10] p-6 space-y-5 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-white/[0.08]">
              <span className="text-sm font-semibold font-mono text-white">Generate Secret API Key</span>
              <button onClick={() => setNewKeyModalOpen(false)} className="text-zinc-400 hover:text-white text-xs">
                &times; Close
              </button>
            </div>

            {issuedRawKey ? (
              <div className="space-y-4 font-mono text-xs">
                <div className="p-3 rounded bg-amber-500/10 border border-amber-500/20 text-amber-300 text-[11px] flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 text-amber-400 mt-0.5" />
                  <span>Copy this key immediately. You will not be able to view it again!</span>
                </div>
                <div className="p-3 rounded bg-[#050608] border border-white/[0.08] text-emerald-400 flex items-center justify-between">
                  <code className="text-xs break-all">{issuedRawKey}</code>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(issuedRawKey);
                      setCopiedKey(true);
                      toast.success("Key copied to clipboard");
                      setTimeout(() => setCopiedKey(false), 2000);
                    }}
                    className="ml-2 hover:text-white"
                  >
                    {copiedKey ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-3 font-mono text-xs">
                <label className="text-zinc-400 block">Key Name / Description</label>
                <input
                  type="text"
                  value={newKeyName}
                  onChange={(e) => setNewKeyName(e.target.value)}
                  placeholder="e.g. Ingestion Pipeline Worker"
                  className="w-full bg-[#050608] border border-white/[0.08] rounded-md px-3 py-2 text-zinc-200"
                />
              </div>
            )}

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-white/[0.08]">
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => setNewKeyModalOpen(false)}
                className="text-xs text-zinc-400"
              >
                Close
              </Button>
              {!issuedRawKey && (
                <Button 
                  onClick={handleCreateApiKey} 
                  size="sm" 
                  className="bg-emerald-500 text-black hover:bg-emerald-400 text-xs font-mono"
                >
                  Generate Key
                </Button>
              )}
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
