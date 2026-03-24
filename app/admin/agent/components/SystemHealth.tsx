"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { FiServer, FiDatabase, FiCloud, FiClock, FiActivity, FiSearch, FiZap } from "react-icons/fi";

export default function SystemHealth() {
  const [health, setHealth] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchHealth = async () => {
      try {
        const res = await fetch("/api/admin/agent/health");
        if (!res.ok) throw new Error("Health API failed");
        const data = await res.json();
        if (data.success) {
          setHealth(data.health);
          setError(null);
        }
      } catch (err: any) {
        console.error("Health check failed", err);
        setError(err.message);
      }
    };

    fetchHealth();
    const interval = setInterval(fetchHealth, 10000); // Check every 10s
    return () => clearInterval(interval);
  }, []);

  if (error) return (
    <div className="glass-panel border-red-500/20 p-8 rounded-3xl text-red-500 flex flex-col items-center justify-center gap-6 text-center h-full">
      <div className="p-5 bg-red-500/10 rounded-2xl animate-pulse border border-red-500/30">
        <FiServer size={48} />
      </div>
      <div>
        <h3 className="text-xl font-black uppercase tracking-tighter mb-2">Connection Error</h3>
        <p className="text-[10px] font-bold opacity-60 max-w-[200px] uppercase tracking-widest leading-loose">{error}</p>
      </div>
      <button 
        onClick={() => window.location.reload()}
        className="px-6 py-2 bg-red-500 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-red-600 transition-colors"
      >
        Retry Connection
      </button>
    </div>
  );

  if (!health) return (
    <div className="glass-panel p-12 rounded-3xl flex flex-col items-center justify-center gap-6 h-full">
      <div className="relative">
        <div className="w-16 h-16 border-2 border-yellow-500/10 border-t-yellow-500 rounded-full animate-spin" />
        <FiActivity className="absolute inset-0 m-auto text-yellow-500 animate-pulse" size={24} />
      </div>
      <span className="text-[10px] text-gray-500 font-black uppercase tracking-[0.4em] animate-pulse">Checking System Health...</span>
    </div>
  );

  return (
    <div className="glass-panel rounded-3xl p-8 relative overflow-hidden group h-full">
      <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
        <FiActivity size={140} className="text-white" />
      </div>

      <h2 className="text-2xl font-black text-white mb-10 flex items-center gap-4 font-display tracking-tighter uppercase relative z-10">
        <span className="p-3 bg-blue-500 text-black rounded-2xl shadow-[0_0_20px_rgba(59,130,246,0.3)]">
          <FiActivity />
        </span>
        System Health
      </h2>

      <div className="grid grid-cols-1 gap-4 relative z-10">
        <MetricCard 
          icon={<FiDatabase />}
          label="MongoDB Hub"
          value={health.mongodb}
          status={health.mongodb === "connected" ? "STABLE" : "FAIL"}
          color="green"
          latency="CLOUD-NET"
        />
        
        <MetricCard 
          icon={<FiCloud />}
          label="Redis Stream"
          value={health.redis}
          status="CACHED"
          color="blue"
          latency={health.latency.redis}
        />

        <MetricCard 
          icon={<FiClock />}
          label="TMDB Gateway"
          value={health.tmdb}
          status="EXTERNAL"
          color="yellow"
          latency={health.latency.tmdb}
        />
      </div>

      <div className="mt-10 pt-6 border-t border-white/5 flex items-center justify-between relative z-10">
        <div className="flex items-center gap-3">
          <div className="h-2 w-2 bg-green-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.5)]" />
          <span className="text-[9px] text-gray-500 font-bold uppercase tracking-[0.2em]">AI System: Online</span>
        </div>
        <span className="text-[9px] text-gray-600 font-mono">v4.0.12-secure</span>
      </div>
    </div>
  );
}

function MetricCard({ icon, label, value, status, color, latency }: any) {
  const colors: any = {
    green: "text-green-500 bg-green-500/10 border-green-500/20 shadow-green-500/5",
    blue: "text-blue-400 bg-blue-500/10 border-blue-500/20 shadow-blue-500/5",
    yellow: "text-yellow-500 bg-yellow-500/10 border-yellow-500/20 shadow-yellow-500/5"
  };

  return (
    <div className="flex items-center justify-between p-5 bg-white/5 rounded-3xl border border-white/5 group/card hover:bg-white/10 hover:border-white/10 transition-all shadow-xl">
      <div className="flex items-center gap-5">
        <div className={`p-3.5 rounded-2xl border ${colors[color]} group-hover/card:scale-110 transition-transform`}>
          {icon}
        </div>
        <div>
          <p className="text-[9px] font-black text-gray-500 uppercase tracking-[0.2em] mb-1.5">{label}</p>
          <div className="flex items-center gap-3">
            <span className="text-sm font-black text-white uppercase tracking-tighter">{value}</span>
            <span className={`text-[8px] px-2 py-0.5 rounded-full font-black uppercase tracking-widest border border-white/5 bg-black/40 ${status === 'FAIL' ? 'text-red-500 border-red-500/30' : 'text-gray-400'}`}>
              {status}
            </span>
          </div>
        </div>
      </div>
      <div className="text-right">
        <p className="text-[8px] text-gray-600 font-black uppercase tracking-widest mb-1.5">Latency</p>
        <p className={`text-xs font-mono font-black ${latency.includes('ms') && parseInt(latency) > 200 ? 'text-red-500' : 'text-white/60'}`}>
          {latency}
        </p>
      </div>
    </div>
  );
}
