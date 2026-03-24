"use client";

import { motion } from "framer-motion";
import { RiTimeLine, RiPlayList2Line, RiTimerFlashLine, RiRestartLine, RiSettings4Line, RiForbidLine, RiInformationLine, RiArrowRightUpLine } from "react-icons/ri";

const mockCrons = [
  { id: "cron1", name: "Find New Trends", schedule: "0 */6 * * *", status: "Enabled", nextRun: "18:00:00" },
  { id: "cron2", name: "Publish Content", schedule: "0 0 * * *", status: "Enabled", nextRun: "00:00:00" },
  { id: "cron3", name: "System Check", schedule: "0 0 * * 0", status: "Disabled", nextRun: "N/A" },
];

export default function SchedulerControl() {
  return (
    <div className="glass-panel rounded-3xl p-8 h-full flex flex-col relative overflow-hidden group">
      <div className="mb-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative z-10">
        <div>
          <h2 className="text-2xl font-black text-white flex items-center gap-3 font-display tracking-wider">
            <span className="p-2 bg-yellow-500/10 rounded-xl border border-yellow-500/20">
              <RiTimeLine className="text-yellow-500" />
            </span>
            AUTOMATION SCHEDULE
          </h2>
          <p className="text-gray-500 text-xs mt-1 font-medium italic">Managing automatic tasks and schedules</p>
        </div>
        <motion.button 
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="text-[10px] bg-yellow-500 hover:bg-yellow-400 text-black px-5 py-2.5 rounded-xl font-black transition-all shadow-xl shadow-yellow-500/20 uppercase tracking-widest flex items-center gap-2"
        >
          <RiRestartLine size={16} /> Restart All Tasks
        </motion.button>
      </div>

      <div className="flex-1 space-y-4 overflow-y-auto pr-2 custom-scrollbar relative z-10">
        {mockCrons.map((cron, idx) => (
          <motion.div 
            key={cron.id} 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="p-6 bg-white/5 border border-white/5 rounded-2xl hover:bg-white/10 hover:border-white/10 transition-all group/cron cursor-pointer"
          >
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center gap-3">
                <RiPlayList2Line className="text-yellow-500/50" />
                <span className="text-sm font-black text-white group-hover/cron:text-yellow-500 transition-colors uppercase tracking-tight">{cron.name}</span>
              </div>
              <span className={`text-[8px] font-black px-2.5 py-1 rounded-lg border uppercase tracking-widest ${
                cron.status === "Enabled" ? "bg-green-500/10 text-green-500 border-green-500/20" : "bg-white/5 text-gray-500 border-white/5"
              }`}>
                {cron.status}
              </span>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-[10px] font-mono mb-6">
              <div className="p-2 bg-black/40 rounded-xl border border-white/5 flex items-center gap-2">
                <span className="text-gray-600">SCHEDULE:</span>
                <span className="text-yellow-500/80 font-bold">{cron.schedule}</span>
              </div>
              <div className="p-2 bg-black/40 rounded-xl border border-white/5 flex items-center gap-2">
                <span className="text-gray-600">NEXT RUN:</span>
                <span className="text-white font-bold">{cron.nextRun}</span>
              </div>
            </div>

            <div className="flex gap-2 opacity-0 group-hover/cron:opacity-100 transition-all translate-y-2 group-hover/cron:translate-y-0">
              <button className="flex-1 py-2 text-[9px] bg-white text-black rounded-lg font-black uppercase tracking-widest hover:bg-yellow-500 transition-colors flex items-center justify-center gap-2">
                <RiSettings4Line /> Settings
              </button>
              <button className="px-4 py-2 text-[9px] bg-red-500/10 text-red-500 rounded-lg border border-red-500/20 font-black uppercase tracking-widest hover:bg-red-500 hover:text-white transition-all flex items-center justify-center gap-2">
                <RiForbidLine /> Stop
              </button>
            </div>
          </motion.div>
        ))}
      </div>
      
      <div className="mt-8 flex items-center justify-center gap-2 text-[8px] text-gray-600 font-black uppercase tracking-[0.2em] relative z-10">
        <RiInformationLine /> Schedule is synced 
      </div>
    </div>
  );
}
