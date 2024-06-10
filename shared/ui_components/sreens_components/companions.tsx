import { Companion } from "@prisma/client";
import Image from "next/image";
import Link from "next/link";
import { MessageCircle } from "lucide-react";

interface CompanionsProps {
    data: (Companion & {
        _count: {
            messages: number;
        };
    })[];
}

export const Companions = ({
    data
}: CompanionsProps) => {
    if (data.length === 0) {
        return (
            <div id="companions-section" className="pt-10 flex flex-col items-center justify-center pb-20 space-y-2">
                <div className="relative w-60 h-60">
                    <Image src="/error.svg" fill className="grayscale" alt="Empty" />
                </div>
                <p className="text-sm text-muted-foreground">Персонажи не найдены</p>
                <p className="text-sm text-muted-foreground font-bold">Попробуйте создать новый или обновите страницу</p>
            </div>
        )
    }

    return (
        <div id="companions-section" className="grid grid-cols-4 gap-3 pb-20 pr-4">
            {data.map((companion) => (
                <Link href={`/chat/${companion.id}`} key={companion.id}>
                    <div className="relative group cursor-pointer transition duration-300 border border-primary/20 flex items-center p-4 hover:shadow-blue">
                        <div className="flex-shrink-0 relative w-24 h-24">
                            <Image
                                src={companion.src || "/placeholder.svg"}
                                layout="fill"
                                objectFit="cover"
                                alt="companion image"
                                className="block"
                            />
                        </div>
                        <div className="flex flex-col truncate md:overflow-clip justify-center ml-4">
                            <p className="truncate font-bold text-lg">{companion.name}</p>
                            <div className="flex items-center">
                                <p className="m-0 text-xs text-muted-foreground">создан</p>
                                <p className="m-0 ml-1 text-xs text-muted-background">@{companion.userName}</p>
                            </div>
                            <p className="truncate text-xs text-muted-foreground">{companion.description}</p>
                            <div className="flex items-center text-xs text-muted-foreground mt-2">
                                <MessageCircle className="w-3 h-3 mr-1" />
                                {companion._count.messages}
                            </div>
                        </div>
                    </div>
                </Link>
            ))}
        </div>
    );
};