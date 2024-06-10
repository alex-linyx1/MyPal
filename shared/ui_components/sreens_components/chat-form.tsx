"use client";

import { ChatRequestOptions } from "ai";
import { ChangeEvent, FormEvent } from "react";
import { CircleArrowUp, SendHorizonal } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";


interface ChatFormProps {
    input: string;
    handleInputChange: (e: ChangeEvent<HTMLInputElement> | ChangeEvent<HTMLTextAreaElement>) => void;
    onSubmit: (e: FormEvent<HTMLFormElement>, chatRequestOptions?: ChatRequestOptions | undefined) => void;
    isLoading: boolean;
}

export const ChatForm = ({
    input,
    handleInputChange,
    onSubmit,
    isLoading
}: ChatFormProps) => {
    return (
        <form 
        onSubmit={onSubmit}
        className="py-4 flex items-center gap-x-2"
        >
        <Input 
          disabled={isLoading}
          value={input}
          onChange={handleInputChange}
          placeholder="Введите сообщение"
          className=""
        />
        <Button disabled={isLoading} variant="navigation">
            <CircleArrowUp color="#055ebd" className="h-7 w-7"/>
        </Button>
        </form>
    )
}