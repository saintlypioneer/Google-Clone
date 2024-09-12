"use client";

import Image from "next/image";
import { useState } from "react";

export default function ImageSearchImageHandler() {
    const [searchType, setSearchType] = useState("Search");

    return (
        <div className="flex flex-col h-full">
            <div className="flex justify-center items-center py-4">
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
            </div>
            <div className="flex-grow flex items-center justify-center overflow-hidden">
                <div className="w-full h-[80%] relative">
                    <Image 
                        src="/ss.png"
                        alt="Search image"
                        layout="fill"
                        objectFit="contain"
                    />
                </div>
            </div>
            <div className="flex justify-center items-center py-4">
                <div className="text-white/80 bg-[rgba(95,99,104,0.4)] flex rounded-full text-sm">
                    <button onClick={() => setSearchType('Search')} className={`${searchType === "Search" ? "bg-white text-[#202124]" : ""} rounded-full px-3 py-[5px]`}>Search</button>
                    <button onClick={() => setSearchType('Text')} className={`${searchType === "Text" ? "bg-white text-[#202124]" : ""} rounded-full px-3 py-[5px]`}>Text</button>
                    <button onClick={() => setSearchType('Translate')} className={`${searchType === "Translate" ? "bg-white text-[#202124]" : ""} rounded-full px-3 py-[5px]`}>Translate</button>
                </div>
            </div>
        </div>
    );
}