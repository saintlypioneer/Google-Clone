import Link from "next/link";
import Image from "next/image";

export default function GoogleLensNavigation() {
  return (
    
      <nav className="flex items-center justify-between">
        <Link href="/">
          <Image
            src="/google-full-icon.svg"
            alt="Google full icon"
            width={90}
            height={100}
          />
        </Link>
        <div className="flex gap-4">
          <button className="flex items-center gap-1 hover:bg-[rgba(0,0,0,0.03)] px-4 py-1 rounded">
            <Image
              src="/upload-grey.svg"
              alt="Upload icon"
              width={24}
              height={24}
            />
            <span className="text-[#5f6368] font-sans text-base font-medium">
              Upload
            </span>
          </button>
          <div className="flex gap-3">
            <button className="flex items-center gap-1 hover:bg-[rgba(0,0,0,0.03)] px-2 py-[6px] rounded-full">
              <Image
                src="/grid-grey.svg"
                alt="Grid grey icon"
                width={24}
                height={24}
              />
            </button>
            <button className="bg-[#1a73e8] hover:bg-[#1b66c9] font-sans font-medium text-sm text-white px-5 py-[6px] rounded">
                Sign in
            </button>
          </div>
        </div>
      </nav>
  );
}
