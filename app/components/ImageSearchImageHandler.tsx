"use client";

import Image from "next/image";
import { useState } from "react";

export default function ImageSearchImageHandler() {

    const [searchType, setSearchType] = useState("Search");

  return (
    <div className="h-full flex flex-col justify-center items-center gap-10 py-10">
      <button className="flex items-center gap-2 px-5 py-2 bg-transparent hover:bg-white/5 rounded-full border border-white/10">
        <Image
          src="/globe-search.svg"
          alt="Upload icon"
          width={24}
          height={24}
        />
        <span className="text-[#f8f9fa] font-sans text-base font-medium">
          Find image source
        </span>
      </button>
      <div className="bg-blue-400 w-full flex-1 overflow-clip">
        {/* image crop handler */}
        <div className="w-[20%] aspect-square bg-red-500">
            HELLO
        </div>
      </div>
      <div className="text-white/80 bg-[rgba(95,99,104,0.4)] flex rounded-full text-sm">
        {/* choose bw different kind of image search */}
        <button onClick={()=>setSearchType('Search')} className={`${(searchType === "Search") ? "bg-white text-[#202124]" : ""} rounded-full px-3 py-[5px]`}>Search</button>
        <button onClick={()=>setSearchType('Text')} className={`${(searchType === "Text") ? "bg-white text-[#202124]" : ""} rounded-full px-3 py-[5px]`}>Text</button>
        <button onClick={()=>setSearchType('Translate')} className={`${(searchType === "Translate") ? "bg-white text-[#202124]" : ""} rounded-full px-3 py-[5px]`}>Translate</button>
      </div>
    </div>
  );
}
