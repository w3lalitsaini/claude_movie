"use client";

import { motion } from "framer-motion";
import { FiZap } from "react-icons/fi";
import AgentControl from "./components/AgentControl";
import LiveMonitoring from "./components/LiveMonitoring";
import FeatureToggles from "./components/FeatureToggles";
import PerformanceCharts from "./components/PerformanceCharts";
import ExperimentPanel from "./components/ExperimentPanel";
import GoalStrategy from "./components/GoalStrategy";
import MemoryViewer from "./components/MemoryViewer";
import GuardrailsPanel from "./components/GuardrailsPanel";
import SchedulerControl from "./components/SchedulerControl";
import SEOIntelligence from "./components/SEOIntelligence";
import ErrorReport from "./components/ErrorReport";
import SystemHealth from "./components/SystemHealth";
import ManualCreationPanel from "./components/ManualCreationPanel";
import AffiliateEditor from "./components/AffiliateEditor";
import EarningContent from "./components/EarningContent";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1 }
};

export default function AgentAdminPage() {
  return (
    <div className="admin-obsidian min-h-screen p-0 md:p-0 font-sans selection:bg-yellow-500/30 max-w-7xl mx-auto">
      {/* 🔮 Top Bar HUD */}
      <motion.div 
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="mb-10 flex items-center justify-between pb-6 border-b border-white/5"
      >
        <div className="flex items-center gap-6">
          <div className="w-12 h-12 bg-yellow-500 flex items-center justify-center rounded-2xl shadow-[0_0_20px_rgba(234,179,8,0.2)]">
            <FiZap size={24} className="text-black" />
          </div>
          <div>
            <h1 className="text-4xl font-black tracking-tighter text-white uppercase leading-none">
              AI <span className="text-yellow-500">Center</span>
            </h1>
            <p className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.3em] mt-2 flex items-center gap-2">
              <span className="w-1 h-1 bg-yellow-500 rounded-full animate-ping" />
              Active System Core
            </p>
          </div>
        </div>

        <div className="hidden sm:flex items-center gap-4">
          <div className="px-6 py-3 bg-white/5 border border-white/10 rounded-2xl">
            <p className="text-[10px] text-gray-500 uppercase font-black tracking-widest mb-1">AI Power</p>
            <p className="text-xl font-black text-white">98.4<span className="text-xs text-yellow-500 ml-1 font-mono">%</span></p>
          </div>
          <div className="px-6 py-3 bg-white/5 border border-white/10 rounded-2xl shadow-2xl">
            <p className="text-[10px] text-gray-500 uppercase font-black tracking-widest mb-1">Status Mode</p>
            <p className="text-xl font-black text-white">RELIABLE</p>
          </div>
        </div>
      </motion.div>

      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="space-y-10"
      >
        {/* 📋 Main Integration Stack */}
        <motion.div variants={itemVariants}>
          <ManualCreationPanel />
        </motion.div>
        
        <motion.div variants={itemVariants} className="h-[600px]">
          <LiveMonitoring />
        </motion.div>

        <motion.div variants={itemVariants}>
          <AgentControl />
        </motion.div>

        <motion.div variants={itemVariants}>
          <SystemHealth />
        </motion.div>
        
        <motion.div variants={itemVariants}>
          <FeatureToggles />
        </motion.div>

        <motion.div variants={itemVariants}>
          <PerformanceCharts />
        </motion.div>

        <motion.div variants={itemVariants}>
          <AffiliateEditor />
        </motion.div>

        <motion.div variants={itemVariants}>
          <EarningContent />
        </motion.div>

        <motion.div variants={itemVariants}>
          <MemoryViewer />
        </motion.div>

        <motion.div variants={itemVariants}>
          <GuardrailsPanel />
        </motion.div>

        <motion.div variants={itemVariants}>
          <SchedulerControl />
        </motion.div>

        <motion.div variants={itemVariants}>
          <SEOIntelligence />
        </motion.div>

        <motion.div variants={itemVariants}>
          <ExperimentPanel />
        </motion.div>

        <motion.div variants={itemVariants}>
          <GoalStrategy />
        </motion.div>

        <motion.div variants={itemVariants}>
          <ErrorReport />
        </motion.div>
      </motion.div>
      
      {/* 🔮 Background Glows */}
      <div className="fixed top-0 left-1/4 w-[500px] h-[500px] bg-yellow-500/5 blur-[120px] rounded-full -z-10 animate-pulse" />
      <div className="fixed bottom-0 right-1/4 w-[600px] h-[600px] bg-blue-500/5 blur-[150px] rounded-full -z-10" />
    </div>
  );
}
