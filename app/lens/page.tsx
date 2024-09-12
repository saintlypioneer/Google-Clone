"use client";

import { useRef } from "react";
import GoogleLensNavigation from "../components/GoogleLensNavigation";
import ImageSearchImageHandler from "../components/ImageSearchImageHandler";
import ImageSearchResultCard from "../components/ImageSearchResultCard";

export default function Lens() {
  const navRef = useRef<HTMLDivElement>(null);

  return (
    <div className="flex flex-col h-screen">
      <header ref={navRef} className="bg-white px-4 py-3 border-b">
        <GoogleLensNavigation />
      </header>
      <div className="flex-grow grid grid-cols-2 overflow-hidden">
        <div className="overflow-y-auto">
          <ImageSearchImageHandler />
        </div>
        <div className="bg-white grid grid-cols-4 overflow-y-auto gap-3 p-6">
          {
            // for loop that runs 200 times
            Array.from({ length: 200 }).map((_, index) => (
              <ImageSearchResultCard key={index} />
            ))
          }
        </div>
      </div>
    </div>
  );
}