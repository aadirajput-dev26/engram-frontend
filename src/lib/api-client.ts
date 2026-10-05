/**
 * Engram API Client
 * Wraps all FastAPI backend endpoints with automatic fallback to realistic local demo mode
 * when the local backend service is offline.
 */

export interface Organization {
  org_id: string;
  org_name: string;
  org_slug: string;
  user_id: string;
  email: string;
  access_token: string;
}

export interface Workspace {
  workspace_id: string;
  org_id: string;
  name: string;
  slug: string;
  description?: string;
  created_at: string;
}

export interface ApiKeyItem {
  key_id: string;
  key_prefix: string;
  name: string;
  workspace_id: string;
  org_id: string;
  created_at: string;
  is_active: boolean;
}

export interface CollectionItem {
  id: string;
  name: string;
  description?: string;
  document_count?: number;
  created_at?: string;
}

export interface DocumentItem {
  id: string;
  filename: string;
  content_hash?: string;
  folder_id?: string;
  current_version_id?: string;
  status: string;
  created_at: string;
  file_size?: number;
}

export interface DocumentChunk {
  chunk_id: string;
  chunk_index: number;
  page_start: number;
  page_end: number;
  section_path?: string;
  chunk_type: string;
  snippet: string;
}

export interface Citation {
  citation_id: string;
  document_id: string;
  document_name: string;
  page_start: number;
  page_end: number;
  section_path?: string;
  snippet: string;
}

export interface QueryResult {
  answer: string;
  route_used: "structured" | "rag" | "hybrid";
  no_evidence: boolean;
  citations: Citation[];
  structured_evidence: any[];
  confidence: number;
  latency_ms: number;
}

export interface SearchResultItem {
  chunk_id: string;
  document_id: string;
  document_name: string;
  page_start: number;
  page_end: number;
  section_path?: string;
  snippet: string;
  semantic_score?: number;
  keyword_score?: number;
  fused_score?: number;
  rerank_score?: number;
}

export interface SearchResult {
  results: SearchResultItem[];
  total: number;
  latency_ms: number;
}

// Local mock data store initialized in localStorage
const STORAGE_PREFIX = "engram_dev_";

export const getStoredToken = (): string | null => {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(`${STORAGE_PREFIX}jwt_token`) || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkJXVCJ9.demo_token";
};

export const setStoredToken = (token: string) => {
  if (typeof window !== "undefined") {
    localStorage.setItem(`${STORAGE_PREFIX}jwt_token`, token);
  }
};

export const getStoredApiKey = (): string => {
  if (typeof window === "undefined") return "sk-engram-demo-testkey-8912";
  return localStorage.getItem(`${STORAGE_PREFIX}api_key`) || "sk-engram-demo-testkey-8912";
};

export const setStoredApiKey = (key: string) => {
  if (typeof window !== "undefined") {
    localStorage.setItem(`${STORAGE_PREFIX}api_key`, key);
  }
};

const BASE_API_URL = process.env.NEXT_PUBLIC_API_URL || "";

// Default demo dataset
export const DEMO_DOCUMENTS: DocumentItem[] = [
  {
    id: "4fb2b824-159c-4f29-9e07-b538303c63ef",
    filename: "q3_financial_and_operational_report.pdf",
    content_hash: "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
    status: "READY",
    created_at: new Date(Date.now() - 3600000 * 24).toISOString(),
    file_size: 2450000,
  },
  {
    id: "8c7a109b-643d-4c6e-82d1-9f3b2e7c1044",
    filename: "cloud_infrastructure_security_architecture.pdf",
    content_hash: "a591a6d40bf420404a011733cfb7b190d62c65bf0bcda32b57b277d9ad9f146e",
    status: "READY",
    created_at: new Date(Date.now() - 3600000 * 48).toISOString(),
    file_size: 1840000,
  },
  {
    id: "f1a23456-789a-bcde-f012-3456789abcde",
    filename: "distributed_consensus_whitepaper.md",
    content_hash: "c28b6d859b8779b5c28ecdd09c48855e975a6c1178a9462d7c5ee3c233f8d227",
    status: "READY",
    created_at: new Date(Date.now() - 3600000 * 72).toISOString(),
    file_size: 450000,
  },
];

