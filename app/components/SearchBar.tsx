"use client";

import Image from "next/image";
import { useState } from "react";
import GoogleLensSearchPopup from "./GoogleLensSearchPopup";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { setSearchResults } from "../store/searchSlice";

type SearchBarState = "IDLE" | "TEXT_SEARCHING" | "SPEAKING" | "CAMERA";

export default function SearchBar() {
  const router = useRouter();
  const dispatch = useDispatch();

  const [searchState, setSearchState] = useState<SearchBarState>("IDLE");
  const [query, setQuery] = useState("");

  const handleKeyPress = async (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      try {
        const response = await fetch(`/api/v1/search?q=${query}`);
        const data = await response.json();
        dispatch(setSearchResults(data.results));
        // redirect to '/lens'
        router.push("/lens");
        console.log(data);
      } catch (error) {
        console.error('Error fetching search results:', error);
      }
    }
  };

  return (
    <div
      className={`relative w-full max-w-xl border ${
        searchState === "IDLE"
          ? "p-3 dark:border-[#5f6368] dark:bg-[#202124]"
          : "dark:border-transparent shadow-[0_1px_6px_0_#171717] dark:bg-[#303134]"
      } hover:bg-[#303134] hover:shadow-[0_1px_6px_0_#171717] hover:border-transparent rounded-full flex items-center gap-2`}
    >
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
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyPress}
          />
          <Image
            onClick={() => {
              setSearchState("SPEAKING");
              // redirect to '/voice'
              router.push("/voice");
            }}
            src="/micColourful.svg"
            className="mr-2"
            alt="Mic icon"
            width={24}
            height={24}
          />
          <Image
            onClick={() => setSearchState("CAMERA")}
            src="/camera.svg"
            alt="Camera icon"
            width={24}
            height={24}
          />
        </>
      )}
      {searchState === "CAMERA" && (
        <GoogleLensSearchPopup setSearchState={setSearchState} />
      )}
    </div>
  );
}
