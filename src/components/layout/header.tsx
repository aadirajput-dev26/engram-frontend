"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { 
  Terminal, 
  BookOpen, 
  Code2, 
  Play, 
  LayoutDashboard, 
  Menu, 
  X, 
  ExternalLink,
  Circle,
  Activity
} from "lucide-react";
import { GithubIcon } from "@/components/icons/github";

export function Header() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [backendStatus, setBackendStatus] = useState<"checking" | "online" | "offline">("checking");

  useEffect(() => {
    // Check local FastAPI health endpoint
    const checkHealth = async () => {
      try {
        const res = await fetch("/health", { signal: AbortSignal.timeout(2000) });
        if (res.ok) {
          setBackendStatus("online");
        } else {
          setBackendStatus("offline");
        }
      } catch {
        setBackendStatus("offline");
      }
    };
    checkHealth();
    const interval = setInterval(checkHealth, 30000);
    return () => clearInterval(interval);
  }, []);

  const navItems = [
    { name: "Overview", href: "/", icon: Terminal },
    { name: "Docs", href: "/docs", icon: BookOpen },
    { name: "API Reference", href: "/docs/api", icon: Code2 },
    { name: "Playground", href: "/playground", icon: Play },
    { name: "Console", href: "/console", icon: LayoutDashboard },
  ];

  return (
    <header className="fixed top-0 z-50 w-full border-b border-white/[0.08] bg-[#08090d]/80 backdrop-blur-md transition-all">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Brand & Version */}
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-400/20 to-cyan-500/10 border border-emerald-500/30 flex items-center justify-center group-hover:border-emerald-500/60 transition-colors">
              <span className="font-mono text-xs font-bold text-emerald-400">E</span>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="font-mono font-semibold tracking-tight text-white text-base">Engram</span>
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-white/[0.05] text-zinc-400 border border-white/[0.08]">
                v0.1
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1 text-xs font-medium">
            {navItems.map((item) => {
              const isActive = item.href === "/" 
                ? pathname === "/" 
                : pathname.startsWith(item.href);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`px-3 py-1.5 rounded-md transition-all ${
                    isActive
                      ? "text-white bg-white/[0.08]"
                      : "text-zinc-400 hover:text-zinc-100 hover:bg-white/[0.04]"
                  }`}
                >
                  {item.name}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-3">
          
          {/* Backend Status Pill */}
          <div 
            title={backendStatus === "online" ? "FastAPI Backend is connected on :8000" : "Local Backend Offline (Simulated Mode active)"}
            className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full border border-white/[0.08] bg-white/[0.03] text-[11px] font-mono"
          >
            <span className={`w-1.5 h-1.5 rounded-full ${
              backendStatus === "online" 
                ? "bg-emerald-400 animate-pulse shadow-[0_0_8px_rgba(52,211,153,0.8)]" 
                : "bg-zinc-500"
            }`} />
            <span className="text-zinc-400">
              {backendStatus === "online" ? "API Live" : "Local Mode"}
            </span>
          </div>

          {/* GitHub link */}
          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:flex items-center gap-1.5 text-xs text-zinc-400 hover:text-white px-2.5 py-1.5 rounded-md hover:bg-white/[0.04] transition-colors"
          >
            <GithubIcon className="w-3.5 h-3.5" />
            <span>GitHub</span>
          </a>

          {/* Console CTA */}
          <Link href="/console">
            <Button 
              size="sm" 
              className="h-8 text-xs font-medium px-3.5 rounded-md bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 border border-emerald-500/30 transition-all shadow-[0_0_12px_rgba(16,185,129,0.1)]"
            >
              Console &rarr;
            </Button>
          </Link>

          {/* Mobile hamburger */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden h-8 w-8 text-zinc-400 hover:text-white"
          >
            {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </Button>
        </div>
      </div>

      {/* Mobile Menu dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-white/[0.08] bg-[#08090d] px-4 pt-2 pb-4 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm ${
                  isActive ? "bg-white/[0.08] text-white" : "text-zinc-400 hover:text-white"
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{item.name}</span>
              </Link>
            );
          })}
          <div className="pt-2 border-t border-white/[0.08] flex items-center justify-between px-3 text-xs text-zinc-400 font-mono">
            <span>Status:</span>
            <span className={backendStatus === "online" ? "text-emerald-400" : "text-zinc-400"}>
              {backendStatus === "online" ? "API Live (:8000)" : "Local Mode"}
            </span>
          </div>
        </div>
      )}
    </header>
  );
}
