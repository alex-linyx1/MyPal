import { Replicate } from "@langchain/community/llms/replicate";
import { NextResponse } from "next/server";
import { MemoryManager } from "@/lib/memory";
import { ratelimit } from "@/lib/rate-limit";
import prismadb from "@/lib/prismadb";

import { StreamingTextResponse, LangChainStream, LangChainAdapter } from "ai";
import { auth, currentUser } from "@clerk/nextjs";
import { CallbackManager } from "@langchain/core/callbacks/manager";

export async function POST(
    request: Request,
    { params }: { params: { chatId: string} }
) {
    try {
        const { prompt } = await request.json();
        const user = await currentUser();

        if (!user || !user.firstName || !user.id) {
            return new NextResponse("Пользователь неавторизован", { status: 401 });
        }

        const identifier = request.url + "-" + user.id;
        console.log("DEBUG: запрос " + request.url)
        const { success } = await ratelimit(identifier);

        if (!success) {
            return new NextResponse("Достигнут лимит", { status: 429 });
        }

        const companion = await prismadb.companion.update({
            where: {
                id: params.chatId,
            },
            data: {
                messages: {
                    create: {
                        content: prompt,
                        role: "user",
                        userId: user.id,
                    }
                }
            }
        });

        if (!companion) {
            return new NextResponse("Персонаж не найден :(", { status: 404 });
        }

       const name = companion.id;
       const companion_file_name = name + ".txt";
       
       const companionKey = {
        companionName: name,
        userId: user.id,
        modelName: "dolphin-2.9",
       };

       const memoryManager = await MemoryManager.getInstance();

       const records = await memoryManager.readLatestHistory(companionKey);

       if (records.length === 0) {
        await memoryManager.seedChatHistory(companion.seed, "\n\n", companionKey);
       }

       await memoryManager.writeToHistory("User: " + prompt + "\n", companionKey);

       const recentChatHistory = await memoryManager.readLatestHistory(companionKey);

       const similarDocs = await memoryManager.vectorSearch(
        recentChatHistory,
        companion_file_name,
       );

       let relevantHistory = "";

       if (!!similarDocs && similarDocs.length !== 0) {
        relevantHistory = similarDocs.map((doc) => doc.pageContent).join("\n");
       }

       const { handlers } = LangChainStream();

       const model = new Replicate({
        model:
        "mikeei/dolphin-2.9-llama3-70b-gguf:7cd1882cb3ea90756d09decf4bc8a259353354703f8f385ce588b71f7946f0aa",
        input: {
            max_length: 2048,
        },
        apiKey: process.env.REPLICATE_API_TOKEN,
        callbackManager: CallbackManager.fromHandlers(handlers),
       });

       model.verbose = true;

       console.log("DEBUG: recent history" + recentChatHistory + "\n relveant history" + relevantHistory + "\n")

       const resp = String(
        await model 
            .invoke(
                `
                These are your instructions, who you are and how you should respond: ${companion.instructions}
                ONLY generate plain sentences without prefix of who is speaking. DO NOT use ${companion.name}: prefix. 
                Below is an example of how you should communicate with a User (which is "Человек" here) and the history of your previous dialogue with the User. You should ONLY respond to the User's LAST message, taking into account the context of the dialogue and not repeating your earlier responses:
                ${relevantHistory}
        
        
                ${recentChatHistory}\n ${companion.name} (YOU):`
            )
            .catch(console.error)
       );

       console.log("DEBUG: первый response is" + resp)

       const cleaned = resp.replaceAll(",", "");
       const chunks = cleaned.split("\n");
       const response = chunks[0];

       console.log("DEBUG: второй response is" + response)
       await memoryManager.writeToHistory("" + resp.trim(), companionKey);
       var Readable = require("stream").Readable;
   
       let s = new Readable();
       s.push(resp);
       s.push(null);

       if (resp !== undefined && resp.length > 1) {
         memoryManager.writeToHistory("" + resp.trim(), companionKey);

        await prismadb.companion.update({
            where: {
                id: params.chatId,
            },
            data: {
                messages: {
                    create: {
                        content: resp.trim(),
                        role: "system",
                        userId: user.id
                    }
                }
            }
        })
       };

       return new StreamingTextResponse(s);

    } catch (error) {
        console.log("Ошибка с сохранением информации о сообщениях в диалоге с персонажем", error);
        return new NextResponse("Неизвестная ошибка", { status: 500 });
    }
}
    
