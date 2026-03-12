import { Suspense } from "react";
import SearchContent from "./SearchContent";

export default function SearchPage() {
  return (
    <Suspense fallback={<div className="pt-[90px] min-h-screen flex items-center justify-center"><div className="w-10 h-10 border-2 border-[#e50914] border-t-transparent rounded-full animate-spin"/></div>}>
      <SearchContent />
    </Suspense>
  );
}
