import Link from "next/link";
import { FiArrowRight } from "react-icons/fi";

interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  viewAllHref?: string;
}

export default function SectionHeader({ title, subtitle, viewAllHref }: SectionHeaderProps) {
  return (
    <div className="flex items-center justify-between mb-6">
      <div className="flex items-start gap-3">
        <span className="w-1 h-7 bg-[#e50914] inline-block rounded-sm mt-0.5 flex-shrink-0" />
        <div>
          <h2 className="text-white font-display font-bold text-xl uppercase tracking-widest">
            {title}
          </h2>
          {subtitle && <p className="text-[#666] text-xs mt-0.5">{subtitle}</p>}
        </div>
      </div>
      {viewAllHref && (
        <Link
          href={viewAllHref}
          className="flex items-center gap-1.5 text-xs text-[#888] hover:text-[#e50914] uppercase tracking-widest font-semibold transition-colors group"
        >
          VIEW ALL
          <FiArrowRight size={12} className="group-hover:translate-x-1 transition-transform" />
        </Link>
      )}
    </div>
  );
}
