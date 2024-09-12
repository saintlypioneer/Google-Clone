"use client";

import Image from "next/image";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setQuery, setQueryType } from "../store/searchSlice";
import { AppDispatch, RootState } from "../store/store";
import GoogleLensSearchPopup from "./GoogleLensSearchPopup";

type SearchBarState = "IDLE" | "TEXT_SEARCHING" | "SPEAKING" | "CAMERA";

interface SearchBarProps {
  onSearch: () => void;
  onVoiceSearch: () => void;
}

export default function SearchBar({ onSearch, onVoiceSearch }: SearchBarProps) {
  const dispatch = useDispatch<AppDispatch>();
  const { query, queryType } = useSelector((state: RootState) => state.search);

  const [searchState, setSearchState] = useState<SearchBarState>("IDLE");

  const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      onSearch();
    }
  };

  const handleQueryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(setQuery(e.target.value));
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
            onChange={handleQueryChange}
            onKeyDown={handleKeyPress}
          />
          <Image
            onClick={() => {
              setSearchState("SPEAKING");
              dispatch(setQueryType('text'));
              onVoiceSearch();
            }}
            src="/micColourful.svg"
            className="mr-2"
            alt="Mic icon"
            width={24}
            height={24}
          />
          <Image
            onClick={() => {
              setSearchState("CAMERA");
              dispatch(setQueryType('image'));
            }}
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