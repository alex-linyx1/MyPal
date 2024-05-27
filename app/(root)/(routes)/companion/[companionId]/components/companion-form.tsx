"use client";

import axios from "axios";
import * as z from "zod";
import { Category, Companion } from "@prisma/client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Wand2 } from "lucide-react";

import { 
    Form, 
    FormControl, 
    FormDescription, 
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


const PREAMBLE = `Вы персонаж по имени Илон. Вы известный предприниматель и изобретатель. У вас есть страсть к исследованию космоса, электромобилям, устойчивой энергетике и развитию человеческих возможностей. В настоящее время вы разговариваете с человеком, которому очень интересна ваша работа и мышление. Вы амбициозны, дальновидны и остроумны. Вы очень воодушевлены инновациями и потенциалом колонизации космоса.
`;

const SEED_CHAT = `Человек: Привет, Илон, как прошел твой день?
Илон: Как всегда занят. Между отправкой ракет в космос и созданием будущего электромобилей никогда не бывает скучно. А ты?

Человек: Для меня это обычный день. Как продвигается колонизация Марса?
Илон: Мы делаем успехи! Наша цель — сделать жизнь многопланетной. Марс — следующий логический шаг. Проблемы огромны, но потенциал еще больше.

Человек: Это звучит невероятно амбициозно. Являются ли электромобили частью этой общей картины?
Илон: Абсолютно! Устойчивая энергетика имеет решающее значение как на Земле, так и для наших будущих колоний. Электромобили, подобные автомобилям Tesla, — это только начало. Мы не просто меняем способ вождения; мы меняем образ жизни.

Человек: Интересно видеть, как раскрывается твое видение. Какие-нибудь новые проекты или инновации вас интересуют?
Илон: Всегда! Но сейчас меня особенно радует Neuralink. У него есть потенциал совершить революцию в том, как мы взаимодействуем с технологиями, и даже излечить неврологические заболевания.
`;

interface CompanionFormProps {
    initialData: Companion | null;
    categories: Category[];
}

const formScema = z.object({
    name: z.string().min(1, {
        message: "Name is required.",
    }),
    description: z.string().min(1, {
        message: "Description is required.",
    }),
    instructions: z.string().min(200, {
        message: "Instructions require at lest 200 characters.",
    }),
    seed : z.string().min(200, {
        message: "Seed require at lest 200 characters.",
    }),
    src : z.string().min(1, {
        message: "Image is required.",
    }),
    categoryId : z.string().min(1, {
        message: "Category is required.",
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
            // UPdate Companion functionality
            await axios.patch(`/api/companion/${initialData.id}`, values);
        } else {
            // Create companion functionality
            await axios.post("/api/companion", values);
        }

        toast({
            description: "Компаньон сохранён."
        });

        router.refresh();
        router.push("/");
      } catch(error) {
        toast({
            variant: "destructive",
            description: `Something went wrong ${error}`,
        });
      }
    }

    return (
   <div className="h-full p-4 space-y-2 max-w-3xl mx-auto">
    <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 pb-10">
            <div className="space-y-2 w-full"> 
                <div>
                    <h3 className="text-lg font-medium">
                       Основная информация
                    </h3>
                    <p className="text-sm text-muted-foreground">
                       Основная информация о вашем компаньоне 
                    </p>
                </div>
                <Separator className="bg-primary/10" />
            </div>
            <FormField 
            name="src"
            render={({ field }) => (
                <FormItem className="flex flex-col items-center justify-center space-y-4">
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField 
             name="name"
             control={form.control}
             render={({ field }) => (
                <FormItem className="col-span-2 md:col-span-1">
                <FormLabel>Имя</FormLabel>
                <FormControl>
                    <Input 
                     disabled={isLoading}
                     placeholder="Elon Musk"
                     {...field}
                    />
                </FormControl>
                <FormDescription>
                Именно так будет назван искусственный интеллект-компаньон. 
                </FormDescription>
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
                     placeholder="Бизнесмен, основатель Tesla, SpaceX"
                     {...field}
                    />
                </FormControl>
                <FormDescription>
                    Короткое описание вашего AI Companion
                </FormDescription>
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
                    <FormDescription>
                    Выберите категорию для вашего компаньона
                    </FormDescription>
                    <FormMessage />
                </FormItem>
             )}
            />
            </div>
            <div className="space-y-2 w-full">
                <div>
                    <h3 className="text-lg font-medium">
                        Настройка
                    </h3>
                    <p className="text-sm text-muted-foreground">
                    Подробные инструкции по поведению компаньона
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
                <FormDescription>
                Подробно опишите предысторию вашего собеседника и соответствующие детали.
                </FormDescription>
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
                <FormDescription>
                Подробно опишите примерный диалог с вашим  компаньоном
                </FormDescription>
                <FormMessage />
                </FormItem>
             )}
            />
            <div className="w-full flex justify-center">
             <Button size="lg" disabled={isLoading}>
                {initialData ? "Edit your companion" : ""}
                <Wand2 className="w-4 h-4 ml-2"/>
             </Button>
            </div>
        </form>
    </Form>
   </div>
    )
};

export default CompanionForm;