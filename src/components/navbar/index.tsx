import Image from "next/image";
import Link from "next/link";
import MobileMenu from "./mobile-navbar";

export interface NavbarLink {
  linkText: string;
  href: string;
}

export default function Navbar() {
  const linkArray: NavbarLink[] = [];

  return (
    <nav className="top-0 z-30 flex h-[80px] w-full items-center justify-between px-4 md:px-8">
      <a href="/" className="flex items-center gap-2">
        <h1
          className="text-2xl xl:text-4xl font-[700] text-darkSlate font-newZealand text-[400] "
          style={{ textShadow: "-4px 2px 4px rgba(0,0,0,0.075)" }}
        >
          Movie Mania
        </h1>
      </a>

      <div className="linkContainer flex gap-4">
        {linkArray.map((link: NavbarLink) => {
          return (
            <Link
              href={link.href}
              key={`navLink-${link.linkText}`}
              className="text-primary hidden rounded-md p-3 hover:bg-background-hover active:scale-95 md:flex"
            >
              {link.linkText}
            </Link>
          );
        })}
        {/* <MobileMenu linkArray={linkArray} /> */}
      </div>
    </nav>
  );
}
