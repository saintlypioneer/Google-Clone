"use client";

import Image from "next/image";
import React, { useState, useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setQuery, setQueryType, fetchAutocompleteSuggestions, clearSuggestions } from "../store/searchSlice";
import { AppDispatch, RootState } from "../store/store";
import GoogleLensSearchPopup from "./GoogleLensSearchPopup";
import TextButton from "./TextButton";
import debounce from 'lodash/debounce';

type SearchBarState = "IDLE" | "TEXT_SEARCHING" | "SPEAKING" | "CAMERA";

interface SearchBarProps {
  onSearch: () => void;
  onVoiceSearch: () => void;
}

export default function SearchBar({ onSearch, onVoiceSearch }: SearchBarProps) {
  const dispatch = useDispatch<AppDispatch>();
  const { query, suggestions } = useSelector((state: RootState) => state.search);

  const [searchState, setSearchState] = useState<SearchBarState>("IDLE");
  const [isInputFocused, setIsInputFocused] = useState(false);

  const debouncedFetchSuggestions = useCallback(
    debounce((query: string) => {
      if (query.trim()) {
        dispatch(fetchAutocompleteSuggestions(query));
      } else {
        dispatch(clearSuggestions());
      }
    }, 200),
    [dispatch]
  );

  useEffect(() => {
    debouncedFetchSuggestions(query);
    return () => {
      debouncedFetchSuggestions.cancel();
    };
  }, [query, debouncedFetchSuggestions]);

  const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      onSearch();
    }
  };

  const handleQueryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(setQuery(e.target.value));
  };

  const handleSuggestionClick = (suggestion: string) => {
    dispatch(setQuery(suggestion));
    onSearch();
  };

  return (
    <div
      className={`relative w-full max-w-xl ${
        searchState === "IDLE"
          ? "dark:bg-[#202124]"
          : "shadow-[0_1px_6px_0_#171717] dark:bg-[#303134]"
      } hover:bg-[#303134] hover:shadow-[0_1px_6px_0_#171717] ${
        (isInputFocused && query!="") ? "rounded-t-3xl" : "rounded-3xl"
      }`}
    >
      {searchState === "IDLE" && (
        <div
          className={`flex items-center gap-2 p-3 border hover:bg-[#303134] hover:shadow-[0_1px_6px_0_#171717] hover:border-transparent ${
            (isInputFocused && query!="")
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
            onBlur={() => setTimeout(() => setIsInputFocused(false), 200)}
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

      {(isInputFocused && query!="") && (
        <div className="w-full absolute top-[100%] rounded-b-3xl bg-[#303134] shadow-[0_1px_6px_0_#171717, 0, 1px_0_6px_0_#171717,-1px_0_6px_0_#171717]">
          <div className="bg-[#5f6368] h-[1px] w-[96%] m-auto"></div>

          <div className="mt-2">
            <span className="font-sans text-sm text-[#9e9e9e] font-medium px-3">
            Suggestions
            </span>
            <ul className="mt-2">
              {suggestions.map((suggestion, index) => (
                <li
                  key={index}
                  className="flex items-center gap-2 px-3 py-1 hover:bg-[#3c4043] transition-all duration-75 rounded cursor-pointer"
                  onClick={() => handleSuggestionClick(suggestion.value)}
                >
                  <Image
                    src="/searchMagnifier.svg"
                    alt="Search Magnifier"
                    width={20}
                    height={20}
                  />
                  <span className="dark:text-[#e8eaed] text-base">
                    {suggestion.value}
                  </span>
                </li>
              ))}
            </ul>
          </div>
          <div className="flex justify-center gap-3 my-6">
            <TextButton text="Google Search" onClick={onSearch} bgColor="#3c4043" />
            <TextButton text="I'm Feeling Lucky" onClick={() => {}} bgColor="#3c4043" />
          </div>
        </div>
      )}
    </div>
  );
}