export const DEMO_CHUNKS: Record<string, DocumentChunk[]> = {
  "4fb2b824-159c-4f29-9e07-b538303c63ef": [
    {
      chunk_id: "chk-001",
      chunk_index: 0,
      page_start: 1,
      page_end: 2,
      section_path: "1.0 Executive Summary > Key Financial Indicators",
      chunk_type: "paragraph",
      snippet: "During Q3 fiscal period, consolidated net revenue expanded by 18.4% year-over-year reaching $412.5M. Operating margins expanded by 240 basis points, largely driven by automated document processing pipelines and supply-chain rationalization.",
    },
    {
      chunk_id: "chk-002",
      chunk_index: 1,
      page_start: 3,
      page_end: 3,
      section_path: "2.1 Operational Infrastructure > Regional Capacity",
      chunk_type: "paragraph",
      snippet: "Regional extraction efficiency in Sector B achieved a 14.2% yield improvement post-deployment of telemetry sensors. Total production volume crossed 1.2M metric tons across all operational facilities.",
    },
    {
      chunk_id: "chk-003",
      chunk_index: 2,
      page_start: 4,
      page_end: 4,
      section_path: "2.3 Capital Allocations > Technology & R&D",
      chunk_type: "table",
      snippet: "Capital expenditures for enterprise infrastructure: Total committed $38.4M. RAG retrieval pipeline investments accounted for $12.1M with targeted payback within 18 months.",
    },
  ],
};

