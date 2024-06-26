import { auth, currentUser } from "@clerk/nextjs";
import { NextResponse } from "next/server";

import prismadb from "@/lib/prismadb";

export async function PATCH(
    req: Request,
    { params }: { params: { companionId: string } }
) {
    try {
     const body = await req.json();
     const user = await currentUser();
     const { src, name, description, instructions, seed, categoryId } = body;

    if (!params.companionId) {
        return new NextResponse("Требуется id персонажа", { status: 400 });
    }

    if (!user || !user.id || !user.firstName) {
        return new NextResponse("Пользовател не авторизован", { status: 401 });
    }

    if (!src || !name || !description || !instructions || !seed || !categoryId) {
        return new NextResponse("Потеряны требуемые поля юзера", { status: 400 });
    }

    const companion = await prismadb.companion.update({
        where: {
            id: params.companionId,
            userId: user.id,
        },
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
        console.log("Ошибка с обновлением данных персонажа", error);
        return new NextResponse("неизвестная ошибка", { status: 500});
    }
}

export async function DELETE(
    request: Request,
    { params }: { params: { companionId: string} }
) {
    try {
        const { userId } = auth();

        if (!userId) {
            return new NextResponse("Пользователь неавторизован", { status: 401 });
        }

        const companion = await prismadb.companion.delete({
            where: {
                userId,
                id: params.companionId,
            }
        });

      return NextResponse.json(companion); 
    } catch (error) {
        console.log("Ошибка при удалении персонажа", error);
        return new NextResponse("Неизвестная ошибка", { status: 500});
    }
}