"use client";
import { useState, useEffect } from "react";
import { FiDownload, FiClock } from "react-icons/fi";
import AdUnit from "@/components/ui/AdUnit";

interface DownloadLink {
  quality: string;
  size: string;
  url: string;
}

export default function DelayedDownload({ links }: { links: DownloadLink[] }) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [timeLeft, setTimeLeft] = useState(15);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isGenerating && timeLeft > 0) {
      timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
    } else if (isGenerating && timeLeft === 0) {
      setIsReady(true);
      setIsGenerating(false);
    }
    return () => clearTimeout(timer);
  }, [isGenerating, timeLeft]);

  const handleGenerate = () => {
    setIsGenerating(true);
  };

  if (!links || links.length === 0) return null;

  return (
    <div className="bg-[#111] border border-[#222] rounded-sm p-6 text-center">
      {!isGenerating && !isReady ? (
        <div className="flex flex-col items-center">
          <p className="text-[#aaa] mb-4 text-sm">
            Click below to generate download links for this movie.
          </p>
          <button
            onClick={handleGenerate}
            className="btn-red flex items-center gap-2 text-white font-bold px-8 py-3 rounded-sm tracking-wider uppercase"
          >
            <FiDownload size={18} /> Generate Links
          </button>
        </div>
      ) : isGenerating ? (
        <div className="flex flex-col items-center py-4">
          <FiClock size={36} className="text-[#e50914] animate-pulse mb-3" />
          <h3 className="text-white font-bold text-xl mb-2">
            Generating Links...
          </h3>
          <p className="text-[#aaa] text-sm mb-4">
            Please wait{" "}
            <span className="text-[#e50914] font-bold text-lg">{timeLeft}</span>{" "}
            seconds.
          </p>
          {/* Inject ad during waiting time */}
          <div className="w-full max-w-md mx-auto my-4">
            <AdUnit slot="9153983942" format="fluid" layout="in-article" />
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          <h3 className="text-[#4ade80] font-bold text-lg mb-4">
            Links Generated Successfully!
          </h3>
          {links.map((link) => (
            <div
              key={link.quality}
              className="flex items-center justify-between bg-[#1a1a1a] border border-[#333] hover:border-[#444] rounded-sm p-4 transition-colors"
            >
              <div className="flex flex-col items-start px-2">
                <span className="text-white font-semibold text-sm">
                  {link.quality}
                </span>
                <span className="text-[#888] text-xs">{link.size}</span>
              </div>
              <a
                href={link.url}
                className="btn-red flex items-center gap-2 text-white text-xs font-bold px-5 py-2.5 rounded-sm"
              >
                <FiDownload size={14} /> Download File
              </a>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
