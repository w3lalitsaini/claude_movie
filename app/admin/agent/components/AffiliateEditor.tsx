"use client";

import { motion } from "framer-motion";
import { RiLinkM, RiHandCoinLine, RiExternalLinkLine, RiPencilLine, RiDeleteBinLine, RiInformationLine, RiAddCircleLine, RiMouseLine, RiMoneyDollarCircleLine } from "react-icons/ri";

const mockAffiliates = [
  { id: 1, name: "Amazon Prime Video", link: "https://amzn.to/3zXyz", clicks: 1240, revenue: 156.50 },
  { id: 2, name: "Netflix Referral", link: "https://netflix.com/ref?id=atoz", clicks: 850, revenue: 92.20 },
  { id: 3, name: "BookMyShow API", link: "https://bookmyshow.com/atoz", clicks: 420, revenue: 45.00 },
];

export default function AffiliateEditor() {
  return (
    <div className="glass-panel rounded-3xl p-8 h-full flex flex-col relative overflow-hidden group">
      <div className="mb-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative z-10">
        <div>
          <h2 className="text-2xl font-black text-white flex items-center gap-3 font-display tracking-wider">
            <span className="p-2 bg-emerald-500/10 rounded-xl border border-emerald-500/20">
              <RiLinkM className="text-emerald-500" />
            </span>
            AFFILIATE HUB
          </h2>
          <p className="text-gray-500 text-xs mt-1 font-medium italic">Managing strategic links and conversion triggers</p>
        </div>
        <motion.button 
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="text-[10px] bg-white text-black px-5 py-2.5 rounded-xl font-black transition-all shadow-xl hover:bg-emerald-500 hover:text-white uppercase tracking-widest flex items-center gap-2"
        >
          <RiAddCircleLine size={16} /> Register Link
        </motion.button>
      </div>

      <div className="flex-1 space-y-4 overflow-y-auto pr-2 custom-scrollbar relative z-10">
        {mockAffiliates.map((aff, idx) => (
          <motion.div 
            key={aff.id} 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: idx * 0.1 }}
            className="p-6 bg-white/5 border border-white/5 rounded-2xl hover:bg-white/10 hover:border-white/10 transition-all group/aff cursor-pointer relative overflow-hidden"
          >
            <div className="flex justify-between items-start mb-4">
              <div className="flex-1 min-w-0">
                <p className="text-[10px] text-gray-500 font-black uppercase tracking-widest mb-1 flex items-center gap-2">
                  <RiExternalLinkLine className="text-emerald-500/60" /> Conversion Target
                </p>
                <h3 className="text-sm font-black text-white truncate group-hover/aff:text-emerald-400 transition-colors uppercase tracking-tight">
                  {aff.name}
                </h3>
              </div>
              <div className="text-right">
                <p className="text-[10px] text-gray-500 font-black uppercase mb-1">Yield Yield</p>
                <span className="text-sm font-black text-emerald-500 bg-emerald-500/10 px-3 py-1 rounded-lg border border-emerald-500/20 shadow-[0_0_10px_rgba(16,185,129,0.2)]">
                  ${aff.revenue.toFixed(2)}
                </span>
              </div>
            </div>

            <div className="p-3 bg-black/40 rounded-xl border border-white/5 flex items-center gap-4 mb-6">
              <span className="text-[10px] text-gray-600 font-mono font-bold truncate flex-1">{aff.link}</span>
              <RiLinkM className="text-gray-700 shrink-0" />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-2">
                  <RiMouseLine className="text-gray-600" />
                  <span className="text-[10px] text-gray-500 font-black uppercase">Clicks: <span className="text-white">{aff.clicks}</span></span>
                </div>
              </div>
              <div className="flex gap-3 opacity-0 group-hover/aff:opacity-100 transition-all translate-x-4 group-hover/aff:translate-x-0">
                <button className="p-2 text-gray-400 hover:text-white transition-colors bg-white/5 rounded-lg border border-white/5">
                  <RiPencilLine size={14} />
                </button>
                <button className="p-2 text-red-500/60 hover:text-red-500 transition-colors bg-white/5 rounded-lg border border-white/5">
                  <RiDeleteBinLine size={14} />
                </button>
              </div>
            </div>
            
            <RiMoneyDollarCircleLine className="absolute -bottom-6 -right-6 text-emerald-500 opacity-0 group-hover/aff:opacity-5 transition-opacity" size={120} />
          </motion.div>
        ))}
      </div>
      
      <div className="mt-8 flex items-center justify-center gap-2 text-[8px] text-gray-600 font-black uppercase tracking-[0.2em] relative z-10">
        <RiInformationLine /> Affiliate metadata cached via Redis Node-P 
      </div>
    </div>
  );
}
