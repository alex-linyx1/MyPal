import { Companion } from "@prisma/client";
import Image from "next/image";
import Link from "next/link";
import { MessageCircle } from "lucide-react";

interface NewCompanionsProps {
    data: (Companion & {
        _count: {
            messages: number;
        };
    })[];
}

export const NewCompanions = ({ data }: NewCompanionsProps) => {

    return (
        <div className="space-y-4">
            <h2 className="text-lg font-medium">Новые персонажи</h2>
            <div className="grid grid-cols-4 gap-3 pb-10 pr-4">
                {data.map((companion) => (
                    <Link href={`/chat/${companion.id}`} key={companion.id}>
                        <div className="relative group cursor-pointer transition duration-300 border border-primary/20 flex items-center p-4 hover:shadow-blue">
                            <div className="relative z-20 flex-shrink-0 w-24 h-24">
                                <Image
                                    src={companion.src || "/placeholder.svg"}
                                    layout="fill"
                                    objectFit="cover"
                                    alt="companion image"
                                    className="block"
                                />
                            </div>
                            <div className="relative z-20 flex flex-col truncate md:overflow-clip justify-center ml-4">
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
        </div>
    );
};
