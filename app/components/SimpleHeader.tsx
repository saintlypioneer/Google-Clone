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
            <Image src="/searchlabs.svg" alt="search" width={24} height={24} />
          </button>
          <button>
            {" "}
            <Image src="/grid.svg" alt="grid" width={24} height={24} />
          </button>
          <button>
            <Image src="/avatar.png" alt="search" width={20} height={20} />
          </button>
        </div>
      </nav>
    </header>
  );
}
