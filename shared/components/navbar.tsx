"use client";

import Image from "next/image"
import { Bebas_Neue } from "next/font/google";
import Link from "next/link";
import { UserButton, useUser } from "@clerk/nextjs";

import { cn } from "@/lib/utils";
import { ModeToggle } from "@/components/mode-toggle";
import { MobileSidebar } from "@/components/mobile-sidebar";

const font = Bebas_Neue({
    weight: "400",
    subsets: ["latin-ext"] 
});

export const Navbar = () => {

  const { isLoaded, isSignedIn, user } = useUser();

  return (
    <div className="fixed w-full z-50 flex justify-between
    items-center py-2 px-4 bg-gradient-to-t from-darkNavBarColor to-lightNavBarColor dark:bg-black/70 h-20">
      <div className="flex items-center ml-4">
        <UserButton afterSignOutUrl="/" />
        <p className="font-black text-black pl-4">{user?.firstName}</p>
        <MobileSidebar />
      </div>
      <div className="flex items-center">
       <Link href="/">
            <Image
            src={"/mypal.svg"}
            alt="mypal"
            width={41.2}
            height={29}
            className="block"
            />
        </Link>
        <h1 className={cn(
          "hidden md:block text-xl md:text-4xl font-bold text-black",
          font.className
        )}> MyPal</h1>
        </div>
      <div className="flex items-center gap-x-3">
      <ModeToggle />
      </div> 
    </div>
  );

};