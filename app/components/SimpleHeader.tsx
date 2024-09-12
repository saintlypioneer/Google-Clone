import Link from "next/link";
import Image from "next/image";

export default function SimpleHeader() {
  return (
    <header className="p-5">
      <nav className="flex items-center justify-between">
        <div>
          <ul className="flex items-center gap-5">
            <li>
              <Link href="/">About</Link>
            </li>
            <li>
              <Link href="/">Store</Link>
            </li>
          </ul>
        </div>
        <div className="flex gap-5">
          <ul className="flex items-center gap-5">
            <li>
              <Link href="/">Gmail</Link>
            </li>
            <li>
              <Link href="/">Images</Link>
            </li>
          </ul>
          <button>
            {" "}
            <Image src="/grid.svg" alt="grid icon" width={24} height={24} />
          </button>
          <button className="dark:bg-[#c2e7ff] dark:text-[#001d35] px-5 py-[10px] rounded-full font-medium">
            Sign in
          </button>
        </div>
      </nav>
    </header>
  );
}
