import { Categories } from "@/components/categories";
import { Companions } from "@/components/companions";
import SearchInput from "@/components/search-input";
import prismadb from "@/lib/prismadb";
import { NewCompanions } from "@/components/NewCompanions";

interface RootpageProps {
searchParams: {
categoryId: string;
name: string;
};
}

const RootPage = async ({ searchParams }: RootpageProps) => {
  const newCompanions = await prismadb.companion.findMany({
    orderBy: {
    createdAt: "desc",
    },
    take: 4,
    include: {
    _count: {
    select: {
    messages: true,
    },
    },
    },
    });  
  
    const allCompanions = await prismadb.companion.findMany({
    where: {
    categoryId: searchParams.categoryId,
    name: {
    search: searchParams.name,
    },
    },
    orderBy: {
    createdAt: "desc",
    },
    include: {
    _count: {
    select: {
    messages: true,
    },
    },
    },
    });

    const categories = await prismadb.category.findMany();

    return (
    <div className="h-full p-4 pl-20 space-y-4">
    <NewCompanions data={newCompanions} />
    <SearchInput />
    <Categories data={categories} />
    <Companions data={allCompanions} />
    </div>
    );
};

export default RootPage;
