"use client";

import {Compass, Pickaxe, Settings } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";


import { cn } from "@/lib/utils";

export const Sidebar = () => {
  const pathname = usePathname();
  const router = useRouter();

  const routes = [
    {
      icon: Compass,
      href: "/",
      label: "Главная",
      pro: false,
    },   
    {
      icon: Pickaxe,
      href: "/companion/new",
      label: "Создать",
      pro: true,
    },   
    {
      icon: Settings,
      href: "/settings",
      label: "Настройки",
      pro: false,
    },   
  ];

 const onNavigate = (url: string, pro: boolean) => {
    return router.push(url);
 }

  return (
    <div className="space-y-4 flex flex-col h-full text-primary bg-primary-foreground pt-4">
     <div className="flex flex-1 justify-center">
       <div className="">
        {routes.map((route)=>(
            <div
            onClick={() => onNavigate(route.href, route.pro)}
            key={route.href}
            className={cn(
               "text-muted-foreground text-s group flex p-3 pl-7 pr-20 w-full justify-start font-medium cursor-pointer hover:text-primary hover:bg-primary/5 transition",
                pathname === route.href && "bg-primary/20 text-black dark:text-white"
            )}
            >
              <div className="flex flex-row gap-x-2 
              items-center flex-1">
              <route.icon className="h-4 w-4" />
              {route.label}
              </div>
            </div>
        ))}
       </div>
     </div>
    </div>
  )
}