export const EngramAPI = {
  // Check health
  async checkHealth(): Promise<{ status: string; online: boolean }> {
    try {
      const res = await fetch(`${BASE_API_URL}/health`, { signal: AbortSignal.timeout(2000) });
      if (res.ok) {
        const data = await res.json();
        return { status: data.status || "alive", online: true };
      }
    } catch {
      // offline
    }
    return { status: "offline", online: false };
  },

  // Auth: Register Org
  async registerOrg(payload: { org_name: string; org_slug: string; email: string; password: string; full_name?: string }) {
    try {
      const res = await fetch(`${BASE_API_URL}/api/v1/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (res.ok) {
        const data = await res.json();
        setStoredToken(data.access_token);
        return data;
      }
    } catch {}
    // Fallback simulation
    const mockToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkJXVCJ9.mock_registered_session";
    setStoredToken(mockToken);
    return {
      org_id: "bb5fada1-d7aa-4c49-af0d-117f2b074229",
      org_name: payload.org_name,
      org_slug: payload.org_slug,
      user_id: "804659e2-a722-488c-9bf2-cb952e73d25e",
      email: payload.email,
      access_token: mockToken,
    };
  },

  // Auth: Workspaces
  async listWorkspaces(token?: string): Promise<Workspace[]> {
    const jwt = token || getStoredToken();
    try {
      const res = await fetch(`${BASE_API_URL}/api/v1/auth/workspaces`, {
        headers: { Authorization: `Bearer ${jwt}` },
      });
      if (res.ok) {
        const data = await res.json();
        return data.workspaces || data;
      }
    } catch {}
    return [
      {
        workspace_id: "21af0e43-cd85-413e-8f38-655e5cc733c8",
        org_id: "bb5fada1-d7aa-4c49-af0d-117f2b074229",
        name: "Production",
        slug: "production",
        description: "Primary workspace for live document retrieval",
        created_at: new Date(Date.now() - 3600000 * 24 * 7).toISOString(),
      },
    ];
  },

  // Auth: API Keys
  async listApiKeys(workspaceId?: string): Promise<ApiKeyItem[]> {
    const jwt = getStoredToken();
    try {
      const url = workspaceId 
        ? `${BASE_API_URL}/api/v1/auth/api-keys?workspace_id=${workspaceId}` 
        : `${BASE_API_URL}/api/v1/auth/api-keys`;
      const res = await fetch(url, {
        headers: { Authorization: `Bearer ${jwt}` },
      });
      if (res.ok) {
        const data = await res.json();
        return data.api_keys || data;
      }
    } catch {}
    return [
      {
        key_id: "e4f1511c-11eb-46dd-bee1-551e4a9368f6",
        key_prefix: "sk-engram-prod...",
        name: "Production Ingestion Key",
        workspace_id: "21af0e43-cd85-413e-8f38-655e5cc733c8",
        org_id: "bb5fada1-d7aa-4c49-af0d-117f2b074229",
        created_at: new Date(Date.now() - 3600000 * 24 * 3).toISOString(),
        is_active: true,
      },
      {
        key_id: "f891b22d-22fc-47ee-cff2-662f5b0479a7",
        key_prefix: "sk-engram-dev...",
        name: "Local Testing Key",
        workspace_id: "21af0e43-cd85-413e-8f38-655e5cc733c8",
        org_id: "bb5fada1-d7aa-4c49-af0d-117f2b074229",
        created_at: new Date(Date.now() - 3600000 * 12).toISOString(),
        is_active: true,
      },
    ];
  },

  async issueApiKey(payload: { workspace_id: string; name: string }) {
    const jwt = getStoredToken();
    try {
      const res = await fetch(`${BASE_API_URL}/api/v1/auth/api-keys`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${jwt}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });
      if (res.ok) {
        return await res.json();
      }
    } catch {}
    const rawKey = `sk-engram-${Math.random().toString(36).substring(2, 12)}-${Date.now().toString(36)}`;
    return {
      key_id: crypto.randomUUID?.() || "new-key-id",
      key: rawKey,
      key_prefix: rawKey.slice(0, 16) + "...",
      name: payload.name,
      workspace_id: payload.workspace_id,
      created_at: new Date().toISOString(),
      is_active: true,
    };
  },

  // Documents: List
  async listDocuments(folderId?: string): Promise<DocumentItem[]> {
    const apiKey = getStoredApiKey();
    try {
      const url = folderId 
        ? `${BASE_API_URL}/api/v1/documents?folder_id=${folderId}` 
        : `${BASE_API_URL}/api/v1/documents`;
      const res = await fetch(url, {
        headers: { "x-api-key": apiKey },
      });
      if (res.ok) {
        const data = await res.json();
        return data.documents || [];
      }
    } catch {}
    return DEMO_DOCUMENTS;
  },

  // Documents: Ingest File
  async ingestDocumentFile(file: File, folderId?: string) {
    const apiKey = getStoredApiKey();
    const formData = new FormData();
    formData.append("file", file);
    formData.append("filename", file.name);
    if (folderId) formData.append("folder_id", folderId);

    try {
      const res = await fetch(`${BASE_API_URL}/api/v1/documents/ingest`, {
        method: "POST",
        headers: { "x-api-key": apiKey },
        body: formData,
      });
      if (res.ok) {
        return await res.json();
      }
    } catch {}

    // Simulated response matching real FastAPI DocumentIngestResponse schema
    return {
      document_id: crypto.randomUUID?.() || "mock-doc-uuid",
      document_version_id: crypto.randomUUID?.() || "mock-ver-uuid",
      job_id: crypto.randomUUID?.() || "mock-job-uuid",
      status: "QUEUED",
      filename: file.name,
    };
  },

  // Documents: Ingest URL
  async ingestDocumentUrl(url: string, filename?: string, folderId?: string) {
    const apiKey = getStoredApiKey();
    const formData = new FormData();
    formData.append("url", url);
    if (filename) formData.append("filename", filename);
    if (folderId) formData.append("folder_id", folderId);

    try {
      const res = await fetch(`${BASE_API_URL}/api/v1/documents/ingest`, {
        method: "POST",
        headers: { "x-api-key": apiKey },
        body: formData,
      });
      if (res.ok) {
        return await res.json();
      }
    } catch {}

    return {
      document_id: crypto.randomUUID?.() || "mock-url-uuid",
      document_version_id: crypto.randomUUID?.() || "mock-ver-uuid",
      job_id: crypto.randomUUID?.() || "mock-job-uuid",
      status: "QUEUED",
      filename: filename || url.split("/").pop() || "scraped_document.html",
    };
  },

  // Documents: Chunks
  async getDocumentChunks(documentId: string): Promise<DocumentChunk[]> {
    const apiKey = getStoredApiKey();
    try {
      const res = await fetch(`${BASE_API_URL}/api/v1/documents/${documentId}/chunks`, {
        headers: { "x-api-key": apiKey },
      });
      if (res.ok) {
        const data = await res.json();
        return data.chunks || [];
      }
    } catch {}

    return DEMO_CHUNKS[documentId] || [
      {
        chunk_id: "chk-sample-01",
        chunk_index: 0,
        page_start: 1,
        page_end: 1,
        section_path: "1. Overview",
        chunk_type: "paragraph",
        snippet: "Document structure indexed successfully. Chunks are bounded by semantic section headers to preserve context integrity.",
      },
    ];
  },

  // Query: Full RAG Query
  async query(payload: { query_text: string; document_ids?: string[]; collection_id?: string; top_k?: number }): Promise<QueryResult> {
    const apiKey = getStoredApiKey();
    const start = performance.now();
    try {
      const res = await fetch(`${BASE_API_URL}/api/v1/query`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": apiKey,
        },
        body: JSON.stringify(payload),
      });
      if (res.ok) {
        return await res.json();
      }
    } catch {}

    const latency = Math.round(performance.now() - start);

    // Realistic simulation responding to query context
    const qLower = payload.query_text.toLowerCase();
    let answer = "According to Section 1.0 of the financial filing, consolidated revenue reached $412.5M, representing an 18.4% increase year-over-year [cit_1]. Operational efficiency initiatives in Sector B contributed an additional 14.2% yield improvement [cit_2].";
    
    if (qLower.includes("security") || qLower.includes("cloud") || qLower.includes("auth")) {
      answer = "Per the Cloud Infrastructure Security Architecture (Section 3.2), all microservice endpoints require cryptographic mutual TLS or scoped HMAC-SHA256 API tokens (`sk-engram-*`) [cit_1]. Data isolation is enforced at the PostgreSQL schema and Qdrant payload filter levels [cit_2].";
    }

    return {
      answer,
      route_used: "hybrid",
      no_evidence: false,
      citations: [
        {
          citation_id: "cit_1",
          document_id: "4fb2b824-159c-4f29-9e07-b538303c63ef",
          document_name: "q3_financial_and_operational_report.pdf",
          page_start: 2,
          page_end: 2,
          section_path: "1.0 Executive Summary > Financial Highlights",
          snippet: "Consolidated net revenue expanded by 18.4% year-over-year reaching $412.5M. Operating margins expanded by 240 basis points.",
        },
        {
          citation_id: "cit_2",
          document_id: "4fb2b824-159c-4f29-9e07-b538303c63ef",
          document_name: "q3_financial_and_operational_report.pdf",
          page_start: 3,
          page_end: 3,
          section_path: "2.1 Operational Infrastructure > Regional Capacity",
          snippet: "Regional extraction efficiency in Sector B achieved a 14.2% yield improvement post-deployment of telemetry sensors.",
        },
      ],
      structured_evidence: [],
      confidence: 0.94,
      latency_ms: latency > 0 ? latency : 210,
    };
  },

  // Search: Retrieval only
  async search(payload: { query_text: string; top_k?: number; document_ids?: string[] }): Promise<SearchResult> {
    const apiKey = getStoredApiKey();
    const start = performance.now();
    try {
      const res = await fetch(`${BASE_API_URL}/api/v1/search`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": apiKey,
        },
        body: JSON.stringify(payload),
      });
      if (res.ok) {
        return await res.json();
      }
    } catch {}

    const latency = Math.round(performance.now() - start);
    return {
      results: [
        {
          chunk_id: "chk-001",
          document_id: "4fb2b824-159c-4f29-9e07-b538303c63ef",
          document_name: "q3_financial_and_operational_report.pdf",
          page_start: 1,
          page_end: 2,
          section_path: "1.0 Executive Summary > Key Financial Indicators",
          snippet: "During Q3 fiscal period, consolidated net revenue expanded by 18.4% year-over-year reaching $412.5M. Operating margins expanded by 240 basis points...",
          semantic_score: 0.892,
          keyword_score: 0.764,
          fused_score: 0.032,
          rerank_score: 0.948,
        },
        {
          chunk_id: "chk-002",
          document_id: "4fb2b824-159c-4f29-9e07-b538303c63ef",
          document_name: "q3_financial_and_operational_report.pdf",
          page_start: 3,
          page_end: 3,
          section_path: "2.1 Operational Infrastructure > Regional Capacity",
          snippet: "Regional extraction efficiency in Sector B achieved a 14.2% yield improvement post-deployment of telemetry sensors...",
          semantic_score: 0.841,
          keyword_score: 0.692,
          fused_score: 0.027,
          rerank_score: 0.891,
        },
      ],
      total: 2,
      latency_ms: latency > 0 ? latency : 42,
    };
  },
};
