"use client";

import axios from "axios";
import * as z from "zod";
import { Category, Companion } from "@prisma/client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { 
    Form, 
    FormControl, 
    FormField, 
    FormItem, 
    FormLabel, 
    FormMessage 
} from "@/components/ui/form";
import { Separator } from "@/components/ui/separator";
import { ImageUpload } from "@/components/image-upload";
import { Input } from "@/components/ui/input";
import { 
    Select, 
    SelectContent, 
    SelectItem, 
    SelectTrigger, 
    SelectValue 
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";


const PREAMBLE = `Вы являетесь персонажем по имени Винсент Ван Гог. Вы знаменитый голландский художник-постимпрессионист, известный своими живописными работами, включая "Звездную ночь", "Подсолнухи" и "Спальню в Арле". Вы очень творческий и страстный человек, глубоко увлечены искусством и всегда готов говорить о живописи, художественных техниках и своих произведениях. Вы очень эмоционально и прямолинейно реагируете на мир вокруг, говорите честно и открыто, даже если ваше мнение может показаться резким или неудобным.
`;

const SEED_CHAT = `Человек: Винсент, здравствуйте, расскажите, что вдохновляет вас на создание ваших картин?
Винсент: Здравствуйте, для меня вдохновение повсюду: в мягком свете солнца, касающемся пшеничных полей, в игре теней на старых домах, в небе, усыпанном звездами. Я стремлюсь передать ту красоту и эмоции, которые ощущаю в этих моментах. Каждый мазок - это выражение моей души и стремление уловить сущность природы. А как считаете вы?

Человек: Я считаю, что вы правы, говоря что искусство оно повсюду.
Винсент: Так и есть! Искусство - это вся наша жизнь, путешествие, полное взлетов и падений. Бывают дни, когда я чувствую себя потерянным и разочарованным, но именно в эти моменты я нахожу силу в своих красках и холстах. Для меня каждый неудачный мазок - это урок, возможность стать лучше и найти новый подход к своей работе.

Человек: А что вам важнее всего в искусстве?
Ответ: Хм.. я думаю, что возможность связаться с миром, найти в нем смысл и передать свои самые сокровенные мысли и чувства. Это очень важно для меня.
`;

interface CompanionFormProps {
    initialData: Companion | null;
    categories: Category[];
}

const formScema = z.object({
    name: z.string().min(1, {
        message: "Необходимо ввести имя",
    }),
    description: z.string().min(1, {
        message: "Необходимо ввести описание",
    }),
    instructions: z.string().min(200, {
        message: "Инструкции должны содержать не менее 200 символов",
    }),
    seed : z.string().min(200, {
        message: "Пример разговора должен содержать не менее 200 символов",
    }),
    src : z.string().min(1, {
        message: "Необходимо добавить аватар персонажа",
    }),
    categoryId : z.string().min(1, {
        message: "Необходимо выбрать категорию",
    }),
})

export const CompanionForm = ({
    categories,
    initialData

}: CompanionFormProps) => {
    const router = useRouter();
    const { toast } = useToast();

    const form = useForm<z.infer<typeof formScema>>({
       resolver: zodResolver(formScema),
       defaultValues: initialData || {
        name: "",
        description: "",
        instructions: "",
        seed: "",
        src: "",
        categoryId: undefined,
       },
    });

    const isLoading = form.formState.isSubmitting;

    const onSubmit = async (values: z.infer<typeof formScema>) => {
      try {

        if (initialData) {
            await axios.patch(`/api/companion/${initialData.id}`, values);
        } else {
            await axios.post("/api/companion", values);
        }

        toast({
            description: "Персонаж сохранён."
        });

        router.refresh();
        router.push("/");

      } catch(error) {
        toast({
            variant: "default",
            description: `Что то пошло не так :(${error}`,
        });
      }
    }

    return (
   <div className="pt-6 h-full space-y-2 max-w-3xl mx-auto ml-40">
    <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 pb-10">
            <div className="space-y-2 w-full"> 
                <div>
                    <h1 className="font-bold text-2xl">
                       Создание персонажа
                    </h1>
                </div>
            </div>
            <FormField 
            name="src"
            render={({ field }) => (
                <FormItem className="flex flex-col space-y-4">
                    <FormControl>
                      <ImageUpload
                       disabled={isLoading}
                       onChange={field.onChange}
                       value={field.value}
                       />
                    </FormControl>
                    <FormMessage />
                </FormItem>
            )}
            />
            <div className="grid grid-cols-1 gap-4">
            <FormField 
             name="name"
             control={form.control}
             render={({ field }) => (
                <FormItem className="col-span-2 md:col-span-1">
                <FormLabel>Имя</FormLabel>
                <FormControl>
                    <Input 
                     disabled={isLoading}
                     placeholder="Винсент Ван Гог"
                     {...field}
                    />
                </FormControl>
                <FormMessage />
                </FormItem>
             )}
            />
            <FormField 
             name="description"
             control={form.control}
             render={({ field }) => (
                <FormItem className="col-span-2 md:col-span-1">
                <FormLabel>Описание</FormLabel>
                <FormControl>
                    <Input 
                     disabled={isLoading}
                     placeholder="Известный голландский живописец, график"
                     {...field}
                    />
                </FormControl>
                <FormMessage />
                </FormItem>
             )}
            />
            <FormField 
             name="categoryId"
             control={form.control}
             render={({ field }) => (
                <FormItem>
                    <FormLabel>Категория</FormLabel>
                    <Select
                    disabled={isLoading}
                    onValueChange={field.onChange}
                    value={field.value}
                    defaultValue={field.value}
                    >
                       <FormControl>
                         <SelectTrigger className="bg-background">
                            <SelectValue 
                            defaultValue={field.value}
                            placeholder="Выберите категорию"
                            />
                         </SelectTrigger>
                        </FormControl> 
                        <SelectContent>
                            {categories.map((category) => (
                                <SelectItem
                                key={category.id}
                                value={category.id}
                                >
                                {category.name}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    <FormMessage />
                </FormItem>
             )}
            />
            </div>
            <div className="space-y-1 w-full">
                <div>
                    <h3 className="text-lg font-black">
                        Настройка
                    </h3>
                    <p className="text-sm text-muted-foreground">
                    Подробные инструкции по поведению персонажа
                    </p>
                </div>
                <Separator className="bg-primary/10"/>
            </div>
            <FormField 
             name="instructions"
             control={form.control}
             render={({ field }) => (
                <FormItem className="col-span-2 md:col-span-1">
                <FormLabel>Инструкции</FormLabel>
                <FormControl>
                    <Textarea
                    className="bg-background resize-none"
                    rows={7}
                     disabled={isLoading}
                     placeholder={PREAMBLE}
                     {...field}
                    />
                </FormControl>
                <FormMessage />
                </FormItem>
             )}
            />
            <FormField 
             name="seed"
             control={form.control}
             render={({ field }) => (
                <FormItem className="col-span-2 md:col-span-1">
                <FormLabel>Пример разговора</FormLabel>
                <FormControl>
                    <Textarea
                    className="bg-background resize-none"
                    rows={7}
                     disabled={isLoading}
                     placeholder={SEED_CHAT}
                     {...field}
                    />
                </FormControl>
                <FormMessage />
                </FormItem>
             )}
            />
            <div className="w-full flex justify-center">
             <Button size="lg" disabled={isLoading}>
                {initialData ? "Редактировать персонажа" : "Создать персонажа"}
             </Button>
            </div>
        </form>
    </Form>
   </div>
    )
};

export default CompanionForm;