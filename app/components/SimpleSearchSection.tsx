import Image from "next/image";
import googleLogo from "/public/googleLogo.png";
import TextButton from "./TextButton";
import SearchBar from "./SearchBar";

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
  return (
    <section className="flex flex-col justify-center items-center gap-6">
      <Image src={googleLogo} alt="" />
      <SearchBar />
      <div className="flex justify-center gap-3">
        {/* buttons */}
        <TextButton text="Google Search" onClick={() => {}} />
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
