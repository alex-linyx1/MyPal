import { currentUser } from "@clerk/nextjs";
import { NextResponse } from "next/server";

import prismadb from "@/lib/prismadb";

export async function POST(req: Request) {
    try {
     const body = await req.json();
     const user = await currentUser();
     const { src, name, description, instructions, seed, categoryId } = body;

    if (!user || !user.id || !user.firstName) {
        return new NextResponse("Пользователь неавторизован", { status: 401 });
    }

    if (!src || !name || !description || !instructions || !seed || !categoryId) {
        return new NextResponse("Пропущены требуемые поля персонажа", { status: 400 });
    }

    const companion = await prismadb.companion.create({
        data: {
            categoryId,
            userId: user.id,
            userName: user.firstName, 
            src,
            name,
            description,
            instructions,
            seed
        }
    });

    return NextResponse.json(companion);
    } catch (error) {
        console.log("Ошибка при записи данных персонажа", error);
        return new NextResponse("неизвестная ошибка", { status: 500});
    }
}