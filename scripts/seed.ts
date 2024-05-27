const { PrismaClient } = require("@prisma/client");

const db = new PrismaClient();

async function main () {
    try {
      await db.category.createMany({
        data: [
           { name: "Известные личности" }, 
           { name: "Фильмы и сериалы" },
           { name: "Музыканты" },
           { name: "Игры" },
           { name: "Животные" },
           { name: "Философы" },
           { name: "Учёные" },
        ]
      })
    } catch (error) {
      console.error("Error seeding default categories", error);
    } finally {
      await db.$disconnect();
    }
};

main();