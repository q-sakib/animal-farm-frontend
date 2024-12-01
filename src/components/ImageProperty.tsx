'use client'; 
import { AnimalCardProps } from "@/types";
import { ImagePreview } from "./Image"; // Adjust the path as necessary


import React, { useState, useEffect } from 'react';


type ImageUploadProps = {

  onImageSelect: (file: File | null) => void;

  errorMessage?: string | null;

  setErrorMessage: (message: string | null) => void;

};

// type ImageUploadProps = {
//   onImageSelect: (file: File | null) => void;
//   errorMessage?: string;
//   setErrorMessage: (message: string | null) => void;
// };

export const ImageUpload: React.FC<ImageUploadProps> = ({ onImageSelect, errorMessage, setErrorMessage }) => {
  const [preview, setPreview] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);

  useEffect(() => {
    if (selectedImage) {
      const previewURL = URL.createObjectURL(selectedImage);
      setPreview(previewURL);

      // Cleanup URL object to prevent memory leaks
      return () => URL.revokeObjectURL(previewURL);
    } else {
      setPreview(null);
    }
  }, [selectedImage]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setErrorMessage('Image size must be less than 5MB.');
        setSelectedImage(null);
        return;
      }
      setSelectedImage(file);
      onImageSelect(file);
      setErrorMessage(null);
    }
  };

  return (
    <div>
      <label htmlFor="image-upload" className="block text-sm font-medium text-gray-700">
        Upload Image
      </label>
      <input
        id="image-upload"
        type="file"
        accept="image/*"
        onChange={handleImageChange}
        className="block w-full text-sm text-gray-900 border border-gray-300 rounded-md cursor-pointer focus:outline-none file:bg-gray-100 file:text-gray-700 file:mr-4 file:px-3 file:py-1 file:rounded-md file:cursor-pointer hover:file:bg-gray-200"
      />
      {errorMessage && <p className="text-red-500 text-sm mt-1">{errorMessage}</p>}
      {preview && (
        // <img
        //   src={preview}
        //   alt="Preview"
        //   className="w-40 h-48 object-cover rounded-md border mt-3 mx-auto"
        // />

        <ImagePreview
          imageUrl={preview}
          altText="Preview"
          // width={160}
          // height={192}
          className="w-40 h-48 object-cover rounded-md border mt-3 mx-auto"
        />

      )}
    </div>
  );
};


// 'use client'
export const AnimalCard: React.FC<AnimalCardProps> = ({ imageUrl, name }) => {
  return (
    <>
      <div className="animal-card flex flex-col items-center text-white">
        <ImagePreview
          imageUrl={imageUrl}
          altText={`Image of ${name}`}
          width={320}
          height={382}
          className="object-cover w-full h-auto rounded-lg shadow-md"
        />
        <div className="name mt-3 text-lg font-semibold uppercase text-opacity-80 text-center">
          {name}
        </div>
      </div>
    </>
  );
};
