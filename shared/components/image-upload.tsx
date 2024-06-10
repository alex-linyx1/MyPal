"use client";
import { SquarePen } from "lucide-react";
import { useEffect, useState } from "react";
import { CldUploadButton } from "next-cloudinary";
import Image from "next/image";

interface ImageUploadProps {
    value: string;
    onChange: (src: string) => void;
    disabled?: boolean;
      
};

export const ImageUpload = ({
    value,
    onChange,
    disabled
}: ImageUploadProps) => {
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    const handleUploadError = (error: any) => {
        console.error("Ошибка при загрузке изображения:", error);
    };

    if (!isMounted) {
        return null;
    }

    return (
        <div className="space-y-4 w-full flex flex-start">
            <CldUploadButton
              onSuccess={(result: any) => onChange(result.info.secure_url)}
              onError={handleUploadError}
              options={{
                maxFiles: 1
              }}
              uploadPreset="owxincpm"
            >
            <div className="
             hover:opacity-75
             transition
             flex
             flex-row
             space-y-2
             items-center
             justify-center
            ">
            <div className="relative h-40 w-40">
               <Image
                 fill 
                 alt="Upload"
                 src={value || "/defaultAvatar.svg"}
                 className="object-cover"
               />
               <SquarePen size={20} className="absolute bottom-0 -right-8"></SquarePen> 
            </div>
            </div>
            </CldUploadButton>
        </div>
    )
}