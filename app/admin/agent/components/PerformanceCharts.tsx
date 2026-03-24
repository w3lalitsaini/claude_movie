"use client";

import { useEffect, useState } from "react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { motion } from "framer-motion";
import { RiLineChartLine, RiMoneyDollarCircleLine, RiPieChartLine, RiInformationLine } from "react-icons/ri";

export default function PerformanceCharts() {
  const [data, setData] = useState<any[]>([]);
  const [totals, setTotals] = useState({ revenue: "0", cost: "0", roi: "0" });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch("/api/admin/agent/stats");
        const json = await res.json();
        if (json.success) {
          setData(json.stats.revenueData);
          setTotals(json.stats.totals);
        }
      } catch (err) {
        console.error("Stats fetch failed", err);
      }
    };
    fetchStats();
    const interval = setInterval(fetchStats, 60000); 
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="glass-panel rounded-3xl p-8 h-full flex flex-col relative overflow-hidden group">
      <div className="mb-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative z-10">
        <div>
          <h2 className="text-2xl font-black text-white flex items-center gap-3 font-display tracking-wider">
            <span className="p-2 bg-green-500/10 rounded-xl border border-green-500/20">
              <RiLineChartLine className="text-green-500" />
            </span>
            REVENUE & COSTS
          </h2>
          <p className="text-gray-500 text-xs mt-1 font-medium">7-Day Revenue and Operating Costs</p>
        </div>
        
        <div className="flex gap-6">
          <div className="text-right">
            <p className="text-[10px] text-gray-500 font-black uppercase tracking-widest mb-1 flex items-center justify-end gap-1">
              <RiMoneyDollarCircleLine /> Weekly Revenue
            </p>
            <p className="text-2xl font-black text-white leading-none">
              <span className="text-green-500">$</span>{totals.revenue}
            </p>
          </div>
          <div className="text-right">
            <p className="text-[10px] text-gray-500 font-black uppercase tracking-widest mb-1 flex items-center justify-end gap-1">
              <RiPieChartLine /> Profitability
            </p>
            <p className="text-2xl font-black text-cyan-400 leading-none">
              {totals.roi}<span className="text-xs ml-1">%</span>
            </p>
          </div>
        </div>
      </div>

      <div className="flex-1 min-h-[250px] w-full mt-4 relative z-10">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#22c55e" stopOpacity={0.4}/>
                <stop offset="95%" stopColor="#22c55e" stopOpacity={0}/>
              </linearGradient>
              <linearGradient id="colorCost" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#00f2ff" stopOpacity={0.4}/>
                <stop offset="95%" stopColor="#00f2ff" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
            <XAxis 
              dataKey="name" 
              fontSize={10} 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: '#444', fontWeight: 'bold' }} 
              dy={10}
            />
            <YAxis 
              fontSize={10} 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: '#444', fontWeight: 'bold' }} 
              tickFormatter={(val) => `$${val}`}
            />
            <Tooltip 
              content={<CustomTooltip />}
              cursor={{ stroke: 'rgba(255,255,255,0.1)', strokeWidth: 2 }}
            />
            <Area 
              type="monotone" 
              dataKey="revenue" 
              stroke="#22c55e" 
              strokeWidth={4}
              fillOpacity={1} 
              fill="url(#colorRev)" 
              animationDuration={2000}
            />
            <Area 
              type="monotone" 
              dataKey="cost" 
              stroke="#00f2ff" 
              strokeWidth={3}
              fillOpacity={1} 
              fill="url(#colorCost)" 
              animationDuration={2500}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-8 flex items-center justify-between pt-6 border-t border-white/5 relative z-10">
        <div className="flex items-center gap-2">
          <RiInformationLine className="text-gray-600" />
          <span className="text-[9px] text-gray-600 font-bold uppercase tracking-[0.2em]">Financial Data: Live</span>
        </div>
        <div className="flex items-center gap-2 px-3 py-1 bg-white/5 rounded-full border border-white/5">
          <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.5)]" />
          <span className="text-[8px] text-white/50 font-black">REALTIME</span>
        </div>
      </div>
    </div>
  );
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="glass-panel p-4 rounded-2xl border-white/10 shadow-2xl backdrop-blur-3xl">
        <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-2 border-b border-white/5 pb-1">{label}</p>
        <div className="space-y-1.5">
          <div className="flex items-center justify-between gap-8">
            <span className="text-[10px] font-bold text-green-500 uppercase">Revenue</span>
            <span className="text-xs font-black text-white">${payload[0].value}</span>
          </div>
          <div className="flex items-center justify-between gap-8">
            <span className="text-[10px] font-bold text-cyan-400 uppercase">System Cost</span>
            <span className="text-xs font-black text-white">${payload[1].value}</span>
          </div>
        </div>
      </div>
    );
  }
  return null;
};
