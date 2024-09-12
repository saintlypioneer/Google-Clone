"use client";

import { useEffect, useRef, useState } from "react";
import GoogleLensNavigation from "../components/GoogleLensNavigation";
import ImageSearchImageHandler from "../components/ImageSearchImageHandler";
import ImageSearchResultCard from "../components/ImageSearchResultCard";

export default function Lens() {
  const navRef = useRef<HTMLDivElement>(null);
  const [navHeight, setNavHeight] = useState(0);

  useEffect(() => {
    if (navRef.current) {
      setNavHeight(navRef.current.getBoundingClientRect().height);
    }

    const updateNavHeight = () => {
      if (navRef.current) {
        setNavHeight(navRef.current.getBoundingClientRect().height);
      }
    };

    window.addEventListener('resize', updateNavHeight);
    return () => window.removeEventListener('resize', updateNavHeight);
  }, []);

  return (
    <div className="flex flex-col h-screen">
      <header ref={navRef} className="bg-white px-4 py-3">
        <GoogleLensNavigation />
      </header>
      <div className="flex-grow grid grid-cols-2 overflow-hidden">
        <div className="overflow-y-auto">
          <ImageSearchImageHandler />
        </div>
        <div className="bg-white grid grid-cols-4 overflow-y-auto">
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