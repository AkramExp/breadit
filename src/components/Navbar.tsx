import Link from "next/link";
import React from "react";
import { Icons } from "./Icons";
import { buttonVariants } from "./ui/Button";
import { getAuthSession } from "@/lib/auth";
import UserAccountNav from "./UserAccountNav";
import SearchBar from "./SearchBar";
import Image from "next/image";
import { cn } from "@/lib/utils";

const Navbar = async () => {
  const session = await getAuthSession();

  return (
    <div className="fixed top-0 inset-x-0 h-fit bg-zinc-50 border-b border-zinc-300 z-[10] py-2">
      <div className="container max-w-7xl h-full flex items-center justify-between gap-2">
        <Link href="/" className="flex gap-2 items-center">
          <Image
            height={0}
            width={0}
            src="/reddit-icon.svg"
            alt="logo"
            className="w-12 sm:w-10 lg:w-8"
          />
          <p className="hidden text-zinc-700 text-lg font-semibold md:block">
            Reddit
          </p>
        </Link>

        <SearchBar />

        {session?.user ? (
          <UserAccountNav user={session?.user} />
        ) : (
          <Link href="/sign-in" className={cn(buttonVariants(), "min-w-20")}>
            Sign In
          </Link>
        )}
      </div>
    </div>
  );
};

export default Navbar;
