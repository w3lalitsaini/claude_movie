"use client";
import { useEffect, useRef } from "react";

interface AdUnitProps {
  slot?: string;
  format?: "auto" | "fluid" | "rectangle" | "vertical" | "horizontal";
  layout?: "in-article" | "display";
  responsive?: boolean;
  className?: string;
}

const AD_CLIENT = process.env.NEXT_PUBLIC_ADSENSE_CLIENT || "ca-pub-2610891548777436";
const SLOT_AUTO = process.env.NEXT_PUBLIC_AD_SLOT_AUTO || "5985180530";
const SLOT_IN_ARTICLE = process.env.NEXT_PUBLIC_AD_SLOT_IN_ARTICLE || "2125541166";
const SLOT_POSTER = process.env.NEXT_PUBLIC_AD_SLOT_POSTER || "9153983942";

export { SLOT_AUTO, SLOT_IN_ARTICLE, SLOT_POSTER };

export default function AdUnit({
  slot,
  format = "auto",
  layout,
  responsive = true,
  className = "",
}: AdUnitProps) {
  const adRef = useRef<HTMLModElement>(null);
  const pushed = useRef(false);

  // Resolve slot: if not provided, pick based on layout/format
  const resolvedSlot = slot
    ? slot
    : layout === "in-article"
    ? SLOT_IN_ARTICLE
    : format === "rectangle"
    ? SLOT_POSTER
    : SLOT_AUTO;

  useEffect(() => {
    if (pushed.current) return;
    pushed.current = true;
    try {
      // @ts-ignore
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch (err) {
      // silently ignore in dev
    }
  }, []);

  return (
    <div className={`w-full flex justify-center my-4 overflow-hidden ${className}`}>
      <ins
        ref={adRef}
        className="adsbygoogle"
        style={{
          display: layout === "in-article" ? "block" : "block",
          textAlign: layout === "in-article" ? "center" : undefined,
          minWidth: "300px",
          width: "100%",
        }}
        data-ad-client={AD_CLIENT}
        data-ad-slot={resolvedSlot}
        data-ad-format={format}
        data-ad-layout={layout === "in-article" ? "in-article" : undefined}
        data-full-width-responsive={responsive ? "true" : "false"}
      />
    </div>
  );
}
