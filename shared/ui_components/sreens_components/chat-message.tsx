"use client";

import { useToast } from "@/components/ui/use-toast";
import { BeatLoader } from "react-spinners";
import { Copy, FilePen } from "lucide-react";

import { cn } from "@/lib/utils";
import { useTheme } from "next-themes";
import { BotAvatar } from "@/components/bot-avatar";
import { UserAvatar } from "@/components/user-avatar";
import { Button } from "@/components/ui/button";


export interface ChatMessageProps {
    role: "system" | "user",
    content?: string;
    isLoading?: boolean;
    src?: string;
}

export const ChatMessage = ({
    role,
    content,
    isLoading,
    src
}: ChatMessageProps) => {
    const { toast } = useToast();
    const { theme } = useTheme();

    const onCopy = () => {
        if (!content) {
            return;
        }

        navigator.clipboard.writeText(content);
        toast({
            description: "Сообщение скопировано",
        });
    }

    return (
        <div className={cn(
            "group flex items-start gap-x-3 py-4 w-full",
             role === "user" && "justify-end"
        )}>

        {role !== "user" && src && <BotAvatar src={src}/>}
        <div className={cn(
            "rounded-md px-3 py-3 max-w-sm text-sm border border-primary",
            role === "user" ? "bg-blue-100" : "bg-gray-200"
        )}>

        { isLoading ? <BeatLoader
            size={5}
            color={theme === "light" ? "white" : "black"}
        />
        : content
        }
        </div>

        {role === "user" && <UserAvatar />}
        {role !== "user" && !isLoading && (
        <Button
            onClick={onCopy}
            className="opacity-0 group-hover:opacity-100 transition"
            size="icon"
            variant="outline"
        >
        <FilePen className="w-4 h-4 fg-primary/40" />
        </Button>
        )}
        </div>
    )        
}