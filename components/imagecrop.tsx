"use client";

import {
  ImageCrop,
  ImageCropApply,
  ImageCropContent,
  ImageCropReset
} from "@/components/ui/shadcn-io/image-crop";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { XIcon } from "lucide-react";
import { type ChangeEvent, useState } from "react";

export default function ImageCropper({
  setImage
}: {
  setImage: (value: string) => void;
}) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [croppedImage, setCroppedImage] = useState<string | null>(null);

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setCroppedImage(null);
    }
  };

  const handleReset = () => {
    setSelectedFile(null);
    setCroppedImage(null);
  };

  if (!selectedFile) {
    return (
      <Input
        accept="image/*"
        className="w-fit"
        onChange={handleFileChange}
        type="file"
      />
    );
  }

  if (croppedImage) {
    return (
      <div className="space-y-4">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img alt="Cropped" height={100} src={croppedImage} />
        <Button onClick={handleReset} size="icon" type="button" variant="ghost">
          <XIcon className="size-4" />
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <ImageCrop
        aspect={1}
        file={selectedFile}
        maxImageSize={1024 * 1024} // 1MB
        onChange={console.log}
        onComplete={console.log}
        onCrop={setImage}
      >
        <ImageCropContent className="max-w-md" />
        <div className="flex items-center gap-2">
          <ImageCropApply />
          <ImageCropReset />
          <Button
            onClick={handleReset}
            size="icon"
            type="button"
            variant="ghost"
          >
            <XIcon className="size-4" />
          </Button>
        </div>
      </ImageCrop>
    </div>
  );
}
