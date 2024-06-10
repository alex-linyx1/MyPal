const { PrismaClient } = require("@prisma/client");

const db = new PrismaClient();

async function main () {
    try {
      await db.category.createMany({
        data: [
           { name: "Известные личности" }, 
           { name: "Фильмы и сериалы" },
           { name: "Аниме" },
           { name: "Игры" },
           { name: "Блоггеры" },
           { name: "Философы" },
           { name: "Учёные" },
        ]
      })

    } catch (error) {
      console.error("ОШИБКА: невозможно найти категории", error);

    } finally {
      await db.$disconnect();
    }
};

main();