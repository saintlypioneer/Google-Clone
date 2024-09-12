import Link from "next/link";

export default function SimpleFooter() {
  return (
    <footer className="dark:bg-[#171717]">
      <div className="border-b px-6 py-3 dark:border-b-[#313335] font-bold">
        <span>India</span>
      </div>
      <div className="px-6 py-4 flex flex-wrap justify-between">
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
