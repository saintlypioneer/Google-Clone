import Link from "next/link";
import Image from "next/image";

export default function SimpleFooter() {
  return (
    <footer className="dark:bg-[#171717]">
      <div className="border-b p-3 dark:border-b-[#313335] font-bold">
        <span>India</span>
      </div>
      <div className="p-3 flex flex-wrap justify-between px-3">
        <ul className="flex items-center justify-center gap-5">
          <li>
            <Link href="/">Advertising</Link>
          </li>
          <li>
            <Link href="/">Business</Link>
          </li>
          <li>
            <Link href="/">How Search works</Link>
          </li>
        </ul>
        <ul className="flex items-center justify-center gap-5">
          <li>
            <Link href="/">Privacy</Link>
          </li>
          <li>
            <Link href="/">Terms</Link>
          </li>
          <li>
            <Link href="/">Settings</Link>
          </li>
        </ul>
      </div>
    </footer>
  );
}
