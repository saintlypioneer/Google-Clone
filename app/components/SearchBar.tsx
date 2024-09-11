import Image from "next/image";

export default function SearchBar(){
    return (
        <div className="w-full max-w-xl bg-red-200 border dark:border-[#5f6368] dark:bg-[#202124] rounded-full p-3 flex items-center gap-5">
            <Image src="/searchMagnifier.svg" alt="Search Magnifier" width={20} height={20} />
            <input type="text" className="bg-transparent outline-none dark:text-[#e8e8e8] dark:bg-[#202124] w-full" />
            <Image src="/mic.svg" alt="Search Magnifier" width={24} height={24} />
            <Image src="/camera.svg" alt="Search Magnifier" width={24} height={24} />
        </div>
    );
}