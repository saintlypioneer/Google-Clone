"use client";

import Image from "next/image";
import { useState } from "react";

type SearchBarState = "IDLE" | "TEXT_SEARCHING" | "SPEAKING" | "CAMERA";

export default function SearchBar() {
  const [searchState, setSearchState] = useState<SearchBarState>("IDLE");

  return (
    <div className={`w-full max-w-xl border ${(searchState === "IDLE" ? "dark:border-[#5f6368] dark:bg-[#202124]": "dark:border-transparent shadow-[0_1px_6px_0_#171717] dark:bg-[#303134]")} hover:bg-[#303134] hover:shadow-[0_1px_6px_0_#171717] hover:border-transparent rounded-3xl p-3 flex items-center gap-2`}>
      {searchState === "IDLE" && (
        <>
          <Image
            src="/searchMagnifier.svg"
            alt="Search Magnifier"
            width={20}
            height={20}
          />
          <input
            type="text"
            className="bg-transparent outline-none dark:text-[#e8e8e8] w-full"
          />
          <Image onClick={()=>setSearchState("SPEAKING")}
            src="/mic.svg"
            className="mr-2"
            alt="Mic icon"
            width={24}
            height={24}
          />
          <Image onClick={()=> setSearchState("CAMERA")} src="/camera.svg" alt="Camera icon" width={24} height={24} />
        </>
      )}
      {
        searchState === "CAMERA" && (
            <div className="w-full p-3">
                <div className="flex items-center w-full">
                    {/* heading */}
                    <span className="font-sans text-base flex-1 text-center">Search any image with Google Lens</span>
                    <button onClick={()=>setSearchState("IDLE")}>
                        <Image src="/cross.svg" alt="Close or cross icon" width={20} height={20} />
                    </button>
                </div>
                <div className="mt-4 bg-[#202124] p-6 rounded-lg border border-dashed border-[#3c4043] flex flex-col items-center">
                    {/* main content */}
                    <div>Top</div>
                    <div className="w-full">
                        <div className="flex items-center w-full gap-4">
                            {/* divider */}
                            <div className="flex-1 h-[1px] bg-[#3c4043]"></div>
                            <span className="text-[#9aa0a6]">OR</span>
                            <div className="flex-1 h-[1px] bg-[#3c4043]"></div>
                        </div>
                        <div>
                            <input type="text" className="w-full bg-transparent outline-none dark:text-[#e8e8e8] p-3 rounded-lg mt-4" placeholder="Paste image link" />
                        </div>
                    </div>
                </div>
            </div>
        )
      }
    </div>
  );
}
