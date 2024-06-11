import Image from 'next/image';
import Link from 'next/link';
import MobileMenu from './mobile-navbar';

export interface NavbarLink {
  linkText: string;
  href: string;
}

export default function Navbar() {
  const linkArray: NavbarLink[] = [
    { linkText: 'home', href: '/' },
    { linkText: 'blog', href: '/blog' },
    { linkText: 'movies', href: '/movies'},
    { linkText: 'playlists', href: '/playlists' },
    { linkText: 'contact', href: '/contact' }
  ];

  return (
    <nav className=" fixed top-0 z-30 flex h-[80px] w-full items-center justify-between bg-background bg-opacity-90 px-4 md:px-8">
      <a href="/" className="flex items-center gap-2">
        <h1 className="text-3xl font-[700]">nhcathcart</h1>
        <svg
          width="44"
          height="30"
          viewBox="0 0 195 164"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M148.957 129L146 163H81V94H128.188M148.957 129L152 94H128.188M148.957 129H126L128.188 94M148.957 129H194V49H131L128.188 94M47 31L41 118H110L116 31H47ZM78 1L72 73H147L153 1H78ZM1 102H61L55 163H1V102Z"
            stroke="#E4DBD8"
            strokeWidth={6}
          />
        </svg>
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
        <MobileMenu linkArray={linkArray} />
      </div>
    </nav>
  );
}
