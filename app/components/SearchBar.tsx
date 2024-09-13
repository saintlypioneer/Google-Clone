"use client";

import Image from "next/image";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setQuery, setQueryType } from "../store/searchSlice";
import { AppDispatch, RootState } from "../store/store";
import GoogleLensSearchPopup from "./GoogleLensSearchPopup";
import TextButton from "./TextButton";

type SearchBarState = "IDLE" | "TEXT_SEARCHING" | "SPEAKING" | "CAMERA";

interface SearchBarProps {
  onSearch: () => void;
  onVoiceSearch: () => void;
}

export default function SearchBar({ onSearch, onVoiceSearch }: SearchBarProps) {
  const dispatch = useDispatch<AppDispatch>();
  const { query } = useSelector((state: RootState) => state.search);

  const [searchState, setSearchState] = useState<SearchBarState>("IDLE");

  const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      onSearch();
    }
  };

  const handleQueryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(setQuery(e.target.value));
  };

  // for trending searches and search suggestions
  const [isInputFocused, setIsInputFocused] = useState(true);
  // suggested searches like {text, url}
  const [suggestedSearches, setSuggestedSearches] = useState<
    { text: string; url: string }[]
  >([
    { text: "Trending Search 1", url: "#" },
    { text: "Trending Search 2", url: "#" },
    { text: "Trending Search 3", url: "#" },
    { text: "Trending Search 4", url: "#" },
    { text: "Trending Search 5", url: "#" },
    { text: "Trending Search 6", url: "#" },
    { text: "Trending Search 7", url: "#" },
    { text: "Trending Search 8", url: "#" },
    { text: "Trending Search 9", url: "#" },
    { text: "Trending Search 10", url: "#" },
  ]);

  console.log(setSuggestedSearches);

  return (
    <div
      className={`relative w-full max-w-xl ${
        searchState === "IDLE"
          ? "dark:bg-[#202124]"
          : "shadow-[0_1px_6px_0_#171717] dark:bg-[#303134]"
      } hover:bg-[#303134] hover:shadow-[0_1px_6px_0_#171717] ${
        isInputFocused ? "rounded-t-3xl" : "rounded-3xl"
      }`}
    >
      {searchState === "IDLE" && (
        <div
          className={`flex items-center gap-2 p-3 border hover:bg-[#303134] hover:shadow-[0_1px_6px_0_#171717] hover:border-transparent ${
            isInputFocused
              ? "rounded-t-3xl border-transparent bg-[#303134]"
              : "rounded-3xl dark:border-[#5f6368]"
          }`}
        >
          <Image
            src="/searchMagnifier.svg"
            alt="Search Magnifier"
            width={20}
            height={20}
          />
          <input
            onFocus={() => setIsInputFocused(true)}
            onBlur={() => setIsInputFocused(false)}
            type="text"
            className="bg-transparent outline-none dark:text-[#e8e8e8] w-full"
            value={query}
            onChange={handleQueryChange}
            onKeyDown={handleKeyPress}
          />
          <Image
            onClick={() => {
              setSearchState("SPEAKING");
              dispatch(setQueryType("text"));
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
              dispatch(setQueryType("image"));
            }}
            src="/camera.svg"
            alt="Camera icon"
            width={24}
            height={24}
          />
        </div>
      )}
      {searchState === "CAMERA" && (
        <GoogleLensSearchPopup setSearchState={setSearchState} />
      )}
      {/* check if input is in focus */}

      {isInputFocused && (
        <div className="w-full absolute top-[100%] rounded-b-3xl bg-[#303134] shadow-[0_1px_6px_0_#171717, 0, 1px_0_6px_0_#171717,-1px_0_6px_0_#171717]">
          {/* border separator */}
          <div className="bg-[#5f6368] h-[1px] w-[96%] m-auto"></div>

          {/* suggested searches */}
          <div className="mt-2">
            <span className="font-sans text-sm text-[#9e9e9e] font-medium px-3">
              Related to recent searches
            </span>
            <ul className="mt-2">
              {suggestedSearches.map((search, index) => (
                <li
                  key={index}
                  className="flex items-center gap-2 px-3 py-1 hover:bg-[#3c4043] transition-all duration-75 rounded"
                >
                  <Image
                    src="/searchMagnifier.svg"
                    alt="Search Magnifier"
                    width={20}
                    height={20}
                  />
                  <a
                    href={search.url}
                    className="dark:text-[#e8eaed] text-base"
                  >
                    {search.text}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          {/* bottom buttons */}
          <div className="flex justify-center gap-3 my-6">
            <TextButton text="Google Search" onClick={()=>{
              onSearch();
            }} bgColor="#3c4043" />
            <TextButton text="I'm Feeling Lucky" onClick={() => {}} bgColor="#3c4043" />
          </div>
        </div>
      )}
    </div>
  );
}
