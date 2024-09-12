"use client";

import { useRef } from "react";
import { useSelector } from 'react-redux';
import { RootState } from '../store/store';
import GoogleLensNavigation from "../components/GoogleLensNavigation";
import ImageSearchImageHandler from "../components/ImageSearchImageHandler";
import ImageSearchResultCard from "../components/ImageSearchResultCard";

export default function Lens() {
  const navRef = useRef<HTMLDivElement>(null);
  const searchResults = useSelector((state: RootState) => state.search.results);

  return (
    <div className="flex flex-col h-screen">
      <header ref={navRef} className="bg-white px-4 py-3 border-b">
        <GoogleLensNavigation />
      </header>
      <div className="flex-grow flex overflow-hidden">
        <div className="w-1/2 overflow-y-auto">
          <ImageSearchImageHandler />
        </div>
        <div className="w-1/2 bg-white overflow-y-auto p-5">
          <div className="columns-1 sm:columns-2 md:columns-3 lg:columns-4 gap-4">
            {searchResults.map((result, index) => (
              <div key={index} className="break-inside-avoid mb-8">
                <ImageSearchResultCard result={result} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}