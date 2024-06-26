"use client";

import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";
import qs from "query-string";
import { Category } from "@prisma/client";
import { useRouter, useSearchParams } from "next/navigation";

interface CategoriesProps {
    data: Category[];
};

export const Categories = ({
    data 
}: CategoriesProps) => {
    const router = useRouter();
    const searchParams = useSearchParams();

    const categoryId = searchParams.get("categoryId");

    const onClick = (id: string | undefined) => {
        const query = { categoryId: id };

        const url = qs.stringifyUrl({
            url: window.location.href,
            query,   
        }, 
        
        { skipNull: true });

        router.push(url);
    };

    useEffect(() => {
        const element = document.getElementById("companions-section")
        if (element) {
           element.scrollIntoView({behavior: "smooth", block: "end"})
        }
    }, [categoryId])

    return (
    <div className="w=full overflow-x-auto space-x-2 flex p-1">
        {data.map((item) => (
          <button
          onClick={() => onClick(item.id)}
          key={item.id}
          className={cn(`
          flex
          items-center
          jusitfy-center
          text-center
          text-xs
          md:text-sm
          px-2
          md:px-4
          py-2
          md:py-3
          bg-primary/10
          hover:opacity-75
          transition
          `,
            item.id === categoryId ? "bg-primary/25" : "bg-primary/10"
        )} 
        >
            {item.name}
        </button>  
        ))}
    </div>

    )
}