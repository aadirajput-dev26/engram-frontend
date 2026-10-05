import Link from "next/link";
import { Terminal, ExternalLink } from "lucide-react";
import { GithubIcon } from "@/components/icons/github";

export function Footer() {
  return (
    <footer className="border-t border-white/[0.08] bg-[#07080b] py-12 text-zinc-400 text-xs">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          
          {/* Brand info */}
          <div className="space-y-3 md:col-span-1">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center">
                <span className="font-mono text-xs font-bold text-emerald-400">E</span>
              </div>
              <span className="font-mono font-semibold tracking-tight text-white text-sm">Engram</span>
            </div>
            <p className="text-zinc-500 leading-relaxed text-xs">
              Structure-aware document intelligence & reasoning infrastructure for developers.
            </p>
            <div className="text-[11px] font-mono text-zinc-500">
              Microservice version: 0.1.0-alpha
            </div>
          </div>

          {/* Product */}
          <div>
            <h4 className="font-mono text-white text-xs uppercase tracking-wider mb-3">Product</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="hover:text-zinc-200 transition-colors">Overview</Link>
              </li>
              <li>
                <Link href="/playground" className="hover:text-zinc-200 transition-colors">API Playground</Link>
              </li>
              <li>
                <Link href="/console" className="hover:text-zinc-200 transition-colors">Developer Console</Link>
              </li>
            </ul>
          </div>

          {/* Documentation */}
          <div>
            <h4 className="font-mono text-white text-xs uppercase tracking-wider mb-3">Documentation</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/docs" className="hover:text-zinc-200 transition-colors">Documentation</Link>
              </li>
              <li>
                <Link href="/docs/api" className="hover:text-zinc-200 transition-colors">OpenAPI Reference</Link>
              </li>
              <li>
                <Link href="/docs#architecture" className="hover:text-zinc-200 transition-colors">System Architecture</Link>
              </li>
              <li>
                <Link href="/docs#authentication" className="hover:text-zinc-200 transition-colors">Authentication (sk-engram-*)</Link>
              </li>
            </ul>
          </div>

          {/* Integration & Developer */}
          <div>
            <h4 className="font-mono text-white text-xs uppercase tracking-wider mb-3">Developers</h4>
            <ul className="space-y-2">
              <li>
                <a 
                  href="https://github.com" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="hover:text-zinc-200 transition-colors flex items-center gap-1.5"
                >
                  <GithubIcon className="w-3.5 h-3.5" />
                  <span>GitHub Repository</span>
                </a>
              </li>
              <li>
                <a 
                  href="/health" 
                  target="_blank" 
                  className="hover:text-zinc-200 transition-colors flex items-center gap-1.5"
                >
                  <Terminal className="w-3.5 h-3.5" />
                  <span>Health Ping (/health)</span>
                </a>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom bar */}
        <div className="pt-8 border-t border-white/[0.05] flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-zinc-500">
          <div>
            &copy; 2026 Engram Systems. Open-source developer infrastructure.
          </div>
          <div className="flex items-center gap-6">
            <span>FastAPI microservice</span>
            <span>Hierarchical Indexing</span>
            <span>Page-accurate Citations</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
