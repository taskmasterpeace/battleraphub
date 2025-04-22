import React, { useRef, useEffect } from "react";
import Image from "next/image";
import { FormControl, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";

interface ImageUploaderProps {
  label: string;
  field: {
    onChange: (files: FileList | null) => void;
  };
  currentImage?: string;
  setPreview: (url: string) => void;
  preview: string;
  createMode: boolean;
  name: string;
}
const ImageUploader: React.FC<ImageUploaderProps> = ({
  label,
  field,
  currentImage = "",
  setPreview,
  preview,
  createMode,
  name,
}) => {
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    return () => {
      if (preview) URL.revokeObjectURL(preview);
    };
  }, [preview]);

  return (
    <>
      <FormItem>
        <FormLabel>{label}</FormLabel>
        <FormControl>
          <div>
            {!createMode && (preview || currentImage) && (
              <div className="my-2 relative group" onClick={() => fileRef.current?.click()}>
                <Image
                  src={preview || currentImage}
                  alt={`${label} preview`}
                  className="h-20 w-40 rounded-lg object-cover border hover:cursor-pointer"
                  width={64}
                  height={64}
                  unoptimized
                />
                <div className="absolute cursor-pointer inset-0 bg-black bg-opacity-40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <span className="text-white text-xs">Upload</span>
                </div>
              </div>
            )}
            <Input
              type="file"
              ref={fileRef}
              className={`${createMode ? "cursor-pointer mb-2" : "hidden"}`}
              accept="image/jpeg,image/jpg,image/png,image/svg+xml,image/webp"
              onChange={(e) => {
                field.onChange(e.target.files);
                if (e.target.files && e.target.files[0]) {
                  const url = URL.createObjectURL(e.target.files[0]);
                  setPreview(url);
                }
              }}
            />
          </div>
        </FormControl>
        <FormMessage />
      </FormItem>

      {!createMode && <Input type="hidden" name={`current${name}`} value={currentImage || ""} />}
    </>
  );
};

export default ImageUploader;
