"use client";
import axios from "axios";
import { Companion, Message } from "@prisma/client";
import { 
    ArrowLeft, 
    CircleEllipsis, 
    Edit, 
    MessageCircle, 
    Trash 
} from "lucide-react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { BotAvatar } from "@/components/bot-avatar";
import { useUser } from "@clerk/nextjs";
import { 
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/components/ui/use-toast";




interface ChatHeaderProps {
    companion: Companion & {
        messages: Message[];
        _count: {
            messages: number;
        };
    };
};

export const ChatHeader = ({
    companion 
}: ChatHeaderProps) => {
    const router = useRouter();
    const { user } = useUser();
    const { toast } = useToast();

    const onDelete = async () => {
        try {
            await axios.delete(`/api/companion/${companion.id}`);

            toast({
                description: "Персонаж успешно удалён"
            })

          router.push("/");  
          router.refresh();

        } catch (error) {
            toast({
                description: "Что-то пошло не так :(",
                variant: "default"
            })
        }
    }

    return (
        <div className="flex w-full justify-between items-center border-b border-primary/10 pb-4">
            <div className="flex gap-x-2 items-center">
                <Button onClick={() => router.back()} size="icon" variant="navigation">
                <ArrowLeft color="#055ebd" className="h-5 w-6"/>
                </Button>
                <BotAvatar src={companion.src} />
                <div className="flex flex-col gap-y-1">
                <div className="flex items-center gap-x-2">
                <p className="font-bold">
                    {companion.name}
                </p>
                <div className="flex items-center text-xs text-muted-foreground">
                    <MessageCircle className="w-3 h-3 mr-1" />
                    {companion._count.messages}
                </div>
                </div>
                <p className="text-xs text-muted-foreground">
                     Создал: {companion.userName}
                </p>
                </div>
            </div>
            {user?.id === companion.userId && (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="navigation" size="icon">
                        <CircleEllipsis color="#055ebd" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => router.push(`/companion/${companion.id}`)}>
                            <Edit className="w-4 h-4 mr-2" />
                            Редактировать
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={onDelete}>
                            <Trash className="w-4 h-4 mr-2" />
                            Удалить
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            )}
        </div>
    )
}