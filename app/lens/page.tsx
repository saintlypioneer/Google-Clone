"use client";

import { useEffect, useRef } from "react";
import { useSelector } from 'react-redux';
import { RootState } from '../store/store';
import GoogleLensNavigation from "../components/GoogleLensNavigation";
import ImageSearchImageHandler from "../components/ImageSearchImageHandler";
import ImageSearchResultCard from "../components/ImageSearchResultCard";
import { useRouter } from "next/navigation";

// Custom Skeleton component
const Skeleton = ({ className }: { className?: string }) => (
  <div className={`animate-pulse bg-gray-200 rounded ${className}`}></div>
);

export default function Lens() {
  const navRef = useRef<HTMLDivElement>(null);
  const {results: searchResults, status} = useSelector((state: RootState) => state.search);

  const router = useRouter();

  useEffect(() => {
    if (status === 'idle' && searchResults.length === 0) {
      router.push('/');
    }
  }, [searchResults, status, router]);

  // Function to render skeleton loaders
  const renderSkeletons = () => {
    return Array(12).fill(0).map((_, index) => (
      <div key={index} className="break-inside-avoid mb-8">
        <Skeleton className="w-full h-48 mb-2" />
        <Skeleton className="w-3/4 h-4 mb-2" />
        <Skeleton className="w-1/2 h-4" />
      </div>
    ));
  };

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
            {status === 'loading' 
              ? renderSkeletons()
              : searchResults.map((result, index) => (
                  <div key={index} className="break-inside-avoid mb-8">
                    <ImageSearchResultCard result={result} />
                  </div>
                ))
            }
          </div>
        </div>
      </div>
    </div>
  );
}