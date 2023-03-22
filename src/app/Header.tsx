'use client'

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation";
import LBLink from "./components/LBLink";

export default function Header() {
  const pathname = usePathname();
  // console.log("pathname", pathname);

  return (
    <header className="bg-neutral-900 p-4 text-gray-400">
      <div className="mx-auto max-w-3xl flex flex-row justify-center items-baseline gap-4">
        <>
          {pathname != '/' && (
            <div className="flex-grow">
              <LBLink href="/" className="text-2xl font-bold">
                Lucas Blotta
              </LBLink>
            </div>
          )}
          {pathname != '/about' && (
            <LBLink href="/about">About</LBLink>
          )}
          {pathname != '/posts' && (
            <LBLink href="/posts">Posts</LBLink>
          )}
          {pathname != '/projects' && (
          <LBLink href="/projects">Projects</LBLink>
          )}
        </>
      </div>
    </header>
  );
}