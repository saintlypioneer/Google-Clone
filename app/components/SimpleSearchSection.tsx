"use client";

import Image from "next/image";
import googleLogo from "/public/googleLogo.png";
import TextButton from "./TextButton";
import SearchBar from "./SearchBar";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../store/store";
import { fetchSearchResults } from "../store/searchSlice";
import { useRouter } from "next/navigation";

const languages = [
  "हिन्दी",
  "বাংলা",
  "తెలుగు",
  "मराठी",
  "தமிழ்",
  "ગુજરાતી",
  "ಕನ್ನಡ",
  "മലയാളം",
  "ਪੰਜਾਬੀ",
];

export default function SimpleSearchSection() {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const { query, queryType } = useSelector((state: RootState) => state.search);

  const handleSearch = () => {
    if (query.trim() && queryType === 'text') {
      dispatch(fetchSearchResults({ query, queryType }));
      router.push("/lens");
    }
  };

  const handleVoiceSearch = () => {
    router.push("/voice");
  };

  return (
    <section className="flex flex-col justify-center items-center gap-6">
      <Image src={googleLogo} alt="" />
      <SearchBar onSearch={handleSearch} onVoiceSearch={handleVoiceSearch} />
      <div className="flex justify-center gap-3">
        <TextButton text="Google Search" onClick={handleSearch} />
        <TextButton text="I'm Feeling Lucky" onClick={() => {}} />
      </div>
      <div className="text-[13px] flex items-center gap-2 dark:text-[#99c3ff] cursor-pointer">
        <span className="dark:text-[#e8e8e8] cursor-text font-normal">
          Google offered in:
        </span>
        {languages.map((language, index) => (
          <span key={index} className="hover:underline">
            {language}
          </span>
        ))}
      </div>
    </section>
  );
}